import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import Spinner from 'ink-spinner';
import { Setup } from './Setup.js';
import { MainScreen } from './MainScreen.js';
import { ConfigManager } from '../services/config.js';
import type { Config } from '../utils/types.js';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<Config | null>(null);
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
    } catch (error) {
      console.error('配置加载失败:', error);
    }
    setIsLoading(false);
  };

  const handleSetupComplete = async (newConfig: Config) => {
    try {
      await configManager.save(newConfig);
      setConfig(newConfig);
    } catch (error) {
      console.error('配置保存失败:', error);
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Spinner type="dots" />
        <Text> 正在加载配置...</Text>
      </Box>
    );
  }

  if (!config) {
    return <Setup onComplete={handleSetupComplete} />;
  }

  return <MainScreen config={config} />;
};