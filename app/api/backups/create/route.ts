import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { BackupService } from '@/lib/services/backup.service';
import { z } from 'zod';

// Input validation schema
const createBackupSchema = z.object({
  workspace_connection_id: z.string().uuid(),
  backup_config_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate input
    const body = await request.json();
    const validationResult = createBackupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input parameters' },
        { status: 400 }
      );
    }

    const { workspace_connection_id, backup_config_id } = validationResult.data;

    // CRITICAL: Verify workspace belongs to user
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspace_connections')
      .select('id')
      .eq('id', workspace_connection_id)
      .eq('user_id', session.user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: 'Workspace not found or access denied' },
        { status: 403 }
      );
    }

    // CRITICAL: Verify backup config belongs to user
    const { data: backupConfig, error: configError } = await supabase
      .from('backup_configs')
      .select('id')
      .eq('id', backup_config_id)
      .eq('user_id', session.user.id)
      .single();

    if (configError || !backupConfig) {
      return NextResponse.json(
        { error: 'Backup configuration not found or access denied' },
        { status: 403 }
      );
    }

    const backupService = new BackupService();

    // Check usage limits
    const canBackup = await backupService.checkUsageLimit(session.user.id);
    if (!canBackup) {
      return NextResponse.json(
        { error: 'Daily backup limit reached. Upgrade to create more backups.' },
        { status: 429 }
      );
    }

    // Create backup
    const backupId = await backupService.createBackup(
      session.user.id,
      workspace_connection_id,
      backup_config_id,
      'manual'
    );

    return NextResponse.json({
      success: true,
      backup_id: backupId,
      message: 'Backup started successfully'
    });

  } catch (error) {
    // Don't log sensitive error details
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}
