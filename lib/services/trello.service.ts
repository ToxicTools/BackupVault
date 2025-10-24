import axios from 'axios';
import { decrypt } from '@/lib/encryption';

export class TrelloService {
  private apiKey: string;
  private token: string;
  private encryptionKey: string;

  constructor(token: string) {
    this.apiKey = process.env.TRELLO_API_KEY!;
    this.encryptionKey = process.env.ENCRYPTION_KEY!;
    if (!this.encryptionKey || this.encryptionKey.length < 32) {
      throw new Error('ENCRYPTION_KEY environment variable must be at least 32 characters');
    }
    this.token = this.decryptToken(token);
  }

  private decryptToken(encryptedToken: string): string {
    try {
      return decrypt(encryptedToken, this.encryptionKey);
    } catch (error) {
      // If decryption fails, assume token is not encrypted yet
      return encryptedToken;
    }
  }

  async getBoard(boardId: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}`,
        {
          params: {
            key: this.apiKey,
            token: this.token,
            fields: 'all',
            lists: 'all',
            cards: 'all',
            members: 'all',
          },
        }
      );
      return response.data;
    } catch (error) {
      // Don't log sensitive error details
      throw new Error('Failed to fetch Trello board');
    }
  }

  async getCards(boardId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/cards`,
        {
          params: {
            key: this.apiKey,
            token: this.token,
            attachments: 'true',
            checklists: 'all',
          },
        }
      );
      return response.data;
    } catch (error) {
      // Don't log sensitive error details
      throw new Error('Failed to fetch Trello cards');
    }
  }

  async getAttachments(cardId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/cards/${cardId}/attachments`,
        {
          params: {
            key: this.apiKey,
            token: this.token,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Don't log sensitive error details
      throw new Error('Failed to fetch attachments');
    }
  }

  async exportBoard(boardId: string): Promise<any> {
    try {
      const board = await this.getBoard(boardId);
      const cards = await this.getCards(boardId);

      const cardsWithAttachments = await Promise.all(
        cards.map(async (card) => ({
          ...card,
          attachments: await this.getAttachments(card.id),
        }))
      );

      const fullBackup = {
        timestamp: new Date().toISOString(),
        board,
        cards: cardsWithAttachments,
      };

      return fullBackup;
    } catch (error) {
      // Don't log sensitive error details
      throw new Error('Failed to export Trello board');
    }
  }
}
