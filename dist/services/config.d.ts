import type { Config } from '../utils/types.js';
export declare class ConfigManager {
    private config;
    exists(): Promise<boolean>;
    load(): Promise<Config | null>;
    save(config: Config): Promise<void>;
    get(): Config | null;
    getEnglishLevelText(level: Config['englishLevel']): string;
}
