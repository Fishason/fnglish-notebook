import React, { useState } from 'react';
import { Text, Box, Newline } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { Logo } from './Logo.js';
import { ClaudeInput } from './ClaudeInput.js';
import { ENGLISH_LEVELS } from '../constants.js';
import type { Config } from '../utils/types.js';
import { GrokService } from '../services/grok.js';
import { NotionService } from '../services/notion.js';

interface SetupProps {
  onComplete: (config: Config) => void;
}

type SetupStep = 'level' | 'grok' | 'notion_token' | 'notion_page' | 'testing' | 'complete';

export const Setup: React.FC<SetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState<SetupStep>('level');
  const [config, setConfig] = useState<Partial<Config>>({});
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLevelSelect = (item: any) => {
    setConfig(prev => ({ ...prev, englishLevel: item.value }));
    setStep('grok');
  };

  const handleInput = async (value: string) => {
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      switch (step) {
        case 'grok':
          // 测试Grok API
          const tempConfig = { ...config, grokApiKey: value } as Config;
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
          setStep('notion_page');
          break;

        case 'notion_page':
          // 测试Notion连接
          const notionConfig = { ...config, notionToken: config.notionToken!, notionPageId: value } as Config;
          const notionService = new NotionService(notionConfig);
          const notionConnected = await notionService.testConnection();
          
          if (!notionConnected) {
            setError('Notion连接失败，请检查Token和页面ID');
            setIsLoading(false);
            return;
          }

          const finalConfig = { 
            ...config, 
            notionPageId: value
          } as Config;
          
          setConfig(finalConfig);
          setStep('testing');
          
          // 进行最终测试
          await new Promise(resolve => setTimeout(resolve, 1000));
          setStep('complete');
          onComplete(finalConfig);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '连接测试失败');
    }
    
    setIsLoading(false);
  };

  const renderStep = () => {
    if (isLoading) {
      return (
        <Box>
          <Spinner type="dots" />
          <Text> 正在验证配置...</Text>
        </Box>
      );
    }

    switch (step) {
      case 'level':
        return (
          <Box flexDirection="column">
            <Text color="yellow" bold>🎯 选择英文水平:</Text>
            <SelectInput 
              items={ENGLISH_LEVELS} 
              onSelect={handleLevelSelect}
              indicatorComponent={({ isSelected }) => (
                <Box marginRight={1}>
                  <Text color={isSelected ? 'cyan' : 'gray'}>
                    {isSelected ? '▶' : ' '}
                  </Text>
                </Box>
              )}
              itemComponent={({ isSelected, label }) => (
                <Text color={isSelected ? 'cyan' : 'white'} bold={isSelected}>
                  {label}
                </Text>
              )}
            />
          </Box>
        );

      case 'grok':
        return (
          <Box flexDirection="column">
            <ClaudeInput
              value={input}
              onChange={setInput}
              onSubmit={handleInput}
              placeholder="输入API密钥..."
              label="🤖 Grok API Key:"
              mask="*"
            />
            <Text color="gray" dimColor>docs.x.ai/docs</Text>
          </Box>
        );

      case 'notion_token':
        return (
          <Box flexDirection="column">
            <ClaudeInput
              value={input}
              onChange={setInput}
              onSubmit={handleInput}
              placeholder="输入Token..."
              label="📝 Notion Token:"
              mask="*"
            />
            <Text color="gray" dimColor>notion.so/my-integrations</Text>
          </Box>
        );

      case 'notion_page':
        return (
          <Box flexDirection="column">
            <ClaudeInput
              value={input}
              onChange={setInput}
              onSubmit={handleInput}
              placeholder="输入页面ID..."
              label="📄 Notion页面ID:"
            />
            <Text color="gray" dimColor>从页面URL复制ID</Text>
          </Box>
        );

      case 'testing':
        return (
          <Box>
            <Spinner type="dots" />
            <Text> 正在保存配置...</Text>
          </Box>
        );

      case 'complete':
        return (
          <Text color="green">✅ 配置完成！正在启动应用...</Text>
        );

      default:
        return null;
    }
  };

  return (
    <Box flexDirection="column">
      <Logo />
      <Box flexDirection="row" justifyContent="space-between">
        <Text color="cyan" bold>🚀 欢迎使用 Fnglish Notebook!</Text>
        <Text color="gray" dimColor>首次配置</Text>
      </Box>
      
      {error && (
        <Box marginTop={1}>
          <Text color="red">❌ {error}</Text>
        </Box>
      )}
      
      <Box marginTop={1}>
        {renderStep()}
      </Box>
    </Box>
  );
};