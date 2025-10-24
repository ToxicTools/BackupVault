# BackupVault Deployment Guide
**Complete Step-by-Step Setup for Vercel and Supabase**

---

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Supabase account (sign up at https://supabase.com)
- Node.js 18+ installed locally
- Git installed

---

## Part 1: Create GitHub Repository

### Step 1.1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `BackupVault`
3. Description: `Secure backup solution for Notion & Trello workspaces`
4. Visibility: **Private** (recommended) or Public
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 1.2: Push Code to GitHub

```bash
cd C:\Users\Toxicbook\Desktop\Backupvault\backupvault

# Add remote
git remote add origin https://github.com/ToxicTools/BackupVault.git

# Push code
git branch -M main
git push -u origin main
```

You should see output confirming the push was successful.

---

## Part 2: Setup Supabase Database

### Step 2.1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New project"
3. Fill in details:
   - **Name**: `BackupVault`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for testing
4. Click "Create new project"
5. Wait 2-3 minutes for project to be created

### Step 2.2: Run Database Schema

1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Open the file `C:\Users\Toxicbook\Desktop\Backupvault\backupvault\supabase\schema.sql`
4. Copy ALL the contents
5. Paste into the SQL Editor
6. Click "Run" button
7. You should see "Success. No rows returned"

**Verify Tables Created:**
- Click "Table Editor" in sidebar
- You should see tables: `profiles`, `workspace_connections`, `storage_connections`, `backup_configs`, `backups`, `usage_tracking`

### Step 2.3: Get Supabase API Keys

1. In Supabase dashboard, click "Project Settings" (gear icon)
2. Click "API" in the left sidebar
3. **Copy these values** (you'll need them for Vercel):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this SECRET!)

### Step 2.4: Configure Authentication

1. In Supabase dashboard, click "Authentication" → "Providers"
2. Enable "Email" provider (should be enabled by default)
3. Configure email templates:
   - Go to "Authentication" → "Email Templates"
   - Customize "Confirm signup" template if desired
4. **Site URL Configuration**:
   - Go to "Authentication" → "URL Configuration"
   - Set **Site URL**: `https://your-app.vercel.app` (update after Vercel deployment)
   - Add **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

---

## Part 3: Deploy to Vercel

### Step 3.1: Connect GitHub Repository

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Find "ToxicTools/BackupVault" in the list
5. Click "Import"

### Step 3.2: Configure Project

1. **Framework Preset**: Should auto-detect "Next.js"
2. **Root Directory**: `./` (leave as default)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)

### Step 3.3: Add Environment Variables

Click "Environment Variables" and add the following:

#### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Encryption Key (CRITICAL!)
Generate a secure 32-character key:
```bash
# On Windows (PowerShell):
-join ((65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Or use this example (CHANGE IT!):
# Kj8mN2pQ4rS6tU8wX0yZ2aB4cD6eF8gH
```

```env
ENCRYPTION_KEY=your_32_character_encryption_key_here
```

#### App URLs
```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api
```

#### API Keys (Placeholder for now)
```env
# Mollie Payment
MOLLIE_API_KEY=test_placeholder
NEXT_PUBLIC_MOLLIE_PROFILE_ID=placeholder

# Notion API
NOTION_CLIENT_ID=placeholder
NOTION_CLIENT_SECRET=placeholder
NOTION_REDIRECT_URI=https://your-app.vercel.app/api/auth/notion/callback

# Trello API
TRELLO_API_KEY=placeholder
TRELLO_API_SECRET=placeholder

# Dropbox API
DROPBOX_CLIENT_ID=placeholder
DROPBOX_CLIENT_SECRET=placeholder

# Google Drive API
GOOGLE_CLIENT_ID=placeholder
GOOGLE_CLIENT_SECRET=placeholder

# OneDrive API
ONEDRIVE_CLIENT_ID=placeholder
ONEDRIVE_CLIENT_SECRET=placeholder

# Backblaze B2
BACKBLAZE_KEY_ID=placeholder
BACKBLAZE_APPLICATION_KEY=placeholder
```

**Important:** Click "Add" for each environment variable.

### Step 3.4: Deploy

1. Click "Deploy" button
2. Wait 2-3 minutes for build to complete
3. Click "Visit" to see your deployed site
4. **Copy your Vercel URL**: `https://backup-vault-xxxx.vercel.app`

### Step 3.5: Update Supabase with Vercel URL

1. Go back to Supabase dashboard
2. Go to "Authentication" → "URL Configuration"
3. Update **Site URL** to your Vercel URL
4. Add your Vercel URL to **Redirect URLs**
5. Click "Save"

### Step 3.6: Update Vercel Environment Variables

1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Update these values with your actual Vercel URL:
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_API_URL`
   - `NOTION_REDIRECT_URI`
3. Click "Save"
4. Go to "Deployments" → Click "..." on latest deployment → "Redeploy"

---

## Part 4: First Test Run

### Step 4.1: Test User Registration

1. Go to your Vercel URL: `https://your-app.vercel.app`
2. Click "Start Free Trial" or "Sign Up"
3. Fill in:
   - **Full Name**: Test User
   - **Email**: your-email@example.com
   - **Password**: Use a strong password (12+ chars, mixed case, numbers, symbols)
4. Click "Create Account"

**Expected Results:**
- ✅ Password strength indicator shows "Strong"
- ✅ Account created successfully
- ✅ Email sent to verify account (check inbox)
- ✅ Redirected to /dashboard

### Step 4.2: Verify Email

1. Check your email inbox
2. Click the verification link from Supabase
3. Should redirect back to your app

### Step 4.3: Test Login

1. Go to `https://your-app.vercel.app/login`
2. Enter your email and password
3. Click "Sign In"

**Expected Results:**
- ✅ Successfully logged in
- ✅ Redirected to dashboard
- ✅ See welcome message and empty stats

### Step 4.4: Verify Database

1. Go to Supabase dashboard → Table Editor
2. Click "profiles" table
3. You should see your user profile with:
   - ✅ ID matching your auth user
   - ✅ Email address
   - ✅ subscription_plan: "free"
   - ✅ subscription_status: "active"

### Step 4.5: Test Dashboard Navigation

1. Click through all dashboard pages:
   - ✅ Dashboard (overview)
   - ✅ Workspaces (empty - can't connect yet)
   - ✅ Storage (empty - can't connect yet)
   - ✅ Backups (empty - no backups yet)
   - ✅ Settings (shows your profile)

2. Test Sign Out:
   - ✅ Click "Sign Out"
   - ✅ Redirected to homepage

---

## Part 5: Configure API Integrations (Optional for Now)

### Step 5.1: Get Notion API Keys

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Fill in details and create
4. Copy "Internal Integration Token"
5. Add to Vercel environment variables: `NOTION_CLIENT_ID` and `NOTION_CLIENT_SECRET`

### Step 5.2: Get Trello API Keys

1. Go to https://trello.com/app-key
2. Copy API Key
3. Generate Token
4. Add to Vercel: `TRELLO_API_KEY` and `TRELLO_API_SECRET`

### Step 5.3: Get Mollie API Keys

1. Go to https://www.mollie.com/dashboard
2. Create account / login
3. Go to Developers → API keys
4. Copy API key (use test key for now)
5. Add to Vercel: `MOLLIE_API_KEY`

### Step 5.4: Configure Cloud Storage

Follow similar steps for:
- Dropbox: https://www.dropbox.com/developers/apps
- Google Drive: https://console.cloud.google.com
- OneDrive: https://portal.azure.com
- Backblaze B2: https://secure.backblaze.com

**Note:** These can be configured later as needed.

---

## Part 6: Monitoring and Troubleshooting

### Step 6.1: Check Vercel Logs

1. Go to Vercel dashboard → Your project → "Logs"
2. Monitor for any errors during usage
3. Common issues:
   - ❌ "ENCRYPTION_KEY must be 32 characters" → Check env var
   - ❌ "Unauthorized" → Check Supabase API keys
   - ❌ 500 errors → Check Vercel logs for details

### Step 6.2: Check Supabase Logs

1. Go to Supabase dashboard → "Logs"
2. Click "Postgres Logs" to see database queries
3. Check for any failed queries or constraint violations

### Step 6.3: Test Security Features

#### Password Strength
- ❌ Try weak password: "password123"
- ✅ Should be rejected with feedback

#### Authorization
- ❌ Try to access other user's data (requires 2 accounts)
- ✅ Should get 403 Forbidden

#### Encryption
- Check database: Tokens should be encrypted (not plain text)

---

## Part 7: Going to Production

### Step 7.1: Update to Production Mode

1. Change all `test_` API keys to production keys
2. Update environment variables in Vercel
3. Redeploy

### Step 7.2: Add Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Supabase Site URL to custom domain

### Step 7.3: Enable Production Features

- Set up error monitoring (Sentry, etc.)
- Configure backup scheduling (Supabase Edge Functions or cron job)
- Set up email service for notifications
- Add analytics (Vercel Analytics, Google Analytics)

### Step 7.4: Security Checklist

- ✅ All API keys are production keys
- ✅ ENCRYPTION_KEY is secure and backed up
- ✅ Rate limiting configured (Vercel Pro required)
- ✅ Database backups enabled in Supabase
- ✅ Environment variables are secure
- ✅ HTTPS enforced (automatic with Vercel)

---

## Troubleshooting Common Issues

### Issue: "Supabase client is not configured"
**Solution:** Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly

### Issue: Build fails on Vercel
**Solution:**
1. Check build logs for specific error
2. Ensure all dependencies are in package.json
3. Try building locally: `npm run build`

### Issue: User can't sign up
**Solution:**
1. Check Supabase Auth is enabled
2. Verify email provider is configured
3. Check Vercel logs for errors

### Issue: "Invalid encryption key"
**Solution:** ENCRYPTION_KEY must be exactly 32 characters

### Issue: Webhooks not working
**Solution:**
1. Check webhook URL is publicly accessible
2. Verify Mollie webhook is configured correctly
3. Check Vercel logs for webhook errors

---

## Next Steps

1. ✅ Test user registration and login
2. ✅ Verify database tables
3. ✅ Test all dashboard pages
4. ⏸️ Configure API integrations (when ready)
5. ⏸️ Test backup creation (requires API keys)
6. ⏸️ Set up payment processing
7. ⏸️ Add custom domain
8. ⏸️ Go to production

---

## Support

- **Documentation**: See README.md
- **Security**: See SECURITY_AUDIT.md
- **Issues**: Open issue on GitHub

---

## Costs

- **Vercel**: Free tier for hobby projects, $20/month for Pro
- **Supabase**: Free tier (500MB database, 50K monthly active users)
- **Domain**: ~$10-15/year (optional)
- **Total**: $0 for testing, ~$20-30/month for production

---

**Deployment complete! Your BackupVault instance is now running securely on Vercel and Supabase.**

🎉 **Happy Backing Up!**
