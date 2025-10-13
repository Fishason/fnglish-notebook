import axios from 'axios';
export class GrokService {
    apiKey;
    baseURL = 'https://api.x.ai/v1';
    constructor(config) {
        this.apiKey = config.grokApiKey;
    }
    async generateWordInfo(word, englishLevel) {
        try {
            const levelPrompts = {
                middle_school: '中学生',
                university: '大学生',
                study_abroad: '留学生'
            };
            const prompt = `请为单词 "${word}" 生成适合${levelPrompts[englishLevel]}水平的学习信息。请用JSON格式返回，包含以下字段：
{
  "word": "${word}",
  "definition": "中文释义",
  "partOfSpeech": "词性(如：n. v. adj. adv.等)",
  "example": "一个英文例句",
  "exampleTranslation": "例句的中文翻译"
}

要求：
1. 释义要准确且适合${levelPrompts[englishLevel]}理解
2. 例句要简单易懂，符合${levelPrompts[englishLevel]}水平
3. 例句翻译要准确自然
4. 直接返回JSON，不要其他文字`;
            const response = await axios.post(`${this.baseURL}/chat/completions`, {
                model: 'grok-4-fast-non-reasoning',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 500
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            const content = response.data.choices[0].message.content;
            // 尝试解析JSON响应
            try {
                const parsed = JSON.parse(content);
                return {
                    word: parsed.word || word,
                    definition: parsed.definition || '释义生成失败',
                    partOfSpeech: parsed.partOfSpeech || 'n.',
                    example: parsed.example || '例句生成失败',
                    exampleTranslation: parsed.exampleTranslation || '例句翻译生成失败'
                };
            }
            catch {
                // 如果JSON解析失败，返回默认结构
                return {
                    word,
                    definition: '释义生成失败',
                    partOfSpeech: 'n.',
                    example: '例句生成失败',
                    exampleTranslation: '例句翻译生成失败'
                };
            }
        }
        catch (error) {
            throw new Error(`Grok API调用失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
    }
    async testConnection() {
        try {
            const response = await axios.get(`${this.baseURL}/models`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return response.status === 200;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=grok.js.map