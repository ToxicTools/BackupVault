import axios from 'axios';
import { decrypt } from '@/lib/encryption';

interface NotionPage {
  id: string;
  properties: any;
  children?: NotionPage[];
}

export class NotionService {
  private accessToken: string;
  private encryptionKey: string;

  constructor(accessToken: string) {
    this.encryptionKey = process.env.ENCRYPTION_KEY!;
    if (!this.encryptionKey || this.encryptionKey.length < 32) {
      throw new Error('ENCRYPTION_KEY environment variable must be at least 32 characters');
    }
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
      // Don't log sensitive error details
      throw new Error('Failed to fetch Notion pages');
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
      // Don't log sensitive error details
      throw new Error('Failed to fetch page content');
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
      // Don't log sensitive error details
      throw new Error('Failed to fetch Notion databases');
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
      // Don't log sensitive error details
      throw new Error('Failed to export workspace');
    }
  }
}
