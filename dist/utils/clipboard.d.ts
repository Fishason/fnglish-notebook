export declare class ClipboardManager {
    getImageBase64(): Promise<string | null>;
    getText(): Promise<string>;
    hasImage(): Promise<boolean>;
    private isImagePath;
    private isImageFile;
    private looksLikeBase64Image;
    convertFileToBase64(filePath: string): Promise<string>;
    watchClipboard(callback: (content: string, isImage: boolean) => void): Promise<() => void>;
}
