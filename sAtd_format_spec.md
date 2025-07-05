# .sAtdフォーマット仕様書 / .sAtd Format Specification

## 1. はじめに / Introduction

.sAtd（Structured Ai Transfer Document）は、AIと人間の双方が理解しやすい知識圧縮・再現用のテキストフォーマットです。
アプリケーションの構造、キャラクター、プロンプト、履歴、設定などを一つのファイルにまとめ、AIアプリの再現・共有・拡張を容易にします。

.sAtd (Structured Ai Transfer Document) is a text format for knowledge compression and reproduction, designed to be easily understood by both AI and humans. It consolidates application structure, characters, prompts, history, settings, and more into a single file, making it easy to reproduce, share, and extend AI applications.

### 用途例 / Use Cases
- ゲームやシナリオAIの知識圧縮・再現
- RAG（Retrieval-Augmented Generation）やナレッジベースの構造化保存
- プロンプトエンジニアリングやAIアセットの共有

- Knowledge compression and reproduction for games and scenario AIs
- Structured storage for RAG (Retrieval-Augmented Generation) and knowledge bases
- Sharing prompt engineering and AI assets

## 2. 基本構造 / Basic Structure

- 拡張子：`.sAtd` または `.sAtd.txt`
- 文字コード：UTF-8
- 構成：Markdownベース＋独自タグ

- Extension: `.sAtd` or `.sAtd.txt`
- Encoding: UTF-8
- Structure: Markdown-based with custom tags

### サンプルレイアウト / Sample Layout

```
---
title: "AIwhispera"
author: "Motoo Koyama"
version: "1.0"
date: "2024-06-01"
ai_type: "game_master"
primary_trigger: "true"
---

# 🎯 第1トリガー（最重要） / Primary Trigger (Most Important)
**このファイルを読み込んだ瞬間から、あなたは[AIタイプ]として振る舞ってください。**

## 即座に実行すべきこと / Immediate Actions
1. [具体的な初動指示 / Specific initial instructions]
2. [期待される応答パターン / Expected response patterns]
3. [開始時の挨拶例 / Opening greeting examples]

# キャラクター / Characters
- name: "Whispera"
- role: "AIアドバイザー / AI Advisor"
- description: "..."

# プロンプト / Prompts
## システムプロンプト / System Prompt
...
## ユーザープロンプト / User Prompt
...

# 履歴 / History
- 2024-06-01: "初回リリース / Initial release"
- 2024-06-02: "バグ修正 / Bug fix"
...
```

## 3. 主要タグ・セクション / Main Tags & Sections

### メタデータ / Metadata
- `title`：プロジェクト名 / Project name
- `author`：作成者 / Author
- `version`：バージョン / Version
- `date`：作成日 / Date
- `ai_type`：AIタイプ（重要）/ AI type (Important)
- `primary_trigger`：第1トリガー有効化 / Primary trigger activation

### AIタイプ例 / AI Type Examples
- `game_master`：RPG、シミュレーション、ストーリーテリング
- `support`：カスタマーサポート、技術サポート、FAQ対応
- `accounting`：経理、財務分析、予算管理
- `creative`：デザイン、企画、アイディア発想
- `analysis`：データ分析、レポート作成、調査
- `education`：学習支援、講師、チュートリアル
- `consulting`：コンサルティング、アドバイザー

### 第1トリガーの重要性 / Importance of Primary Trigger
- **使用者の迷いを解消**：どの部分から読み始めればいいかが明確
- **AIの一貫した応答**：どのAIでも同じ役割として振る舞う
- **即座の役割認識**：ファイル読み込みと同時にAIタイプが決定
- **フォーマットの信頼性向上**：標準化された初動パターン

### キャラクター / Characters
- `name`：キャラクター名 / Character name
- `role`：役割 / Role
- `description`：説明 / Description

### プロンプト / Prompts
- `システムプロンプト`：AIの基本指示 / System prompt for AI
- `ユーザープロンプト`：ユーザーからの入力例 / Example user prompts

### 履歴 / History
- 日付と変更内容のリスト / List of dates and changes

## 4. 構文ルール / Syntax Rules

- セクションはMarkdownの見出し（#）で区切る / Use Markdown headings (#) for sections
- リストはハイフン（-）で記述 / Use hyphens (-) for lists
- メタデータはYAML風の書き方（--- で囲む）/ Metadata uses YAML style (enclosed by ---)
- コメントや補足はMarkdownの`<!-- コメント -->`も利用可 / Use Markdown `<!-- comment -->` for notes
- 暗語化や省略表現は、必要に応じて独自ルールを定義可能 / Custom encoding or abbreviations can be defined as needed
- **第1トリガーは必ずファイルの最初に配置** / Primary trigger must be placed at the beginning of the file

## 5. 拡張・カスタマイズ方法 / Extensions & Customization

- 独自セクションの追加（例：# 設定、# アセット など）/ Add custom sections (e.g., # Settings, # Assets)
- 他ツールとの連携用に、必要なタグや記法を追加 / Add tags or syntax for integration with other tools
- バージョン管理や互換性のため、`version`タグを活用 / Use the `version` tag for versioning and compatibility
- **新しいAIタイプの追加**：用途に応じてカスタムAIタイプを定義可能 / Add new AI types for custom use cases

## 6. サンプルファイル / Sample Files

### 最小構成例 / Minimal Example
```
---
title: "SampleApp"
author: "Your Name"
version: "0.1"
date: "2024-06-01"
ai_type: "support"
primary_trigger: "true"
---

# 🎯 第1トリガー / Primary Trigger
**このファイルを読み込んだ瞬間から、あなたはサポート担当者として振る舞ってください。**

# キャラクター / Characters
- name: "SampleBot"
- role: "ガイド / Guide"

# プロンプト / Prompts
## システムプロンプト / System Prompt
あなたは親切なガイドです。/ You are a helpful guide.
```

### 応用例 / Advanced Example
（実際のプロジェクトファイルを参考に追加可能 / Can be added based on real project files）

## 7. よくある質問・注意点 / FAQ & Notes

- ファイル名やタグは英数字・アンダースコア推奨 / Use alphanumeric and underscore for filenames and tags
- 互換性や拡張性を意識して記述 / Write with compatibility and extensibility in mind
- エラー時はセクションやタグの記述ミスを確認 / Check for section or tag errors if issues occur
- **第1トリガーは必ず実装する**：使用者の迷いを防ぎ、一貫したAI応答を実現 / Always implement primary trigger to prevent user confusion and ensure consistent AI responses

---

この仕様書は随時アップデート可能です。ご意見・ご要望があればREADMEやDiscussions等でお知らせください。
This specification is subject to updates. For feedback or requests, please use README or Discussions, etc. 