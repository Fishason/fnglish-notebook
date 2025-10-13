import type { Config, WordInfo } from '../utils/types.js';
export declare class NotionService {
    private client;
    private pageId;
    constructor(config: Config);
    findOrCreateDatabase(): Promise<string>;
    private findDatabase;
    private createDatabase;
    addWordEntry(databaseId: string, wordInfo: WordInfo): Promise<void>;
    testConnection(): Promise<boolean>;
    checkWordExists(databaseId: string, word: string): Promise<boolean>;
}
