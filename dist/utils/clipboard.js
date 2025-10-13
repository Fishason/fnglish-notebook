import clipboardy from 'clipboardy';
import Jimp from 'jimp';
import * as clipboardFiles from 'clipboard-files';
import fs from 'fs';
import { execSync } from 'child_process';
import os from 'os';
import path from 'path';
export class ClipboardManager {
    async getImageBase64() {
        try {
            // console.log('=== 开始检查剪贴板图片 ===');
            // 方法1: 尝试使用clipboard-files库读取剪贴板文件
            try {
                const files = await clipboardFiles.readFiles();
                if (files && files.length > 0) {
                    for (const file of files) {
                        if (this.isImageFile(file)) {
                            const fileBuffer = fs.readFileSync(file);
                            const base64 = fileBuffer.toString('base64');
                            return base64;
                        }
                    }
                }
            }
            catch (err) {
                // clipboard-files方法失败，继续尝试其他方法
            }
            // 方法2: 检查剪贴板文本内容
            try {
                const clipboardContent = await clipboardy.read();
                // 检查是否为base64图片数据
                if (clipboardContent.startsWith('data:image')) {
                    return clipboardContent.split(',')[1];
                }
                // 检查是否为图片路径
                if (this.isImagePath(clipboardContent)) {
                    const fileBuffer = fs.readFileSync(clipboardContent);
                    return fileBuffer.toString('base64');
                }
                // 检查是否为纯base64图片数据（某些应用复制图片时）
                if (this.looksLikeBase64Image(clipboardContent)) {
                    return clipboardContent;
                }
            }
            catch (err) {
                // 剪贴板文本检查失败，继续尝试其他方法
            }
            // 方法3: 在macOS上尝试使用命令行工具
            if (os.platform() === 'darwin') {
                try {
                    const tempDir = os.tmpdir();
                    const tempImagePath = path.join(tempDir, `clipboard_${Date.now()}.png`);
                    // 尝试使用osascript保存剪贴板图片
                    const script = `
            tell application "System Events"
              try
                set the clipboard to (the clipboard as «class PNGf»)
                set imageData to (the clipboard as «class PNGf»)
                set fileRef to open for access POSIX file "${tempImagePath}" with write permission
                write imageData to fileRef
                close access fileRef
                return "success"
              on error
                return "error"
              end try
            end tell
          `;
                    const result = execSync(`osascript -e '${script}'`, {
                        encoding: 'utf8',
                        timeout: 5000
                    }).trim();
                    if (result === 'success' && fs.existsSync(tempImagePath)) {
                        const fileBuffer = fs.readFileSync(tempImagePath);
                        const base64 = fileBuffer.toString('base64');
                        // 清理临时文件
                        fs.unlinkSync(tempImagePath);
                        return base64;
                    }
                }
                catch (err) {
                    // macOS命令行方法失败
                }
            }
            return null;
        }
        catch (error) {
            console.error('❌ getImageBase64错误:', error);
            return null;
        }
    }
    async getText() {
        try {
            return await clipboardy.read();
        }
        catch {
            return '';
        }
    }
    async hasImage() {
        try {
            const content = await clipboardy.read();
            return content.startsWith('data:image') || this.isImagePath(content);
        }
        catch {
            return false;
        }
    }
    isImagePath(text) {
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];
        return imageExtensions.some(ext => text.toLowerCase().endsWith(ext));
    }
    isImageFile(filePath) {
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.pdf'];
        return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
    }
    looksLikeBase64Image(content) {
        // 检查是否看起来像base64编码的图片数据
        if (content.length < 100)
            return false; // 太短不可能是图片
        if (content.length > 10000000)
            return false; // 太长超过限制
        // base64只包含特定字符
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(content))
            return false;
        // 尝试解码前几个字节检查图片文件头
        try {
            const buffer = Buffer.from(content.substring(0, 100), 'base64');
            const hex = buffer.toString('hex').toLowerCase();
            // 检查常见图片文件头
            const imageHeaders = [
                '89504e47', // PNG
                'ffd8ff', // JPEG
                '47494638', // GIF
                '424d', // BMP
                '52494646', // WEBP (RIFF)
            ];
            return imageHeaders.some(header => hex.startsWith(header));
        }
        catch {
            return false;
        }
    }
    async convertFileToBase64(filePath) {
        try {
            const image = await Jimp.read(filePath);
            const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
            return buffer.toString('base64');
        }
        catch (error) {
            throw new Error(`图片转换失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
    }
    async watchClipboard(callback) {
        let lastContent = '';
        const checkClipboard = async () => {
            try {
                const currentContent = await clipboardy.read();
                if (currentContent !== lastContent) {
                    lastContent = currentContent;
                    const isImage = await this.hasImage();
                    callback(currentContent, isImage);
                }
            }
            catch {
                // 忽略错误
            }
        };
        const interval = setInterval(checkClipboard, 500);
        return () => clearInterval(interval);
    }
}
//# sourceMappingURL=clipboard.js.map