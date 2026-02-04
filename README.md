# Coding Boilerplate (npm only)

npmのみで動作する、静的コーディング用ボイラープレートです。
開発時はHTMLタグベースのインクルード機能が使え、ビルド後は `.php` ファイルとして出力されます。

## 前提条件
- Node.js (v18以上推奨) がインストールされていること。

## ディレクトリ構成

```
project-root/
├── src/                # 開発ディレクトリ
│   ├── assets/
│   │   ├── scss/       # SCSS (foundation, layout, project, components)
│   │   └── js/         # JavaScript
│   ├── components/     # 共通パーツ (<include>用)
│   ├── config/         # 設定ファイル (meta.json)
│   ├── contact/        # お問い合わせページ
│   ├── news/           # お知らせページ
│   └── index.html      # トップページ
├── static/             # 静的素材 (favicon, imagesなど)
└── public/             # 【自動生成】納品用ディレクトリ (ビルド時に生成)
```

## インストール

```bash
npm install
```

## 開発コマンド

### ローカルサーバー起動 (開発中)
```bash
npm run dev
```
- `http://localhost:3000` でプレビューできます。
- `<include src="...">` タグは自動的に結合されて表示されます。
- SCSSやJSの変更はリアルタイムに反映されます。

### ビルド (納品用出力)
```bash
npm run build
```
- `src` 内のファイルがコンパイルされ、`public` ディレクトリに出力されます。
- `.html` ファイルは自動的に `.php` にリネームされます。
- `static` ディレクトリの中身が `public` にコピーされます。
- 画像ファイルは自動的に圧縮・最適化されます。

## 機能・使い方

### HTMLインクルード

PHPのincludeのように、外部ファイルを読み込むことができます。
タグは入れ子（再帰）呼び出しに対応しています。

```html
<!-- src/index.html -->
<include src="./components/header.html"></include>
```

- パスは **現在編集しているファイルからの相対パス** で記述してください。
- ビルド時には `<?php include '...'; ?>` に変換されます。

### メタデータ管理

`src/config/meta.json` でサイト全体のメタデータと各ページのメタデータを管理できます。
HTML内（通常は `<include src="./components/head.html">` 内）に `{{ title }}`, `{{ description }}` と記述すると、自動的に置換されます。

**設定ファイル (`src/config/meta.json`):**
```json
{
    "global": {
        "title": "サイトタイトル",
        "separator": " | "
    },
    "pages": {
        "/index.html": { "title": "トップページ" }
    }
}
```

- **自動タイトルの生成**: `ページタイトル | サイトタイトル` の形式で自動的に結合されます。
- **開発時**: HTMLに直接値が埋め込まれます。
- **ビルド時**: PHP変数 (`$page_title`, `$page_description`) として出力され、フォールバック機構付きの `echo` 文になります。

### その他の自動処理

- **リンク書き換え**: `href` や `src` 内の `.html` リンクは、ビルド時に自動的に `.php` に書き換えられます。
- **画像最適化**: ビルド時に画像ファイル (png, jpeg, webp, svg) が自動的に圧縮されます。

## 注意点
- **`public` フォルダは編集しないでください**。ビルドのたびに削除・再生成されます。
- 必ず `src` フォルダ内で作業を行ってください。
