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
- **Notion Integration & Page Setup** (detailed steps below)

## 🌍 Platform Support

✅ **Windows**: PowerShell support (Windows 7+)  
✅ **macOS**: Native AppleScript support  
✅ **Linux**: Requires `xclip` installation (Ubuntu: `sudo apt install xclip`)

## 🔧 Notion Integration Setup (Important!)

### Step 1: Create Notion Integration
1. Visit [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "**New integration**"
3. Fill in the integration details:
   - **Name**: Enter `Fnglish Notebook` or any name you prefer
   - **Associated workspace**: Select your workspace
   - **Type**: Choose "Internal integration"
4. Click "**Submit**" to create
5. **Copy the Integration Token** (format: `secret_xxx...`) - this is your **Notion API Key**

### Step 2: Create and Configure Notion Page
1. Create a new page in Notion (for storing learning data)
2. Click "**Share**" in the top-right corner of the page
3. Click "**Add people, emails, groups, or integrations**"
4. Search and select the integration you just created (e.g., "Fnglish Notebook")
5. Set permissions to "**Can edit**"
6. Click "**Invite**"

### Step 3: Get Page ID
1. Click "**Share**" in the top-right corner → "**Copy link**"
2. The link format looks like: `https://www.notion.so/workspace/page-title-32-character-string?xxx`
3. **The Page ID is the 32-character string in the URL**
   
   **Example**:
   ```
   Link: https://www.notion.so/myworkspace/English-Learning-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p?pvs=4
   Page ID: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
   ```

### ⚠️ Important Reminders
- **You must add the Integration to the page first**, otherwise the API cannot access the page
- **Page ID is a 32-character string**, excluding other parts in the URL
- **Ensure the Integration has edit permissions** to create databases and add content

## 🛠️ Installation

```bash
npm install -g fnglish-notebook
```

## ⚙️ Setup

**Important**: Please complete the **Notion Integration Setup** steps above before running the application!

On first run, the app will guide you through the configuration:

1. **English Level**: Choose your English proficiency level
   - `middle_school`: Middle school level - Basic vocabulary and simple grammar
   - `university`: University level - Intermediate vocabulary and complex grammar structures  
   - `study_abroad`: Study abroad level - Advanced vocabulary for academic/professional use

2. **API Keys Configuration**:
   - **Grok API Key**: Get from [Grok Console](https://console.x.ai/) for AI word analysis
   - **Notion API Key**: Integration Token from Step 1 above (`secret_xxx...`)
   - **Notion Page ID**: 32-character page ID from Step 3 above

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
- **Columns**: Word, Part of Speech, Definition, Example, Example Translation, Created Time
- **Smart Deduplication**: Prevents duplicate entries

## 🎯 Learning Levels

- **Middle School**: Age-appropriate vocabulary and basic grammar structures
- **University**: Complex vocabulary and advanced sentence patterns  
- **Study Abroad**: Academic and professional terminology for international students

## 🐛 Troubleshooting

### Common Issues

1. **Image translation not working**:
   - Ensure image is copied to clipboard (not saved file)
   - Try copying the image again
   - Check if image contains clear, readable text

2. **Notion database not saving**:
   - ✅ **Check if Integration is added to page**: Most common issue! Must follow Step 2 above to invite integration to page
   - ✅ **Verify API Key format**: Should be a long string starting with `secret_`
   - ✅ **Validate Page ID**: Must be a 32-character string extracted from the share link
   - ✅ **Check permissions**: Integration must have edit permissions (Can edit) for the page
   - Error example: `Notion API error: Object not found` → Usually means integration not added to page

3. **API errors**:
   - Verify all API keys are valid
   - Check internet connection
   - Ensure API quotas are not exceeded

4. **Platform-specific issues**:
   - **Windows**: 
     - Ensure PowerShell is available (pre-installed on Windows 7+)
     - If image paste fails, try running terminal as administrator
     - Encountering `clipboard-files` errors? Check [Windows Fix Guide](./WINDOWS-FIX.md)
   - **Linux**: 
     - Image paste requires xclip installation: `sudo apt install xclip`
     - May need additional configuration on Wayland desktop environments
   - **macOS**: 
     - System will request accessibility permissions, please allow terminal access

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