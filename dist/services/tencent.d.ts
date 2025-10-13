import type { TranslationResult } from '../utils/types.js';
export declare class TencentTranslationService {
    private client;
    constructor();
    translateText(text: string, from?: string, to?: string): Promise<TranslationResult>;
    translateImage(imageBase64: string, from?: string, to?: string): Promise<TranslationResult>;
    detectLanguage(text: string): Promise<string>;
}
