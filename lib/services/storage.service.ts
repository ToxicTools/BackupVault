import { Dropbox } from 'dropbox';
import { google } from 'googleapis';
import axios from 'axios';
import crypto from 'crypto';

export class StorageService {
  private provider: string;
  private accessToken: string;
  private encryptionKey: string;

  constructor(provider: string, accessToken: string) {
    this.provider = provider;
    this.accessToken = this.decryptToken(accessToken);
    this.encryptionKey = process.env.ENCRYPTION_KEY!;
  }

  private decryptToken(encryptedToken: string): string {
    try {
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(this.encryptionKey),
        Buffer.alloc(16, 0)
      );
      let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      // If decryption fails, assume token is not encrypted yet
      return encryptedToken;
    }
  }

  private encryptData(data: string): Buffer {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey),
      Buffer.alloc(16, 0)
    );
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return Buffer.from(encrypted, 'hex');
  }

  async uploadFile(fileName: string, content: any): Promise<string> {
    const encryptedContent = this.encryptData(JSON.stringify(content));

    switch (this.provider) {
      case 'dropbox':
        return await this.uploadToDropbox(fileName, encryptedContent);
      case 'google_drive':
        return await this.uploadToGoogleDrive(fileName, encryptedContent);
      case 'onedrive':
        return await this.uploadToOneDrive(fileName, encryptedContent);
      case 'backblaze':
        return await this.uploadToBackblaze(fileName, encryptedContent);
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
      console.error('Error uploading to Dropbox:', error);
      throw error;
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
      console.error('Error uploading to Google Drive:', error);
      throw error;
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
      console.error('Error uploading to OneDrive:', error);
      throw error;
    }
  }

  private async uploadToBackblaze(fileName: string, content: Buffer): Promise<string> {
    // Implement Backblaze B2 upload
    // This requires additional setup with B2 SDK
    throw new Error('Backblaze implementation pending');
  }
}
