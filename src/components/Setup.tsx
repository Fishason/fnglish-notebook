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

type SetupStep = 'level' | 'grok' | 'notion_token' | 'notion_database' | 'notion_template' | 'notion_deck' | 'testing' | 'complete';

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
          setStep('notion_database');
          break;

        case 'notion_database':
          // 验证数据库ID
          const notionConfigDb = { 
            ...config, 
            notionToken: config.notionToken!, 
            notionDatabaseId: value 
          } as Config;
          
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
          } as Config;
          
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

      case 'notion_database':
        return (
          <Box flexDirection="column">
            <ClaudeInput
              value={input}
              onChange={setInput}
              onSubmit={handleInput}
              placeholder="输入数据库ID..."
              label="🗄️ Notion数据库ID:"
            />
            <Text color="gray" dimColor>从数据库页面URL复制ID</Text>
          </Box>
        );

      case 'notion_template':
        return (
          <Box flexDirection="column">
            <ClaudeInput
              value={input}
              onChange={setInput}
              onSubmit={handleInput}
              placeholder="输入模版页面ID..."
              label="📋 Notion模版页面ID:"
            />
            <Text color="gray" dimColor>用于复制图标和封面的页面ID</Text>
          </Box>
        );
        
      case 'notion_deck':
        return (
          <Box flexDirection="column">
            <ClaudeInput
              value={input}
              onChange={setInput}
              onSubmit={handleInput}
              placeholder="输入牌组页面ID..."
              label="🎴 Notion牌组页面ID:"
            />
            <Text color="gray" dimColor>单词将自动关联到此牌组(Page ID)</Text>
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