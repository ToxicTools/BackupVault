import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Shield, Cloud, History, Zap, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              Secure Backups for Your <span className="text-blue-600">Notion</span> & <span className="text-blue-600">Trello</span> Workspace
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Protect your critical data with encrypted backups to your own cloud storage.
              Never lose your work again.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Free plan available • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why BackupVault?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Bank-Level Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your data is encrypted end-to-end with AES-256 encryption.
                  Only you have access to your backups.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Cloud className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Your Cloud, Your Control</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Store backups in your Dropbox, OneDrive, Google Drive, or Backblaze.
                  You own your data.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <History className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Complete Backup History</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access any previous version of your workspace.
                  Restore from any point in time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Automated Backups</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Set it and forget it. Automatic daily backups keep your data safe
                  without any manual work.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Full Workspace Backup</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Complete backup including pages, databases, comments, attachments,
                  and all metadata.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Check className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Easy Restore</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  One-click restore to get your data back quickly.
                  No technical knowledge required.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-3xl font-bold">€0</div>
                <CardDescription>Perfect for trying out BackupVault</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>1 Notion workspace or 1 Trello board</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>1 manual backup per day</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>30-day backup history</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Encrypted storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full mt-6" variant="outline">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm rounded-bl">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="text-3xl font-bold">€9<span className="text-lg font-normal">/month</span></div>
                <CardDescription>For individuals and small teams</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Up to 5 Notion workspaces & Trello boards</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Unlimited manual backups</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Automatic daily backups</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>90-day backup history</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>All storage providers</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Priority email support</span>
                  </li>
                </ul>
                <Link href="/signup?plan=pro">
                  <Button className="w-full mt-6">
                    Start Pro Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Business Plan */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Business</CardTitle>
                <div className="text-3xl font-bold">€29<span className="text-lg font-normal">/month</span></div>
                <CardDescription>For growing teams and businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Unlimited Notion & Trello workspaces</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Unlimited manual backups</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Hourly automatic backups</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>1-year backup history</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Advanced restore options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>Priority phone & chat support</span>
                  </li>
                </ul>
                <Link href="/signup?plan=business">
                  <Button className="w-full mt-6">
                    Start Business Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Protect Your Data?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust BackupVault to keep their Notion and Trello data safe.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-white mb-4">BackupVault</h3>
              <p className="text-sm">Secure backups for your Notion and Trello workspaces.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/security">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/support">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2025 BackupVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
