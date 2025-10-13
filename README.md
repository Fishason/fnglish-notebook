# Fnglish Notebook

🚀 **A powerful CLI tool for English learning with real-time translation and intelligent note-taking**

## ✨ Features

- 🖼️ **Image Translation**: Copy and paste images from clipboard for instant translation
- 📝 **Text Translation**: Fast and accurate text translation powered by Tencent Cloud
- 🤖 **AI Word Analysis**: Intelligent word analysis with definitions, examples, and usage
- 📚 **Notion Integration**: Automatic vocabulary saving to your Notion database
- 🎯 **Adaptive Learning**: Content adapted to your English proficiency level
- ⌨️ **Intuitive Interface**: Clean terminal UI with keyboard shortcuts

## 🎥 Quick Demo

```bash
# Install globally
npm install -g fnglish-notebook

# Run the application
fnglish
# or use alternative commands
fnglish-notebook
fnb
```

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- **Grok API Key**: Get from [Grok AI](https://console.x.ai/)
- **Notion Integration & Page Setup** (详细步骤见下方)

## 🔧 Notion 集成配置 (重要!)

### 步骤 1: 创建 Notion Integration
1. 访问 [Notion Integrations](https://www.notion.so/my-integrations)
2. 点击 "**New integration**"
3. 填写集成信息:
   - **Name**: 填写 `Fnglish Notebook` 或任意名称
   - **Associated workspace**: 选择你的工作区
   - **Type**: 选择 "Internal integration"
4. 点击 "**Submit**" 创建
5. **复制 Integration Token** (格式: `secret_xxx...`) - 这就是你的 **Notion API Key**

### 步骤 2: 创建并配置 Notion 页面
1. 在 Notion 中创建一个新页面 (用于存储学习数据)
2. 在页面右上角点击 "**Share**"
3. 点击 "**Add people, emails, groups, or integrations**"
4. 搜索并选择你刚创建的 integration (如 "Fnglish Notebook")
5. 选择权限为 "**Can edit**"
6. 点击 "**Invite**"

### 步骤 3: 获取页面 ID
1. 点击页面右上角的 "**Share**" → "**Copy link**"
2. 获取的链接格式如: `https://www.notion.so/workspace/页面标题-32位字符串?xxx`
3. **Page ID 就是 URL 中的后32位字符串**
   
   **例如**:
   ```
   链接: https://www.notion.so/myworkspace/English-Learning-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p?pvs=4
   Page ID: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
   ```

### ⚠️ 重要提醒
- **必须先添加 Integration 到页面**，否则API无法访问页面
- **Page ID 是32位字符串**，不包括 URL 中的其他部分
- **确保 Integration 有编辑权限**，才能创建数据库和添加内容

## 🛠️ Installation

```bash
npm install -g fnglish-notebook
```

## ⚙️ Setup

**重要**: 请先完成上面的 **Notion 集成配置** 步骤，然后再运行应用！

首次运行时，应用会引导你完成配置:

1. **English Level**: 选择你的英文水平
   - `middle_school`: 中学水平 - 基础词汇和简单语法
   - `university`: 大学水平 - 中等词汇和复杂语法结构  
   - `study_abroad`: 留学水平 - 高级词汇，适合学术/专业用途

2. **API Keys 配置**:
   - **Grok API Key**: 从 [Grok Console](https://console.x.ai/) 获取，用于AI单词分析
   - **Notion API Key**: 按照上面步骤1获取的 Integration Token (`secret_xxx...`)
   - **Notion Page ID**: 按照上面步骤3获取的32位页面ID

## 🚀 Usage

### Text Translation
1. Type or paste English text in the input box
2. Press Enter to translate and analyze
3. Vocabulary automatically saved to Notion

### Image Translation  
1. Copy an image containing text to your clipboard
2. Press `Ctrl+V` in the application
3. Image text will be extracted, translated, and analyzed
4. Vocabulary automatically saved to Notion

### Keyboard Shortcuts
- `Ctrl+C`: Exit application
- `Ctrl+V`: Paste and translate image from clipboard
- `Enter`: Submit text for translation

## 📁 Configuration

Configuration is stored in `~/.fnglish-notebook` and includes:
- English proficiency level
- API keys (Grok, Notion)
- Notion page ID

## 🔧 API Integration Details

### Tencent Cloud Translation
- **Text Translation**: Real-time text translation
- **Image Translation**: OCR and translation of images
- **Built-in Configuration**: No additional setup required

### Grok AI
- **Model**: `grok-4-fast-non-reasoning` for fast responses
- **Features**: Word definitions, parts of speech, example sentences
- **Adaptive**: Content difficulty adapted to your English level

### Notion Database
- **Auto-creation**: Creates inline databases automatically
- **Columns**: 单词 (Word), 词性 (Part of Speech), 释义 (Definition), 例句 (Example), 例句翻译 (Example Translation), 创建时间 (Created Time)
- **Smart Deduplication**: Prevents duplicate entries

## 🎯 Learning Levels

- **Middle School (中学水平)**: Age-appropriate vocabulary and basic grammar structures
- **University (大学水平)**: Complex vocabulary and advanced sentence patterns  
- **Study Abroad (留学水平)**: Academic and professional terminology for international students

## 🐛 Troubleshooting

### Common Issues

1. **Image translation not working**:
   - Ensure image is copied to clipboard (not saved file)
   - Try copying the image again
   - Check if image contains clear, readable text

2. **Notion database not saving**:
   - ✅ **检查 Integration 是否已添加到页面**: 最常见问题！必须先按照上面步骤2将integration邀请到页面
   - ✅ **确认 API Key 格式**: 应该是 `secret_` 开头的长字符串
   - ✅ **验证 Page ID**: 必须是32位字符串，从分享链接中提取
   - ✅ **检查权限**: Integration 必须有页面的编辑权限 (Can edit)
   - 错误示例: `Notion API error: Object not found` → 通常是integration未添加到页面

3. **API errors**:
   - Verify all API keys are valid
   - Check internet connection
   - Ensure API quotas are not exceeded

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and enhancement requests.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Tencent Cloud](https://cloud.tencent.com/) for translation services
- [Grok AI](https://grok.com/) for intelligent word analysis  
- [Notion](https://notion.so/) for note-taking integration
- [Ink](https://github.com/vadimdemedes/ink) for beautiful terminal UI

---

**Made with ❤️ for English learners worldwide**