# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイドラインです。

## プロジェクト概要

**task-board** は、タスクを管理するためのカンバン風ボード形式の Web アプリケーションです。
ユーザーがタスクを登録し、ステータス（例: 未着手・進行中・完了）ごとに整理・管理できることを目的としています。

## 技術スタック

- React（Vite で構築）
- JavaScript（JSX）
- CSS

## ディレクトリ構成

```
task-board/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx      # タスクボードのメインコンポーネント
│   └── App.css       # スタイルシート
└── CLAUDE.md
```

## 開発方針

- コンポーネントは役割ごとに分割し、状態管理はシンプルな `useState` を基本とする。
- タスクデータはコードから分離しやすい形（配列やオブジェクト）で管理する。
- 動作確認は `npm run dev` で開発サーバーを起動して行う。

## コーディング規約

- インデントはスペース2つを基本とする。
- 変数・関数名はキャメルケース（例: `currentTaskId`）を使用する。
- コメントは「なぜそうしているか」が自明でない箇所にのみ最小限で記載する。
- 不要な抽象化やライブラリ導入は避け、シンプルな実装を優先する。

## Git運用ルール

- **コードを変更するたびに、必ず GitHub にプッシュすること。**
- 変更内容ごとに適切な単位でコミットし、コミットメッセージには変更内容が分かるように簡潔に記載する。
- 作業の流れ：
  1. コードを変更する
  2. `git add` で変更をステージングする
  3. `git commit` で変更をコミットする
  4. `git push` で GitHub リポジトリに反映する
- ローカルに変更を残したままにせず、都度リモートリポジトリへ同期する。

## デプロイ（GitHub Pages）

- `main` ブランチへの push をトリガーに `.github/workflows/deploy.yml` が自動ビルド・デプロイを行う。
- `vite.config.js` の `base` はリポジトリ名 `/task-board/` に固定している（GitHub Pages のプロジェクトサイトはサブパス配信のため）。
- 公開URL: https://Tack0327.github.io/task-board/
- リポジトリ設定 → Pages → Source を「GitHub Actions」にしておく必要がある（初回のみ）。

## 回答言語

このプロジェクトに関するやり取りでは、**必ず日本語で回答すること**。

## GitHubリポジトリ

https://github.com/Tack0327/task-board.git
