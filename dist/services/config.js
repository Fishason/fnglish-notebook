import { readFile, writeFile, access } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
const CONFIG_FILE_PATH = join(homedir(), '.fnglish-notebook');
export class ConfigManager {
    config = null;
    async exists() {
        try {
            await access(CONFIG_FILE_PATH);
            return true;
        }
        catch {
            return false;
        }
    }
    async load() {
        try {
            const data = await readFile(CONFIG_FILE_PATH, 'utf-8');
            this.config = JSON.parse(data);
            return this.config;
        }
        catch {
            return null;
        }
    }
    async save(config) {
        this.config = config;
        await writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 2));
    }
    get() {
        return this.config;
    }
    getEnglishLevelText(level) {
        const levelMap = {
            middle_school: '中学水平',
            university: '大学水平',
            study_abroad: '留学水平'
        };
        return levelMap[level];
    }
}
//# sourceMappingURL=config.js.map