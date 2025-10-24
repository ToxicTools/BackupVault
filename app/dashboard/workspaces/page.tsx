'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database, Trash2 } from 'lucide-react';

interface WorkspaceConnection {
  id: string;
  workspace_type: string;
  workspace_name: string;
  is_active: boolean;
  created_at: string;
}

export default function WorkspacesPage() {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<WorkspaceConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchWorkspaces = async () => {
      const { data, error } = await supabase
        .from('workspace_connections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setWorkspaces(data);
      }
      setLoading(false);
    };

    fetchWorkspaces();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this workspace?')) return;

    await supabase
      .from('workspace_connections')
      .delete()
      .eq('id', id);

    setWorkspaces(workspaces.filter(w => w.id !== id));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Workspaces</h1>
        <p className="text-gray-600">Connect your Notion and Trello workspaces for backup.</p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Connect New Workspace</CardTitle>
            <CardDescription>
              Authorize BackupVault to access your workspaces
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button>
              <Database className="w-4 h-4 mr-2" />
              Connect Notion
            </Button>
            <Button variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Connect Trello
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Connected Workspaces</h2>
        {loading ? (
          <p>Loading...</p>
        ) : workspaces.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No workspaces connected yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Connect your first workspace to start backing up your data.
              </p>
            </CardContent>
          </Card>
        ) : (
          workspaces.map((workspace) => (
            <Card key={workspace.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <Database className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{workspace.workspace_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">
                        {workspace.workspace_type}
                      </Badge>
                      {workspace.is_active ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(workspace.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
