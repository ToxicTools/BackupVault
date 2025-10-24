'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database, Cloud, History, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    workspaces: 0,
    storageConnected: false,
    totalBackups: 0,
    lastBackup: null as string | null,
    plan: 'free',
  });

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      // Fetch workspace count
      const { count: workspaceCount } = await supabase
        .from('workspace_connections')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Check storage connection
      const { data: storage } = await supabase
        .from('storage_connections')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Fetch backup count
      const { count: backupCount } = await supabase
        .from('backups')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch last backup
      const { data: lastBackup } = await supabase
        .from('backups')
        .select('backup_completed_at')
        .eq('user_id', user.id)
        .order('backup_completed_at', { ascending: false })
        .limit(1)
        .single();

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      setStats({
        workspaces: workspaceCount || 0,
        storageConnected: !!storage,
        totalBackups: backupCount || 0,
        lastBackup: lastBackup?.backup_completed_at || null,
        plan: profile?.subscription_plan || 'free',
      });
    };

    fetchStats();
  }, [user]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s an overview of your backups.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
            <Database className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workspaces}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.plan === 'free' ? 'Max 1' : stats.plan === 'pro' ? 'Max 5' : 'Unlimited'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <Cloud className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.storageConnected ? 'Connected' : 'Not Connected'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Cloud storage status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <History className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBackups}</div>
            <p className="text-xs text-gray-500 mt-1">All time backups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Calendar className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.lastBackup
                ? new Date(stats.lastBackup).toLocaleDateString()
                : 'Never'
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">Most recent</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href="/dashboard/workspaces">
            <Button>
              <Database className="w-4 h-4 mr-2" />
              Connect Workspace
            </Button>
          </Link>
          <Link href="/dashboard/storage">
            <Button variant="outline">
              <Cloud className="w-4 h-4 mr-2" />
              Connect Storage
            </Button>
          </Link>
          {stats.workspaces > 0 && stats.storageConnected && (
            <Button variant="outline">
              <History className="w-4 h-4 mr-2" />
              Create Backup Now
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Getting Started Guide */}
      {stats.workspaces === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mr-3 flex-shrink-0">
                  1
                </span>
                <div>
                  <p className="font-medium">Connect your Notion or Trello workspace</p>
                  <p className="text-sm text-gray-600">Authorize BackupVault to access your workspace</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mr-3 flex-shrink-0">
                  2
                </span>
                <div>
                  <p className="font-medium">Connect your cloud storage</p>
                  <p className="text-sm text-gray-600">Choose where to store your backups</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mr-3 flex-shrink-0">
                  3
                </span>
                <div>
                  <p className="font-medium">Create your first backup</p>
                  <p className="text-sm text-gray-600">Manually trigger a backup or set up automatic backups</p>
                </div>
              </li>
            </ol>
            <Link href="/dashboard/workspaces">
              <Button className="mt-6">Get Started</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Plan Badge */}
      <div className="mt-8">
        <Badge variant="outline" className="text-sm">
          Current Plan: {stats.plan.toUpperCase()}
        </Badge>
        {stats.plan === 'free' && (
          <Link href="/dashboard/settings#billing">
            <Button variant="link" size="sm">
              Upgrade to unlock more features
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
