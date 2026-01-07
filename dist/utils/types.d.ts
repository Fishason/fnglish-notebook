export interface Config {
    englishLevel: 'middle_school' | 'university' | 'study_abroad';
    grokApiKey: string;
    notionToken: string;
    notionDatabaseId: string;
    notionTemplateId: string;
    notionDeckId: string;
}
export interface TranslationResult {
    original: string;
    translated: string;
    type: 'text' | 'image';
}
export interface WordInfo {
    word: string;
    definition: string;
    partOfSpeech: string;
    example: string;
    exampleTranslation: string;
}
export interface NotionDatabase {
    id: string;
    title: string;
    properties: Record<string, any>;
}
