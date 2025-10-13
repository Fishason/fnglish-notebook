import type { Config, WordInfo } from '../utils/types.js';
export declare class GrokService {
    private apiKey;
    private baseURL;
    constructor(config: Config);
    generateWordInfo(word: string, englishLevel: Config['englishLevel']): Promise<WordInfo>;
    testConnection(): Promise<boolean>;
}
