import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';

const RAINBOW_COLORS = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];

const LOGO_LINES = [
  '  ███████╗███╗   ██╗ ██████╗ ██╗     ██╗███████╗██╗  ██╗',
  '  ██╔════╝████╗  ██║██╔════╝ ██║     ██║██╔════╝██║  ██║',
  '  █████╗  ██╔██╗ ██║██║  ███╗██║     ██║███████╗███████║',
  '  ██╔══╝  ██║╚██╗██║██║   ██║██║     ██║╚════██║██╔══██║',
  '  ██║     ██║ ╚████║╚██████╔╝███████╗██║███████║██║  ██║',
  '  ╚═╝     ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚═╝╚══════╝╚═╝  ╚═╝'
];

export const Logo: React.FC = () => {
  const [colorOffset, setColorOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorOffset(prev => (prev + 1) % RAINBOW_COLORS.length);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box flexDirection="column" alignItems="center">
      {LOGO_LINES.map((line, lineIndex) => (
        <Text key={lineIndex} color={RAINBOW_COLORS[(lineIndex + colorOffset) % RAINBOW_COLORS.length]}>
          {line}
        </Text>
      ))}
      <Text color="gray" dimColor>
        📚 Your English Learning Companion
      </Text>
    </Box>
  );
};