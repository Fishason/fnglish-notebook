import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Text, Box, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { Logo } from './Logo.js';
import { ClaudeInput } from './ClaudeInput.js';
import { TencentTranslationService } from '../services/tencent.js';
import { GrokService } from '../services/grok.js';
import { NotionService } from '../services/notion.js';
import { SpeechService } from '../services/speech.js';
import { ClipboardManager } from '../utils/clipboard.js';
export const MainScreen = ({ config }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [translationResult, setTranslationResult] = useState(null);
    const [wordInfo, setWordInfo] = useState(null);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    // Use config.notionDatabaseId directly.
    const databaseId = config.notionDatabaseId;
    const tencentService = new TencentTranslationService();
    const grokService = new GrokService(config);
    const notionService = new NotionService(config);
    const clipboardManager = new ClipboardManager();
    const speechService = new SpeechService('AIzaSyDBWchIinFsfLUD510QqvFzjvzSSZRglkw');
    // Removed initializeNotionDatabase useEffect since we now use ID from config directly.
    // 监听Ctrl+V和Ctrl+S键盘事件
    useInput((input, key) => {
        if (key.ctrl && input === 'v') {
            // 立即处理剪贴板图片
            handleClipboardImage();
            // 延迟清空输入框，确保'v'字符不会显示
            setTimeout(() => {
                setInput('');
            }, 0);
            return;
        }
        if (key.ctrl && input === 's') {
            // 播放输入框中的文本
            handleSpeech();
            // 延迟清空输入框中可能输入的's'字符，确保's'字符不会显示
            setTimeout(() => {
                // 如果输入框最后一个字符是's'，则移除它
                setInput(prev => prev.endsWith('s') ? prev.slice(0, -1) : prev);
            }, 0);
            return;
        }
    });
    const handleTranslation = async (text) => {
        if (!text.trim())
            return;
        setIsLoading(true);
        setError('');
        setTranslationResult(null);
        setWordInfo(null);
        try {
            // 1. 翻译文本
            setStatus('正在翻译...');
            const translation = await tencentService.translateText(text);
            setTranslationResult(translation);
            // 2. 如果是单个单词或连字符单词，生成详细信息
            if (text.trim().split(' ').length === 1 && /^[a-zA-Z-]+$/.test(text.trim())) {
                setStatus('正在生成单词信息...');
                const info = await grokService.generateWordInfo(text.trim(), config.englishLevel);
                setWordInfo(info);
                // 3. 添加到Notion
                if (databaseId) {
                    setStatus('正在保存...');
                    const wordExists = await notionService.checkWordExists(databaseId, text.trim());
                    if (!wordExists) {
                        await notionService.addWordEntry(databaseId, info);
                        setStatus('保存成功');
                    }
                    else {
                        setStatus('单词已存在');
                    }
                }
            }
            setTimeout(() => setStatus(''), 3000);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '处理失败');
        }
        setIsLoading(false);
    };
    const handleClipboardImage = async () => {
        setIsLoading(true);
        setError('');
        setTranslationResult(null);
        setWordInfo(null);
        try {
            setStatus('正在翻译图片...');
            const imageBase64 = await clipboardManager.getImageBase64();
            if (imageBase64) {
                const translation = await tencentService.translateImage(imageBase64);
                setTranslationResult(translation);
                // 图片翻译的内容处理逻辑
                // 图片翻译时，我们需要检查原文中的英文单词，而不是翻译后的中文
                // 因为腾讯API会将英文翻译成中文，我们需要从原图片中提取英文
                // 先尝试用英文作为目标语言重新翻译，获取原始英文内容
                setStatus('正在识别英文内容...');
                const englishTranslation = await tencentService.translateImage(imageBase64, 'auto', 'en');
                let originalEnglishText = '';
                // 如果翻译结果包含英文，说明原图可能是其他语言，翻译成英文的结果就是我们要的
                if (englishTranslation.translated && /[a-zA-Z]/.test(englishTranslation.translated)) {
                    originalEnglishText = englishTranslation.translated;
                }
                else {
                    // 如果翻译成英文没有英文内容，尝试从原始OCR结果中提取
                    // 这种情况下，原图片本身就包含英文，我们需要反向推导
                    const reverseTranslation = await tencentService.translateText(translation.translated, 'zh', 'en');
                    originalEnglishText = reverseTranslation.translated;
                }
                // 检查是否找到了英文内容
                if (originalEnglishText && /[a-zA-Z]/.test(originalEnglishText)) {
                    // 提取英文单词（包括连字符单词）
                    const words = originalEnglishText.match(/\b[a-zA-Z]+(?:-[a-zA-Z]+)*\b/g);
                    if (words && words.length > 0) {
                        // 取第一个有效单词（长度大于2）
                        const mainWord = words.find(word => word.length > 2)?.toLowerCase() || words[0].toLowerCase();
                        // 使用Grok AI获取单词信息
                        setStatus('正在获取单词信息...');
                        const info = await grokService.generateWordInfo(mainWord, config.englishLevel);
                        setWordInfo(info);
                        // 保存到Notion
                        if (databaseId) {
                            const wordExists = await notionService.checkWordExists(databaseId, mainWord);
                            if (!wordExists) {
                                await notionService.addWordEntry(databaseId, info);
                                setStatus('保存成功');
                            }
                            else {
                                setStatus('单词已存在');
                            }
                        }
                    }
                    else {
                        setStatus('翻译完成');
                    }
                }
                else {
                    setStatus('翻译完成');
                }
                setTimeout(() => setStatus(''), 3000);
            }
            else {
                setError('剪贴板中没有图片数据');
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '图片翻译失败');
        }
        setIsLoading(false);
    };
    const handleSpeech = async () => {
        if (!input.trim())
            return;
        setIsLoading(true);
        setError('');
        try {
            setStatus('正在播放语音...');
            await speechService.speakText(input.trim());
            setStatus('语音播放完成');
            setTimeout(() => setStatus(''), 2000);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '语音播放失败');
        }
        setIsLoading(false);
    };
    const handleSubmit = (value) => {
        handleTranslation(value);
        setInput('');
    };
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Logo, {}), _jsx(Box, { justifyContent: "flex-end", children: _jsx(Text, { color: "gray", dimColor: true, children: "Ctrl+C \u9000\u51FA | Ctrl+S \u8BED\u97F3\u64AD\u653E" }) }), _jsx(ClaudeInput, { value: input, onChange: setInput, onSubmit: handleSubmit, placeholder: "\u952E\u5165\u5355\u8BCD/\u53E5\u5B50 | \u6216\u6309Ctrl+V\u7C98\u8D34\u56FE\u7247 | Ctrl+S\u53D1\u97F3\u64AD\u653E", label: "\uD83D\uDD24 \u8F93\u5165\u7FFB\u8BD1\u5185\u5BB9:" }), isLoading && (_jsxs(Box, { children: [_jsx(Spinner, { type: "dots" }), _jsxs(Text, { color: "cyan", children: [" ", status || '处理中...'] })] })), status && !isLoading && (_jsxs(Text, { color: "green", children: ["\u2728 ", status] })), error && (_jsxs(Text, { color: "red", children: ["\u274C ", error] })), translationResult && (_jsxs(Box, { flexDirection: "column", marginTop: 1, paddingX: 1, borderStyle: "round", borderColor: "cyan", children: [_jsxs(Text, { color: "cyan", bold: true, children: ["\uD83D\uDCDD ", translationResult.original] }), _jsxs(Text, { color: "green", children: ["\u279C ", translationResult.translated] })] }))] }));
};
//# sourceMappingURL=MainScreen.js.map