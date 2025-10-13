#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { App } from './components/App.js';
// 处理未捕获的异常
process.on('unhandledRejection', (error) => {
    console.error('未处理的Promise rejection:', error);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
    process.exit(1);
});
// 渲染应用
const { rerender, unmount } = render(React.createElement(App), {
    exitOnCtrlC: true,
    patchConsole: false
});
// 处理退出信号
process.on('SIGINT', () => {
    unmount();
    process.exit(0);
});
process.on('SIGTERM', () => {
    unmount();
    process.exit(0);
});
//# sourceMappingURL=index.js.map