import axios from 'axios';
import crypto from 'crypto';

interface NotionPage {
  id: string;
  properties: any;
  children?: NotionPage[];
}

export class NotionService {
  private accessToken: string;
  private encryptionKey: string;

  constructor(accessToken: string) {
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

  async getAllPages(pageId?: string): Promise<NotionPage[]> {
    try {
      const response = await axios.post(
        'https://api.notion.com/v1/search',
        {
          filter: { property: 'object', value: 'page' },
          page_size: 100,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Notion-Version': '2022-06-28',
          },
        }
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching Notion pages:', error);
      throw error;
    }
  }

  async getPageContent(pageId: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.notion.com/v1/blocks/${pageId}/children`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Notion-Version': '2022-06-28',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching page content for ${pageId}:`, error);
      throw error;
    }
  }

  async getDatabases(): Promise<any[]> {
    try {
      const response = await axios.post(
        'https://api.notion.com/v1/search',
        {
          filter: { property: 'object', value: 'database' },
          page_size: 100,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Notion-Version': '2022-06-28',
          },
        }
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching Notion databases:', error);
      throw error;
    }
  }

  async exportWorkspace(): Promise<any> {
    try {
      const pages = await this.getAllPages();
      const databases = await this.getDatabases();

      const fullBackup = {
        timestamp: new Date().toISOString(),
        pages: await Promise.all(
          pages.map(async (page) => ({
            ...page,
            content: await this.getPageContent(page.id),
          }))
        ),
        databases,
      };

      return fullBackup;
    } catch (error) {
      console.error('Error exporting workspace:', error);
      throw error;
    }
  }
}
