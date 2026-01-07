import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Text, Box } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { Logo } from './Logo.js';
import { ClaudeInput } from './ClaudeInput.js';
import { ENGLISH_LEVELS } from '../constants.js';
import { GrokService } from '../services/grok.js';
import { NotionService } from '../services/notion.js';
export const Setup = ({ onComplete }) => {
    const [step, setStep] = useState('level');
    const [config, setConfig] = useState({});
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const handleLevelSelect = (item) => {
        setConfig(prev => ({ ...prev, englishLevel: item.value }));
        setStep('grok');
    };
    const handleInput = async (value) => {
        setInput('');
        setError('');
        setIsLoading(true);
        try {
            switch (step) {
                case 'grok':
                    // 测试Grok API
                    const tempConfig = { ...config, grokApiKey: value };
                    const grokService = new GrokService(tempConfig);
                    const grokConnected = await grokService.testConnection();
                    if (!grokConnected) {
                        setError('Grok API密钥无效，请检查后重新输入');
                        setIsLoading(false);
                        return;
                    }
                    setConfig(prev => ({ ...prev, grokApiKey: value }));
                    setStep('notion_token');
                    break;
                case 'notion_token':
                    setConfig(prev => ({ ...prev, notionToken: value }));
                    setStep('notion_database');
                    break;
                case 'notion_database':
                    // 验证数据库ID
                    const notionConfigDb = {
                        ...config,
                        notionToken: config.notionToken,
                        notionDatabaseId: value
                    };
                    const notionServiceDb = new NotionService(notionConfigDb);
                    const dbConnected = await notionServiceDb.testConnection();
                    if (!dbConnected) {
                        setError('无法访问Notion数据库，请检查Token和数据库ID');
                        setIsLoading(false);
                        return;
                    }
                    setConfig(prev => ({ ...prev, notionDatabaseId: value }));
                    setStep('notion_template');
                    break;
                case 'notion_template':
                    setConfig(prev => ({ ...prev, notionTemplateId: value }));
                    setStep('notion_deck');
                    break;
                case 'notion_deck':
                    // Validate deck id (which is a page ID)
                    // We can reuse testConnection style logic or just a quick page retrieve
                    // But NotionService needs to be fully instantiated to check properly
                    // For now, let's just save it. Validation happens when adding words usually.
                    // Or we can try to retrieve the page to confirm it exists.
                    const notionConfigFull = {
                        ...config,
                        notionDeckId: value
                    };
                    // Optional: Verify deck page exists
                    const notionServiceDeck = new NotionService(notionConfigFull);
                    // We will add a helper to check page existence later in service if needed
                    // For now, assume it's valid if user provides it.
                    setConfig(prev => ({ ...prev, notionDeckId: value }));
                    setStep('testing');
                    // 进行最终测试
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setStep('complete');
                    onComplete(notionConfigFull);
                    break;
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '连接测试失败');
        }
        setIsLoading(false);
    };
    const renderStep = () => {
        if (isLoading) {
            return (_jsxs(Box, { children: [_jsx(Spinner, { type: "dots" }), _jsx(Text, { children: " \u6B63\u5728\u9A8C\u8BC1\u914D\u7F6E..." })] }));
        }
        switch (step) {
            case 'level':
                return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Text, { color: "yellow", bold: true, children: "\uD83C\uDFAF \u9009\u62E9\u82F1\u6587\u6C34\u5E73:" }), _jsx(SelectInput, { items: ENGLISH_LEVELS, onSelect: handleLevelSelect, indicatorComponent: ({ isSelected }) => (_jsx(Box, { marginRight: 1, children: _jsx(Text, { color: isSelected ? 'cyan' : 'gray', children: isSelected ? '▶' : ' ' }) })), itemComponent: ({ isSelected, label }) => (_jsx(Text, { color: isSelected ? 'cyan' : 'white', bold: isSelected, children: label })) })] }));
            case 'grok':
                return (_jsxs(Box, { flexDirection: "column", children: [_jsx(ClaudeInput, { value: input, onChange: setInput, onSubmit: handleInput, placeholder: "\u8F93\u5165API\u5BC6\u94A5...", label: "\uD83E\uDD16 Grok API Key:", mask: "*" }), _jsx(Text, { color: "gray", dimColor: true, children: "docs.x.ai/docs" })] }));
            case 'notion_token':
                return (_jsxs(Box, { flexDirection: "column", children: [_jsx(ClaudeInput, { value: input, onChange: setInput, onSubmit: handleInput, placeholder: "\u8F93\u5165Token...", label: "\uD83D\uDCDD Notion Token:", mask: "*" }), _jsx(Text, { color: "gray", dimColor: true, children: "notion.so/my-integrations" })] }));
            case 'notion_database':
                return (_jsxs(Box, { flexDirection: "column", children: [_jsx(ClaudeInput, { value: input, onChange: setInput, onSubmit: handleInput, placeholder: "\u8F93\u5165\u6570\u636E\u5E93ID...", label: "\uD83D\uDDC4\uFE0F Notion\u6570\u636E\u5E93ID:" }), _jsx(Text, { color: "gray", dimColor: true, children: "\u4ECE\u6570\u636E\u5E93\u9875\u9762URL\u590D\u5236ID" })] }));
            case 'notion_template':
                return (_jsxs(Box, { flexDirection: "column", children: [_jsx(ClaudeInput, { value: input, onChange: setInput, onSubmit: handleInput, placeholder: "\u8F93\u5165\u6A21\u7248\u9875\u9762ID...", label: "\uD83D\uDCCB Notion\u6A21\u7248\u9875\u9762ID:" }), _jsx(Text, { color: "gray", dimColor: true, children: "\u7528\u4E8E\u590D\u5236\u56FE\u6807\u548C\u5C01\u9762\u7684\u9875\u9762ID" })] }));
            case 'notion_deck':
                return (_jsxs(Box, { flexDirection: "column", children: [_jsx(ClaudeInput, { value: input, onChange: setInput, onSubmit: handleInput, placeholder: "\u8F93\u5165\u724C\u7EC4\u9875\u9762ID...", label: "\uD83C\uDFB4 Notion\u724C\u7EC4\u9875\u9762ID:" }), _jsx(Text, { color: "gray", dimColor: true, children: "\u5355\u8BCD\u5C06\u81EA\u52A8\u5173\u8054\u5230\u6B64\u724C\u7EC4(Page ID)" })] }));
            case 'testing':
                return (_jsxs(Box, { children: [_jsx(Spinner, { type: "dots" }), _jsx(Text, { children: " \u6B63\u5728\u4FDD\u5B58\u914D\u7F6E..." })] }));
            case 'complete':
                return (_jsx(Text, { color: "green", children: "\u2705 \u914D\u7F6E\u5B8C\u6210\uFF01\u6B63\u5728\u542F\u52A8\u5E94\u7528..." }));
            default:
                return null;
        }
    };
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Logo, {}), _jsxs(Box, { flexDirection: "row", justifyContent: "space-between", children: [_jsx(Text, { color: "cyan", bold: true, children: "\uD83D\uDE80 \u6B22\u8FCE\u4F7F\u7528 Fnglish Notebook!" }), _jsx(Text, { color: "gray", dimColor: true, children: "\u9996\u6B21\u914D\u7F6E" })] }), error && (_jsx(Box, { marginTop: 1, children: _jsxs(Text, { color: "red", children: ["\u274C ", error] }) })), _jsx(Box, { marginTop: 1, children: renderStep() })] }));
};
//# sourceMappingURL=Setup.js.map