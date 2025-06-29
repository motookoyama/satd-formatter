meta:
  name: IZAKAYA lite
  version: 1.0
  author: "こやま基夫 / @nohonx"
  license: MIT
  description: |
    .sAtd形式で記述されたV2カードを軽量UIで読み込み、
    任意のLLM（API指定）と連携してチャット起動できるフロントエンド。
    ローカル実行にも対応可能。V2カードの構造を忠実に反映。
  tags:
    - v2card
    - LLM-ready
    - frontend
    - chatUI
    - local-LLM-compatible

frontend:
  type: "lite_web"
  tech_stack:
    - Vite
    - React
    - TailwindCSS
  runtime: "Browser / Local (localhost)"
  behavior:
    - 読み込んだV2カードの画像とJSONをパースし、カード表示UIに変換。
    - ユーザーが選択・起動できるキャラチャットUIを生成。
    - APIまたはローカルLLMを選択し、選択したキャラとチャット可能。

V2Card_support:
  input_formats:
    - v2card.png（base64埋込JSON対応）
    - v2card.json（外部JSON参照も可能）
  features:
    - 内蔵キャラ名/性格/起動プロンプトを読み取り、LLM入力プロンプトを動的生成
    - 複数カード読み込み対応
    - カードギャラリー表示機能（任意）

llm_options:
  mode: selectable
  supported:
    - OpenAI ChatGPT API
    - Gemini Pro (via Google API)
    - Ollama local model (Gemma / Mistral / LLaMA2)
    - LM Studio local
  prompt_adapter:
    type: "dynamic"
    behavior: "V2カード内プロンプトを起動用プロンプトに変換・送信"

options:
  theme:
    - "ネオンサイバー"
    - "浮世絵パターン"
    - "黒背景・緑文字（レトロCLI風）"
  response_log: true
  export_log: "markdown / txt"
  user_input_mod: "ON (会話追加可能)"

instructions:
  usage:
    - Step1: V2カード（PNGまたはJSON）をアップロード
    - Step2: 表示されたカードからキャラクターを選択
    - Step3: 任意のLLMを選択してチャット開始
    - Step4: 会話ログを保存・共有

notes:
  - 本構成は軽量構築が可能で、Replit, GoogleAIStudio, Cursor, ローカルWebサーバ等に対応。
  - 本プロンプトに従い構築AIに投げることで即時環境生成が期待できる。
  - Chat開始時は `.sAtd` を「読んだAI」が即座にキャラを立ち上げられるよう設計済。