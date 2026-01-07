import type { Config, WordInfo } from '../utils/types.js';
export declare class NotionService {
    private client;
    private databaseId;
    private templateId;
    private deckId;
    private titlePropertyName;
    constructor(config: Config);
    validateDatabase(): Promise<string>;
    private getTemplatePageDetails;
    addWordEntry(databaseId: string, wordInfo: WordInfo): Promise<void>;
    testConnection(): Promise<boolean>;
    checkWordExists(databaseId: string, word: string): Promise<boolean>;
}
