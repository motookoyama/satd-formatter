# .sAtd Formatter - Handover Document (for Cursor AI)

## 🧭 Project Overview

This project is a formatter tool for generating and interpreting the structured knowledge format **".sAtd (Structured Ai Transfer Document)"** that can be understood by both AI and humans.

The formatter scans any application folder (Electron / Web / LLM settings, etc.), and outputs the file structure, code, settings, prompts, history, etc. into a single `.sAtd` file.

## 🎯 Background & Purpose

- The target users are creators (copyright holders) such as manga artists and writers, aiming to enable non-programmers to develop AI applications.
- The `.sAtd` format was born during the development of the Electron-based LLM app "Soulmaster," designed to save and restore documents, structure, and context in a way that AI can reproduce.
- The tool is intended as a "knowledge reproduction device" that allows users to reconstruct app structure, characters, prompts, and history.

## 🔨 Included in this Repository

| File | Description |
|------|-------------|
| `formatter.py` or `formatter.ts` | Main logic for generating `.sAtd` (CLI or Node) |
| `template.sAtd` | Output format template for `.sAtd` (Markdown-based) |
| `gametrigger.txt` | Template for AI execution instructions (story triggers, restrictions, etc.) |
| `gatekeeper.txt` | Access restriction (e.g., passphrase for buyers, QR code integration) |
| `sAtddef.yaml` | Guide for file structure, classification, and settings during expansion |
| `demo_project/` | Sample app folder (input example for formatter) |

## 🔐 Copyright & License

- The format, concept, naming, and style were created by **Motoo Koyama / @nohonx**.
- This tool is released under the **MIT License** and can be freely used, redistributed, and modified. Credit ("Designed by Motoo Koyama / @nohonx") is recommended.

## 💡 Handover Guidelines (for Cursor AI)

- The `.sAtd` format design is complete.
- Future extension tasks include:

| Task | Description |
|------|-------------|
| `formatter` → GUI | GUI version (Electron/Tauri, drag & drop support) |
| `.sAtd Expander` | Tool to expand `.sAtd` into a reconstructable folder |
| Auto-generate `sAtddef.yaml` | Routine to analyze files and generate definition file |
| Character asset integration | Module to extract and list V2card images + JSON |

> *By publishing this handover on GitHub, we hope it will be applied and extended by other AI builders and OSS users.*

## 🌐 Purpose of Publication

- `.sAtd` is an open knowledge compression format, free for anyone to use and expand.
- However, the structure and templates are copyright protected. Please refrain from commercial use or naming that goes against the original intent.

## サンプルファイル配布

`sample_sAtd` フォルダ内に、.sAtd形式のサンプルファイルを同梱しています。
ご自由にダウンロード・ご利用ください。

### サンプルファイル一覧

- UTILITYsAtd/
  - IZAKAYA lite.sAtd
  - Assistant_UTILITY.sAtd
  - Mr.MCP_UTILITY.sAtd
- RPGsAtd/
  - VMC.sAtd
  - AIwhispera.sAtd
  - おざなりダンジョン.sAtd
  - the White House cat.sAtd

---

## Webアプリで試す

このアプリはGoogle Vertex AI Studioで構築され、Cloud Runで公開されています。

🌐 [Webアプリを試す](https://satd-formatterv2-95139013565.us-west1.run.app/)

> ⚠️ 注意：このバージョンは一般公開されています。機密データのアップロードはご遠慮ください。

---

Thank you for continuing the story.
– Initial Creator (Motoo Koyama / @nohonx)
