import * as tencentcloud from 'tencentcloud-sdk-nodejs-tmt';
import { TENCENT_CONFIG } from '../config/tencent.js';
const TmtClient = tencentcloud.tmt.v20180321.Client;
export class TencentTranslationService {
    client;
    constructor() {
        const clientConfig = {
            credential: {
                secretId: TENCENT_CONFIG.secretId,
                secretKey: TENCENT_CONFIG.secretKey,
            },
            region: TENCENT_CONFIG.region,
            profile: {
                httpProfile: {
                    endpoint: 'tmt.tencentcloudapi.com',
                },
            },
        };
        this.client = new TmtClient(clientConfig);
    }
    async translateText(text, from = 'en', to = 'zh') {
        try {
            const params = {
                SourceText: text,
                Source: from,
                Target: to,
                ProjectId: 0,
            };
            const response = await this.client.TextTranslate(params);
            return {
                original: text,
                translated: response.TargetText,
                type: 'text'
            };
        }
        catch (error) {
            throw new Error(`翻译失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
    }
    async translateImage(imageBase64, from = 'auto', to = 'zh') {
        try {
            const params = {
                SessionUuid: Date.now().toString(),
                Scene: 'doc',
                Data: imageBase64,
                Source: from,
                Target: to,
                ProjectId: 0,
            };
            const response = await this.client.ImageTranslate(params);
            // 尝试多种可能的响应结构
            let translatedText = '';
            if (response.ImageRecord && response.ImageRecord.Value && response.ImageRecord.Value.length > 0) {
                // 原有的响应结构
                translatedText = response.ImageRecord.Value[0].TargetText || '';
            }
            else if (response.ImageRecord && response.ImageRecord.TargetText) {
                // 可能的另一种结构
                translatedText = response.ImageRecord.TargetText;
            }
            else if (response.TargetText) {
                // 直接在根级别
                translatedText = response.TargetText;
            }
            else if (response.ImageRecord) {
                translatedText = '未找到翻译内容，请检查API响应结构';
            }
            else {
                translatedText = '图片翻译失败：未找到有效的响应数据';
            }
            return {
                original: '[图片内容]',
                translated: translatedText || '图片翻译失败',
                type: 'image'
            };
        }
        catch (error) {
            console.error('图片翻译错误:', error);
            throw new Error(`图片翻译失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
    }
    async detectLanguage(text) {
        try {
            const params = {
                Text: text,
                ProjectId: 0,
            };
            const response = await this.client.LanguageDetect(params);
            return response.Lang;
        }
        catch (error) {
            return 'en'; // 默认英文
        }
    }
}
//# sourceMappingURL=tencent.js.map