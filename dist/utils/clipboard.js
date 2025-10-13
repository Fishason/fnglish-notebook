import clipboardy from 'clipboardy';
import Jimp from 'jimp';
import fs from 'fs';
import { execSync } from 'child_process';
import os from 'os';
import path from 'path';
export class ClipboardManager {
    async getImageBase64() {
        try {
            // console.log('=== 开始检查剪贴板图片 ===');
            // 方法1: 平台特定的剪贴板图片获取 (主要方法)
            const platform = os.platform();
            if (platform === 'darwin') {
                // macOS: 使用osascript
                const macResult = await this.getMacClipboardImage();
                if (macResult)
                    return macResult;
            }
            else if (platform === 'win32') {
                // Windows: 使用PowerShell
                const winResult = await this.getWindowsClipboardImage();
                if (winResult)
                    return winResult;
            }
            else if (platform === 'linux') {
                // Linux: 使用xclip
                const linuxResult = await this.getLinuxClipboardImage();
                if (linuxResult)
                    return linuxResult;
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
    // 平台特定的剪贴板图片获取方法
    async getMacClipboardImage() {
        try {
            const tempDir = os.tmpdir();
            const tempImagePath = path.join(tempDir, `clipboard_${Date.now()}.png`);
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
                fs.unlinkSync(tempImagePath);
                return base64;
            }
        }
        catch (err) {
            // macOS方法失败
        }
        return null;
    }
    async getWindowsClipboardImage() {
        try {
            const tempDir = os.tmpdir();
            const tempImagePath = path.join(tempDir, `clipboard_${Date.now()}.png`);
            // PowerShell脚本保存剪贴板图片
            const powershellScript = `
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Drawing
        $clipboard = [System.Windows.Forms.Clipboard]::GetImage()
        if ($clipboard -ne $null) {
          $clipboard.Save("${tempImagePath.replace(/\\/g, '\\\\')}", [System.Drawing.Imaging.ImageFormat]::Png)
          Write-Output "success"
        } else {
          Write-Output "error"
        }
      `;
            const result = execSync(`powershell -Command "${powershellScript}"`, {
                encoding: 'utf8',
                timeout: 5000
            }).trim();
            if (result === 'success' && fs.existsSync(tempImagePath)) {
                const fileBuffer = fs.readFileSync(tempImagePath);
                const base64 = fileBuffer.toString('base64');
                fs.unlinkSync(tempImagePath);
                return base64;
            }
        }
        catch (err) {
            // Windows方法失败
        }
        return null;
    }
    async getLinuxClipboardImage() {
        try {
            const tempDir = os.tmpdir();
            const tempImagePath = path.join(tempDir, `clipboard_${Date.now()}.png`);
            // 使用xclip保存剪贴板图片
            execSync(`xclip -selection clipboard -t image/png -o > "${tempImagePath}"`, {
                timeout: 5000
            });
            if (fs.existsSync(tempImagePath) && fs.statSync(tempImagePath).size > 0) {
                const fileBuffer = fs.readFileSync(tempImagePath);
                const base64 = fileBuffer.toString('base64');
                fs.unlinkSync(tempImagePath);
                return base64;
            }
        }
        catch (err) {
            // Linux方法失败
        }
        return null;
    }
}
//# sourceMappingURL=clipboard.js.map