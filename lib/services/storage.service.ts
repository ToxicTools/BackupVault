import { Dropbox } from 'dropbox';
import { google } from 'googleapis';
import axios from 'axios';
import { encrypt, decrypt, sanitizeFileName } from '@/lib/encryption';

export class StorageService {
  private provider: string;
  private accessToken: string;
  private encryptionKey: string;

  constructor(provider: string, accessToken: string) {
    this.encryptionKey = process.env.ENCRYPTION_KEY!;
    if (!this.encryptionKey || this.encryptionKey.length < 32) {
      throw new Error('ENCRYPTION_KEY environment variable must be at least 32 characters');
    }
    this.provider = provider;
    this.accessToken = this.decryptToken(accessToken);
  }

  private decryptToken(encryptedToken: string): string {
    try {
      return decrypt(encryptedToken, this.encryptionKey);
    } catch (error) {
      // If decryption fails, assume token is not encrypted yet
      return encryptedToken;
    }
  }

  private encryptData(data: string): Buffer {
    const encryptedString = encrypt(data, this.encryptionKey);
    return Buffer.from(encryptedString, 'utf8');
  }

  async uploadFile(fileName: string, content: any): Promise<string> {
    // Sanitize filename to prevent path traversal
    const safeFileName = sanitizeFileName(fileName);
    const encryptedContent = this.encryptData(JSON.stringify(content));

    switch (this.provider) {
      case 'dropbox':
        return await this.uploadToDropbox(safeFileName, encryptedContent);
      case 'google_drive':
        return await this.uploadToGoogleDrive(safeFileName, encryptedContent);
      case 'onedrive':
        return await this.uploadToOneDrive(safeFileName, encryptedContent);
      case 'backblaze':
        return await this.uploadToBackblaze(safeFileName, encryptedContent);
      default:
        throw new Error(`Unsupported storage provider: ${this.provider}`);
    }
  }

  private async uploadToDropbox(fileName: string, content: Buffer): Promise<string> {
    try {
      const dbx = new Dropbox({ accessToken: this.accessToken });
      const response = await dbx.filesUpload({
        path: `/BackupVault/${fileName}`,
        contents: content,
        mode: { '.tag': 'add' },
        autorename: true,
      });
      return response.result.path_display || '';
    } catch (error) {
      // Don't log sensitive error details
      throw new Error('Failed to upload to Dropbox');
    }
  }

  private async uploadToGoogleDrive(fileName: string, content: Buffer): Promise<string> {
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: this.accessToken });

      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const response = await drive.files.create({
        requestBody: {
          name: fileName,
          mimeType: 'application/octet-stream',
        },
        media: {
          mimeType: 'application/octet-stream',
          body: content,
        },
      });

      return response.data.id || '';
    } catch (error) {
      // Don't log sensitive error details
      throw new Error('Failed to upload to Google Drive');
    }
  }

  private async uploadToOneDrive(fileName: string, content: Buffer): Promise<string> {
    try {
      const response = await axios.put(
        `https://graph.microsoft.com/v1.0/me/drive/root:/BackupVault/${fileName}:/content`,
        content,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/octet-stream',
          },
        }
      );
      return response.data.id;
    } catch (error) {
      // Don't log sensitive error details
      throw new Error('Failed to upload to OneDrive');
    }
  }

  private async uploadToBackblaze(fileName: string, content: Buffer): Promise<string> {
    // Implement Backblaze B2 upload
    // This requires additional setup with B2 SDK
    throw new Error('Backblaze implementation pending');
  }
}
