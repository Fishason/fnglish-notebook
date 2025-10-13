import React, { useState } from 'react';
import { Text, Box } from 'ink';
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
  const [isFocused, setIsFocused] = useState(false);

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
            <TextInput
              value={value}
              onChange={onChange}
              onSubmit={onSubmit}
              placeholder={placeholder}
              mask={mask}
              focus={true}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};