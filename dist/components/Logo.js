import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
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
export const Logo = () => {
    const [colorOffset, setColorOffset] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setColorOffset(prev => (prev + 1) % RAINBOW_COLORS.length);
        }, 300);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs(Box, { flexDirection: "column", alignItems: "center", children: [LOGO_LINES.map((line, lineIndex) => (_jsx(Text, { color: RAINBOW_COLORS[(lineIndex + colorOffset) % RAINBOW_COLORS.length], children: line }, lineIndex))), _jsx(Text, { color: "gray", dimColor: true, children: "\uD83D\uDCDA Your English Learning Companion" })] }));
};
//# sourceMappingURL=Logo.js.map