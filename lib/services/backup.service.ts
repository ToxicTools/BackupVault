import { supabaseAdmin } from '@/lib/supabase/client';
import { NotionService } from './notion.service';
import { TrelloService } from './trello.service';
import { StorageService } from './storage.service';

export class BackupService {
  async createBackup(
    userId: string,
    workspaceConnectionId: string,
    backupConfigId: string,
    backupType: 'manual' | 'automatic'
  ): Promise<string> {
    // Create backup record
    const { data: backup, error } = await supabaseAdmin
      .from('backups')
      .insert({
        user_id: userId,
        backup_config_id: backupConfigId,
        workspace_connection_id: workspaceConnectionId,
        backup_type: backupType,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Process backup asynchronously
    this.processBackup(backup.id).catch(console.error);

    return backup.id;
  }

  private async processBackup(backupId: string): Promise<void> {
    try {
      // Update status to in_progress
      await supabaseAdmin
        .from('backups')
        .update({
          status: 'in_progress',
          backup_started_at: new Date().toISOString()
        })
        .eq('id', backupId);

      // Fetch backup details
      const { data: backup } = await supabaseAdmin
        .from('backups')
        .select(`
          *,
          backup_config:backup_config_id (
            *,
            workspace_connection:workspace_connection_id (*),
            storage_connection:storage_connection_id (*)
          )
        `)
        .eq('id', backupId)
        .single();

      if (!backup) throw new Error('Backup not found');

      const { workspace_connection, storage_connection } = backup.backup_config as any;

      // Export data based on workspace type
      let exportedData;
      if (workspace_connection.workspace_type === 'notion') {
        const notionService = new NotionService(workspace_connection.access_token);
        exportedData = await notionService.exportWorkspace();
      } else if (workspace_connection.workspace_type === 'trello') {
        const trelloService = new TrelloService(workspace_connection.access_token);
        exportedData = await trelloService.exportBoard(workspace_connection.workspace_id);
      }

      // Upload to cloud storage
      const storageService = new StorageService(
        storage_connection.storage_provider,
        storage_connection.access_token
      );

      const fileName = `${workspace_connection.workspace_type}_${workspace_connection.workspace_id}_${new Date().toISOString()}.encrypted.json`;
      const filePath = await storageService.uploadFile(fileName, exportedData);

      // Update backup record as completed
      await supabaseAdmin
        .from('backups')
        .update({
          status: 'completed',
          file_path: filePath,
          file_size_bytes: JSON.stringify(exportedData).length,
          backup_completed_at: new Date().toISOString(),
          metadata: {
            workspace_name: workspace_connection.workspace_name,
            workspace_type: workspace_connection.workspace_type,
          },
        })
        .eq('id', backupId);

    } catch (error) {
      console.error(`Error processing backup ${backupId}:`, error);

      // Update backup record as failed
      await supabaseAdmin
        .from('backups')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
        })
        .eq('id', backupId);
    }
  }

  async checkUsageLimit(userId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];

    // Get user's subscription plan
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('subscription_plan')
      .eq('id', userId)
      .single();

    if (profile?.subscription_plan !== 'free') {
      return true; // Paid plans have unlimited manual backups
    }

    // Check usage for today
    const { data: usage } = await supabaseAdmin
      .from('usage_tracking')
      .select('count')
      .eq('user_id', userId)
      .eq('action_type', 'backup')
      .eq('action_date', today)
      .single();

    if (!usage || usage.count < 1) {
      // Update or insert usage tracking
      await supabaseAdmin
        .from('usage_tracking')
        .upsert({
          user_id: userId,
          action_type: 'backup',
          action_date: today,
          count: (usage?.count || 0) + 1,
        });
      return true;
    }

    return false; // Limit reached
  }
}
