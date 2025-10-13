import fs from 'fs';
import path from 'path';
import os from 'os';
// @ts-ignore - play-sound doesn't have types
import Player from 'play-sound';

interface SpeechSynthesisRequest {
  input: {
    text: string;
  };
  voice: {
    languageCode: string;
    name?: string;
    ssmlGender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
  };
  audioConfig: {
    audioEncoding: string;
    speakingRate?: number;
    pitch?: number;
  };
}

interface SpeechSynthesisResponse {
  audioContent: string; // base64 encoded audio
}

export class SpeechService {
  private apiKey: string;
  private player: any;
  private tempDir: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.player = Player({});
    this.tempDir = path.join(os.tmpdir(), 'fnglish-notebook');
    
    // 确保临时目录存在
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async speakText(text: string): Promise<void> {
    try {
      const audioData = await this.synthesizeSpeech(text);
      await this.playAudio(audioData);
    } catch (error) {
      console.error('语音播放失败:', error);
      throw new Error(`语音播放失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  private async synthesizeSpeech(text: string): Promise<Buffer> {
    const request: SpeechSynthesisRequest = {
      input: {
        text: text
      },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Standard-H', // 女声
        ssmlGender: 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0
      }
    };

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Text-to-Speech API错误: ${response.status} - ${errorText}`);
    }

    const data: SpeechSynthesisResponse = await response.json();
    
    if (!data.audioContent) {
      throw new Error('API返回的音频内容为空');
    }

    // 将base64音频数据转换为Buffer
    return Buffer.from(data.audioContent, 'base64');
  }

  private async playAudio(audioBuffer: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      // 创建临时音频文件
      const tempFilePath = path.join(this.tempDir, `speech_${Date.now()}.mp3`);
      
      try {
        // 写入音频文件
        fs.writeFileSync(tempFilePath, audioBuffer);
        
        // 播放音频
        this.player.play(tempFilePath, (err: any) => {
          // 播放完成后删除临时文件
          try {
            fs.unlinkSync(tempFilePath);
          } catch (cleanupError) {
            console.warn('清理临时文件失败:', cleanupError);
          }

          if (err) {
            reject(new Error(`音频播放失败: ${err.message}`));
          } else {
            resolve();
          }
        });
      } catch (fileError) {
        reject(new Error(`文件操作失败: ${fileError instanceof Error ? fileError.message : '未知错误'}`));
      }
    });
  }

  // 清理临时目录
  cleanupTempFiles(): void {
    try {
      if (fs.existsSync(this.tempDir)) {
        const files = fs.readdirSync(this.tempDir);
        files.forEach(file => {
          if (file.startsWith('speech_') && file.endsWith('.mp3')) {
            try {
              fs.unlinkSync(path.join(this.tempDir, file));
            } catch (error) {
              console.warn(`清理临时文件失败: ${file}`, error);
            }
          }
        });
      }
    } catch (error) {
      console.warn('清理临时目录失败:', error);
    }
  }
}