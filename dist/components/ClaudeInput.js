import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Text, Box, useInput } from 'ink';
import TextInput from 'ink-text-input';
export const ClaudeInput = ({ value, onChange, onSubmit, placeholder = "", label, mask }) => {
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
            }
            catch (err) {
                // 粘贴失败，忽略
            }
        }
    });
    const inputComponent = (_jsx(TextInput, { value: value, onChange: onChange, onSubmit: onSubmit, placeholder: placeholder, mask: mask, focus: true, showCursor: true }));
    return (_jsxs(Box, { flexDirection: "column", children: [label && (_jsx(Text, { color: "yellow", bold: true, children: label })), _jsx(Box, { borderStyle: "single", borderColor: isFocused ? "cyan" : "gray", paddingX: 1, paddingY: 0, children: _jsxs(Box, { flexDirection: "row", alignItems: "center", children: [_jsx(Text, { color: isFocused ? "cyan" : "gray", children: "\u25B6 " }), _jsx(Box, { flexGrow: 1, children: inputComponent })] }) }), process.platform === 'win32' && (_jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsx(Text, { color: "gray", dimColor: true, children: "\uD83D\uDCA1 Windows\u63D0\u793A: \u53EF\u4EE5\u5C1D\u8BD5Ctrl+V\u7C98\u8D34\uFF0C\u6216\u5728\u65B0\u7684PowerShell\u7A97\u53E3\u4E2D\u8FD0\u884C" }), showFallback && !value && (_jsx(Text, { color: "yellow", children: "\u26A0\uFE0F  \u8F93\u5165\u6709\u56F0\u96BE\uFF1F\u8BF7\u5C1D\u8BD5\uFF1A1) Ctrl+V\u7C98\u8D34 2) \u91CD\u542F\u7EC8\u7AEF 3) \u4F7F\u7528PowerShell\u800C\u975ECMD" }))] }))] }));
};
//# sourceMappingURL=ClaudeInput.js.map