import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { BackupService } from '@/lib/services/backup.service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workspace_connection_id, backup_config_id } = body;

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
    console.error('Error creating backup:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}
