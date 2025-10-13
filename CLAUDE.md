# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fnglish Notebook is a CLI tool for English learning with integrated translation services and Notion database management. It provides real-time translation using Tencent Cloud API, generates word information using Grok AI, and automatically saves learning progress to Notion databases.

## Development Commands

- **Start the application**: `npm start` - Runs the application in development mode
- **Build the project**: `npm run build` - Builds TypeScript files for production
- **Watch mode**: `npm run dev` - Runs in watch mode for development
- **Install globally**: `npm install -g .` - Installs as global CLI tool

## CLI Usage

After installation, the application can be launched using:
- `fnglish-notebook` - Full command
- `fnb` - Short alias

## Architecture

### Core Structure
- **Entry point**: `src/index.ts` - Main application entry with React rendering
- **CLI entry**: `src/cli.ts` - Command line interface entry point
- **App component**: `src/components/App.tsx` - Root React component with config management

### Services Layer
- **Config Management** (`src/services/config.ts`): Handles `.fnglish-notebook` config file in user home directory
- **Tencent Translation** (`src/services/tencent.ts`): Text and image translation via Tencent Cloud API
- **Grok AI** (`src/services/grok.ts`): Word definition and example generation
- **Notion Integration** (`src/services/notion.ts`): Database creation and word entry management

### UI Components
- **Setup Flow** (`src/components/Setup.tsx`): First-time configuration wizard
- **Main Screen** (`src/components/MainScreen.tsx`): Primary translation interface
- **Logo** (`src/components/Logo.tsx`): ASCII art branding

### Utilities
- **Types** (`src/utils/types.ts`): TypeScript interfaces and type definitions
- **Clipboard** (`src/utils/clipboard.ts`): Image detection and base64 conversion

## Configuration

The application creates a `.fnglish-notebook` config file in the user's home directory containing:
- English proficiency level (middle_school/university/study_abroad)
- API keys for Grok and Notion
- Notion page ID and database preferences

Tencent Cloud translation credentials are built into the application and don't require user configuration.

## Interface Improvements

Recent updates include:
- **Claude Code-style input boxes**: Clean single-line borders with arrow indicators
- **Compact layout**: Removed unnecessary spacing and margins
- **Simplified status messages**: "保存成功" instead of verbose notifications
- **Hidden elements**: English level no longer displayed on main screen
- **Organized database**: Notion columns in order: 单词, 词性, 释义, 例句, 例句翻译, 创建时间
- **Enhanced examples**: Each example sentence now includes Chinese translation
- **Clean terminal**: Grok-generated content is saved to Notion but not displayed in terminal
- **Image paste support**: Press Ctrl+V to paste images directly from clipboard

## English Proficiency Levels

The application supports three English proficiency levels:
- **middle_school** (中学水平): Covers both middle school and high school levels with age-appropriate vocabulary and grammar
- **university** (大学水平): University-level English with more complex vocabulary and sentence structures  
- **study_abroad** (留学水平): Advanced English suitable for studying abroad, including academic and professional contexts

## Key Features

1. **Multi-level English Learning**: Adapts content complexity based on user's English level
2. **Real-time Translation**: Supports both text input and clipboard image translation
3. **Inline Database Management**: Creates and manages inline Notion databases for organized word storage
4. **Clipboard Integration**: Detects and translates images copied to clipboard
5. **Smart Word Processing**: Uses fast AI model for quick definitions, parts of speech, and examples
6. **Clean Terminal UI**: Simple rainbow animated logo and intuitive interface design

## API Integrations

- **Tencent Cloud Translation**: Text and image translation services (built-in configuration)
- **Grok AI**: Natural language processing using `grok-4-fast-non-reasoning` model for fast content generation
- **Notion API**: Inline database creation and content management

## Tech Stack

- React 19.2.0 with Ink 6.3.1 for terminal UI
- TypeScript with tsx for execution
- ES modules architecture
- Node.js 18+ compatibility