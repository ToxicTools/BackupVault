-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'business')),
  subscription_status TEXT DEFAULT 'active',
  mollie_customer_id TEXT,
  mollie_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspaces/Boards connections
CREATE TABLE public.workspace_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  workspace_type TEXT NOT NULL CHECK (workspace_type IN ('notion', 'trello')),
  workspace_id TEXT NOT NULL,
  workspace_name TEXT NOT NULL,
  access_token TEXT NOT NULL, -- encrypted
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, workspace_type, workspace_id)
);

-- Cloud storage connections
CREATE TABLE public.storage_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  storage_provider TEXT NOT NULL CHECK (storage_provider IN ('dropbox', 'onedrive', 'google_drive', 'backblaze')),
  access_token TEXT NOT NULL, -- encrypted
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  folder_path TEXT DEFAULT '/BackupVault',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backup configurations
CREATE TABLE public.backup_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  workspace_connection_id UUID REFERENCES public.workspace_connections(id) ON DELETE CASCADE,
  storage_connection_id UUID REFERENCES public.storage_connections(id) ON DELETE CASCADE,
  backup_frequency TEXT DEFAULT 'manual' CHECK (backup_frequency IN ('manual', 'daily', 'weekly')),
  backup_time TIME DEFAULT '02:00:00',
  include_comments BOOLEAN DEFAULT true,
  include_attachments BOOLEAN DEFAULT true,
  backup_format TEXT DEFAULT 'json' CHECK (backup_format IN ('json', 'markdown', 'html')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backup history
CREATE TABLE public.backups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  backup_config_id UUID REFERENCES public.backup_configs(id) ON DELETE CASCADE,
  workspace_connection_id UUID REFERENCES public.workspace_connections(id),
  backup_type TEXT CHECK (backup_type IN ('manual', 'automatic')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  file_path TEXT,
  file_size_bytes BIGINT,
  backup_started_at TIMESTAMPTZ DEFAULT NOW(),
  backup_completed_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking for free tier
CREATE TABLE public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('backup', 'restore')),
  action_date DATE DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, action_type, action_date)
);

-- Indexes for performance
CREATE INDEX idx_workspace_connections_user_id ON public.workspace_connections(user_id);
CREATE INDEX idx_storage_connections_user_id ON public.storage_connections(user_id);
CREATE INDEX idx_backup_configs_user_id ON public.backup_configs(user_id);
CREATE INDEX idx_backups_user_id ON public.backups(user_id);
CREATE INDEX idx_backups_status ON public.backups(status);
CREATE INDEX idx_usage_tracking_user_date ON public.usage_tracking(user_id, action_date);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own workspace connections" ON public.workspace_connections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own storage connections" ON public.storage_connections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own backup configs" ON public.backup_configs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own backups" ON public.backups
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON public.usage_tracking
  FOR ALL USING (auth.uid() = user_id);
