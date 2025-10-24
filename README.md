# BackupVault

**Secure Backups for Your Notion & Trello Workspaces**

BackupVault is a SaaS application that helps users create automated and manual backups of their Notion workspaces and Trello boards. Backups are stored in users' own cloud storage (Dropbox, OneDrive, Google Drive, or Backblaze B2) with end-to-end encryption.

## Features

- **Bank-Level Security**: End-to-end encryption with AES-256
- **Multiple Cloud Providers**: Dropbox, OneDrive, Google Drive, Backblaze B2
- **Automated Backups**: Daily, weekly, or manual backup schedules
- **Complete Backup History**: Access any previous version
- **Three-Tier Pricing**: Free, Pro, and Business plans

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Supabase (Auth, Database, Storage)
- **Payment**: Mollie.com
- **Hosting**: Vercel
- **APIs**: Notion API, Trello API, Cloud Storage APIs

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- API keys for:
  - Notion
  - Trello
  - Dropbox / Google Drive / OneDrive / Backblaze B2
  - Mollie (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/backupvault.git
cd backupvault
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys and configuration.

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql` in the Supabase SQL editor
   - Copy your Supabase URL and keys to `.env.local`

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
backupvault/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── page.tsx          # Landing page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
│   ├── services/        # Business logic services
│   ├── supabase/        # Supabase client
│   └── utils.ts         # Helper functions
├── supabase/            # Database schema
└── public/              # Static assets
```

## Environment Variables

See `.env.example` for a complete list of required environment variables.

Key variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `MOLLIE_API_KEY`: Mollie payment API key
- `ENCRYPTION_KEY`: 32-character encryption key for data security

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables
4. Deploy

### Supabase

1. Configure your Supabase project
2. Set up database using the schema in `supabase/schema.sql`
3. Configure authentication providers
4. Set up Edge Functions for scheduled backups (optional)

## API Keys Setup

### Notion
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the Client ID and Client Secret

### Trello
1. Visit [Trello App Key](https://trello.com/app-key)
2. Get your API key and secret

### Cloud Storage
- **Dropbox**: Create app at [Dropbox Developers](https://www.dropbox.com/developers/apps)
- **Google Drive**: Set up project at [Google Cloud Console](https://console.cloud.google.com)
- **OneDrive**: Register app at [Azure Portal](https://portal.azure.com)
- **Backblaze B2**: Get credentials from [Backblaze](https://secure.backblaze.com/b2_buckets.htm)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@backupvault.com or open an issue on GitHub.

---

**BackupVault** - Protect your data with confidence 🛡️
# Deployment trigger
