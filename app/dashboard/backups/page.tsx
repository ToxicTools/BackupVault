'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { History, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface Backup {
  id: string;
  backup_type: string;
  status: string;
  file_path: string | null;
  file_size_bytes: number | null;
  backup_completed_at: string | null;
  metadata: any;
  created_at: string;
}

export default function BackupsPage() {
  const { user } = useAuth();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBackups = async () => {
      const { data, error } = await supabase
        .from('backups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setBackups(data);
      }
      setLoading(false);
    };

    fetchBackups();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Backup History</h1>
          <p className="text-gray-600">View and manage all your backups.</p>
        </div>
        <Button>
          <RefreshCw className="w-4 h-4 mr-2" />
          Create Manual Backup
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : backups.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No backups created yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Create your first backup to see it here.
              </p>
            </CardContent>
          </Card>
        ) : (
          backups.map((backup) => (
            <Card key={backup.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <History className="w-8 h-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">
                        {backup.metadata?.workspace_name || 'Backup'}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {backup.metadata?.workspace_type || 'unknown'}
                        </Badge>
                        <Badge variant="outline">
                          {backup.backup_type}
                        </Badge>
                        {getStatusBadge(backup.status)}
                      </div>
                    </div>
                  </div>
                  {backup.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="font-medium">
                      {format(new Date(backup.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  {backup.backup_completed_at && (
                    <div>
                      <p className="text-gray-500">Completed</p>
                      <p className="font-medium">
                        {format(new Date(backup.backup_completed_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500">File Size</p>
                    <p className="font-medium">{formatFileSize(backup.file_size_bytes)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
