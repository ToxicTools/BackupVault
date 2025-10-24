import axios from 'axios';
import crypto from 'crypto';

export class TrelloService {
  private apiKey: string;
  private token: string;
  private encryptionKey: string;

  constructor(token: string) {
    this.apiKey = process.env.TRELLO_API_KEY!;
    this.token = this.decryptToken(token);
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
      console.error(`Error fetching Trello board ${boardId}:`, error);
      throw error;
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
      console.error(`Error fetching cards for board ${boardId}:`, error);
      throw error;
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
      console.error(`Error fetching attachments for card ${cardId}:`, error);
      throw error;
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
      console.error('Error exporting Trello board:', error);
      throw error;
    }
  }
}
