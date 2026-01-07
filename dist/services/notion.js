import { Client } from '@notionhq/client';
export class NotionService {
    client;
    databaseId;
    templateId;
    deckId;
    titlePropertyName = '';
    constructor(config) {
        this.client = new Client({
            auth: config.notionToken,
        });
        this.databaseId = config.notionDatabaseId;
        this.templateId = config.notionTemplateId;
        this.deckId = config.notionDeckId;
    }
    async validateDatabase() {
        try {
            const response = await this.client.databases.retrieve({ database_id: this.databaseId });
            // Find the property that is of type 'title'
            const titlePropEntry = Object.entries(response.properties).find(([_, prop]) => prop.type === 'title');
            if (!titlePropEntry) {
                throw new Error('提供的数据库没有标题属性 (Title property)');
            }
            this.titlePropertyName = titlePropEntry[0];
            // Check for '背面' property
            const backProp = response.properties['背面'];
            if (!backProp || backProp.type !== 'rich_text') {
                throw new Error('数据库缺少“背面”属性 (Text/Rich Text type)');
            }
            // Check for '牌组' property if deckId is provided
            if (this.deckId) {
                const deckProp = response.properties['牌组'];
                if (!deckProp || deckProp.type !== 'relation') {
                    // Warning but maybe not error? Let's error to be safe as user configured it.
                    throw new Error('数据库缺少“牌组”属性 (Relation type)');
                }
            }
            return this.titlePropertyName;
        }
        catch (error) {
            throw new Error(`无法访问Notion数据库: ${error instanceof Error ? error.message : '请检查ID是否正确'}`);
        }
    }
    async getTemplatePageDetails() {
        if (!this.templateId)
            return { icon: null, cover: null };
        try {
            const response = await this.client.pages.retrieve({ page_id: this.templateId });
            return {
                icon: response.icon,
                cover: response.cover
            };
        }
        catch {
            // If template fails, just ignore it
            return { icon: null, cover: null };
        }
    }
    async addWordEntry(databaseId, wordInfo) {
        // Note: databaseId argument is kept for compatibility but we mostly use this.databaseId 
        // unless the caller passes a different one (which MainScreen might). 
        // Ideally MainScreen should pass config.notionDatabaseId.
        const targetDbId = databaseId || this.databaseId;
        try {
            if (!this.titlePropertyName) {
                await this.validateDatabase();
            }
            const { icon, cover } = await this.getTemplatePageDetails();
            const content = `[${wordInfo.partOfSpeech}] ${wordInfo.definition}\n\n例句：\n${wordInfo.example}\n${wordInfo.exampleTranslation}`;
            const properties = {
                [this.titlePropertyName]: {
                    title: [
                        {
                            text: {
                                content: wordInfo.word
                            }
                        }
                    ]
                },
                '背面': {
                    rich_text: [
                        {
                            text: {
                                content: content
                            }
                        }
                    ]
                }
            };
            if (this.deckId) {
                properties['牌组'] = {
                    relation: [
                        {
                            id: this.deckId
                        }
                    ]
                };
            }
            await this.client.pages.create({
                parent: {
                    database_id: targetDbId
                },
                icon: icon,
                cover: cover,
                properties: properties
            });
        }
        catch (error) {
            throw new Error(`添加单词到Notion失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
    }
    async testConnection() {
        try {
            await this.validateDatabase();
            return true;
        }
        catch {
            return false;
        }
    }
    async checkWordExists(databaseId, word) {
        const targetDbId = databaseId || this.databaseId;
        try {
            if (!this.titlePropertyName) {
                await this.validateDatabase();
            }
            const response = await this.client.databases.query({
                database_id: targetDbId,
                filter: {
                    property: this.titlePropertyName,
                    title: {
                        equals: word
                    }
                }
            });
            return response.results.length > 0;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=notion.js.map