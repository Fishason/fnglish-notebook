import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import Spinner from 'ink-spinner';
import { Setup } from './Setup.js';
import { MainScreen } from './MainScreen.js';
import { ConfigManager } from '../services/config.js';
export const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [config, setConfig] = useState(null);
    const [configManager] = useState(new ConfigManager());
    useEffect(() => {
        loadConfig();
    }, []);
    const loadConfig = async () => {
        try {
            const exists = await configManager.exists();
            if (exists) {
                const loadedConfig = await configManager.load();
                // Check if config matches new structure (has notionDatabaseId)
                if (loadedConfig && loadedConfig.notionDatabaseId) {
                    setConfig(loadedConfig);
                }
            }
        }
        catch (error) {
            console.error('配置加载失败:', error);
        }
        setIsLoading(false);
    };
    const handleSetupComplete = async (newConfig) => {
        try {
            await configManager.save(newConfig);
            setConfig(newConfig);
        }
        catch (error) {
            console.error('配置保存失败:', error);
        }
    };
    if (isLoading) {
        return (_jsxs(Box, { children: [_jsx(Spinner, { type: "dots" }), _jsx(Text, { children: " \u6B63\u5728\u52A0\u8F7D\u914D\u7F6E..." })] }));
    }
    if (!config) {
        return _jsx(Setup, { onComplete: handleSetupComplete });
    }
    return _jsx(MainScreen, { config: config });
};
//# sourceMappingURL=App.js.map