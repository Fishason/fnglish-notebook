import { Client } from '@notionhq/client';
import type { Config, WordInfo, NotionDatabase } from '../utils/types.js';
import { NOTION_DATABASE_NAME, NOTION_DATABASE_PROPERTIES } from '../constants.js';

export class NotionService {
  private client: Client;
  private pageId: string;

  constructor(config: Config) {
    this.client = new Client({
      auth: config.notionToken,
    });
    this.pageId = config.notionPageId;
  }

  async findOrCreateDatabase(): Promise<string> {
    try {
      // 首先尝试搜索现有数据库
      const existingDatabase = await this.findDatabase();
      if (existingDatabase) {
        return existingDatabase.id;
      }

      // 如果不存在，创建新数据库
      return await this.createDatabase();
    } catch (error) {
      throw new Error(`Notion数据库操作失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  private async findDatabase(): Promise<NotionDatabase | null> {
    try {
      const response = await this.client.search({
        query: NOTION_DATABASE_NAME,
        filter: {
          value: 'database',
          property: 'object'
        }
      });

      const database = response.results.find((result: any) => 
        result.object === 'database' && 
        result.title?.[0]?.plain_text === NOTION_DATABASE_NAME
      );

      return database ? {
        id: database.id,
        title: (database as any).title?.[0]?.plain_text || '',
        properties: (database as any).properties
      } : null;
    } catch {
      return null;
    }
  }

  private async createDatabase(): Promise<string> {
    // 创建行内数据库
    const response = await this.client.databases.create({
      parent: {
        page_id: this.pageId
      },
      title: [
        {
          type: 'text',
          text: {
            content: NOTION_DATABASE_NAME
          }
        }
      ],
      properties: NOTION_DATABASE_PROPERTIES,
      is_inline: true
    });

    return response.id;
  }

  async addWordEntry(databaseId: string, wordInfo: WordInfo): Promise<void> {
    try {
      await this.client.pages.create({
        parent: {
          database_id: databaseId
        },
        properties: {
          '单词': {
            title: [
              {
                text: {
                  content: wordInfo.word
                }
              }
            ]
          },
          '词性': {
            select: {
              name: wordInfo.partOfSpeech
            }
          },
          '释义': {
            rich_text: [
              {
                text: {
                  content: wordInfo.definition
                }
              }
            ]
          },
          '例句': {
            rich_text: [
              {
                text: {
                  content: wordInfo.example
                }
              }
            ]
          },
          '例句翻译': {
            rich_text: [
              {
                text: {
                  content: wordInfo.exampleTranslation
                }
              }
            ]
          }
        }
      });
    } catch (error) {
      throw new Error(`添加单词到Notion失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.pages.retrieve({
        page_id: this.pageId
      });
      return true;
    } catch {
      return false;
    }
  }

  async checkWordExists(databaseId: string, word: string): Promise<boolean> {
    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: {
          property: '单词',
          title: {
            equals: word
          }
        }
      });

      return response.results.length > 0;
    } catch {
      return false;
    }
  }
}