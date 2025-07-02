# V2allone Hybrid Exporter

## 概要（日本語）
V2alloneは、複数のキャラクタープロンプトやシナリオファイルを1つのハイブリッドテキストファイルにまとめるためのシンプルなPythonツールです。パーティプレイやコラボ用のデータ配布に最適です。

- `originals/` フォルダにキャラクターや公開用データを配置
- `protected/` フォルダにシナリオや保護したいデータを配置
- `python scripts/hybrid_exporter.py` を実行すると `hybrid_output/party_hybrid.txt` が生成されます
- 区切り記法で各ファイル内容が明示されます

### ディレクトリ構成例
```
V2allone/
├── originals/
├── protected/
├── hybrid_output/
└── scripts/
    └── hybrid_exporter.py
```

### 使い方
1. `originals/` と `protected/` にファイルを入れる
2. ターミナルで `python scripts/hybrid_exporter.py` を実行
3. `hybrid_output/party_hybrid.txt` を配布・利用

---

# V2allone Hybrid Exporter

## Overview (English)
V2allone is a simple Python tool to combine multiple character prompts and scenario files into a single hybrid text file. Ideal for party play or collaborative data distribution.

- Place character/public data in the `originals/` folder
- Place scenario/protected data in the `protected/` folder
- Run `python scripts/hybrid_exporter.py` to generate `hybrid_output/party_hybrid.txt`
- Each file's content is clearly separated by delimiters

### Example Directory Structure
```
V2allone/
├── originals/
├── protected/
├── hybrid_output/
└── scripts/
    └── hybrid_exporter.py
```

### Usage
1. Put files into `originals/` and `protected/`
2. Run `python scripts/hybrid_exporter.py` in your terminal
3. Use or distribute `hybrid_output/party_hybrid.txt`

---

## License
MIT License or your preferred license. 