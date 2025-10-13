import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Text, Box } from 'ink';
import TextInput from 'ink-text-input';
export const ClaudeInput = ({ value, onChange, onSubmit, placeholder = "", label, mask }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (_jsxs(Box, { flexDirection: "column", children: [label && (_jsx(Text, { color: "yellow", bold: true, children: label })), _jsx(Box, { borderStyle: "single", borderColor: isFocused ? "cyan" : "gray", paddingX: 1, paddingY: 0, children: _jsxs(Box, { flexDirection: "row", alignItems: "center", width: "100%", children: [_jsx(Text, { color: isFocused ? "cyan" : "gray", children: "\u25B6 " }), _jsx(Box, { flexGrow: 1, children: _jsx(TextInput, { value: value, onChange: onChange, onSubmit: onSubmit, placeholder: placeholder, mask: mask, focus: true }) })] }) })] }));
};
//# sourceMappingURL=ClaudeInput.js.map