import React, { useState, useEffect } from 'react';
import { Text, Box, useInput } from 'ink';
import TextInput from 'ink-text-input';

interface ClaudeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  label?: string;
  mask?: string;
}

export const ClaudeInput: React.FC<ClaudeInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "",
  label,
  mask
}) => {
  const [isFocused, setIsFocused] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  // 检测是否为Windows且可能有输入问题
  useEffect(() => {
    const isWindows = process.platform === 'win32';
    if (isWindows) {
      // 在Windows上，给用户一些时间尝试正常输入
      const timer = setTimeout(() => {
        // 如果5秒后仍然没有输入，提供fallback提示
        if (!value) {
          setShowFallback(true);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [value]);

  // Windows fallback: 监听Ctrl+V粘贴
  useInput((input, key) => {
    if (process.platform === 'win32' && key.ctrl && input === 'v') {
      // 在Windows上，尝试读取剪贴板
      const { execSync } = require('child_process');
      try {
        const clipboardContent = execSync('powershell -Command "Get-Clipboard"', { 
          encoding: 'utf8',
          timeout: 3000 
        }).trim();
        if (clipboardContent) {
          onChange(clipboardContent);
        }
      } catch (err) {
        // 粘贴失败，忽略
      }
    }
  });

  const inputComponent = (
    <TextInput
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      placeholder={placeholder}
      mask={mask}
      focus={true}
      showCursor={true}
    />
  );

  return (
    <Box flexDirection="column">
      {label && (
        <Text color="yellow" bold>
          {label}
        </Text>
      )}
      
      <Box 
        borderStyle="single" 
        borderColor={isFocused ? "cyan" : "gray"}
        paddingX={1}
        paddingY={0}
      >
        <Box flexDirection="row" alignItems="center" width="100%">
          <Text color={isFocused ? "cyan" : "gray"}>▶ </Text>
          <Box flexGrow={1}>
            {inputComponent}
          </Box>
        </Box>
      </Box>

      {/* Windows特殊提示 */}
      {process.platform === 'win32' && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="gray" dimColor>
            💡 Windows提示: 可以尝试Ctrl+V粘贴，或在新的PowerShell窗口中运行
          </Text>
          {showFallback && !value && (
            <Text color="yellow">
              ⚠️  输入有困难？请尝试：1) Ctrl+V粘贴 2) 重启终端 3) 使用PowerShell而非CMD
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};