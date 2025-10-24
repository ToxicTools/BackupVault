'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Cloud, Trash2 } from 'lucide-react';

interface StorageConnection {
  id: string;
  storage_provider: string;
  folder_path: string;
  is_active: boolean;
  created_at: string;
}

export default function StoragePage() {
  const { user } = useAuth();
  const [storageConnections, setStorageConnections] = useState<StorageConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStorage = async () => {
      const { data, error } = await supabase
        .from('storage_connections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setStorageConnections(data);
      }
      setLoading(false);
    };

    fetchStorage();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this storage provider?')) return;

    await supabase
      .from('storage_connections')
      .delete()
      .eq('id', id);

    setStorageConnections(storageConnections.filter(s => s.id !== id));
  };

  const getProviderName = (provider: string) => {
    const names: { [key: string]: string } = {
      dropbox: 'Dropbox',
      google_drive: 'Google Drive',
      onedrive: 'OneDrive',
      backblaze: 'Backblaze B2'
    };
    return names[provider] || provider;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cloud Storage</h1>
        <p className="text-gray-600">Connect your cloud storage to save encrypted backups.</p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Connect Cloud Storage</CardTitle>
            <CardDescription>
              Choose where to store your encrypted backup files
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Button>
              <Cloud className="w-4 h-4 mr-2" />
              Connect Dropbox
            </Button>
            <Button variant="outline">
              <Cloud className="w-4 h-4 mr-2" />
              Connect Google Drive
            </Button>
            <Button variant="outline">
              <Cloud className="w-4 h-4 mr-2" />
              Connect OneDrive
            </Button>
            <Button variant="outline">
              <Cloud className="w-4 h-4 mr-2" />
              Connect Backblaze B2
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Connected Storage</h2>
        {loading ? (
          <p>Loading...</p>
        ) : storageConnections.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Cloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No cloud storage connected yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Connect a cloud storage provider to save your backups.
              </p>
            </CardContent>
          </Card>
        ) : (
          storageConnections.map((storage) => (
            <Card key={storage.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <Cloud className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{getProviderName(storage.storage_provider)}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600">{storage.folder_path}</p>
                      {storage.is_active ? (
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
                  onClick={() => handleDelete(storage.id)}
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
