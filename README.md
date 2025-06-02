# 高橋智彦のポートフォリオサイト

魚とお茶と富士山と車と新しいもの好きエンジニアのポートフォリオサイトです。

## 技術スタック

- **Nuxt.js 3** - Vue.js ベースのフレームワーク（SPAモード）
- **TailwindCSS** - ユーティリティファーストのCSSフレームワーク
- **TypeScript** - 型安全な開発

## 機能

- レスポンシブデザイン
- モダンなUI/UX
- SEO最適化
- 高速なページ読み込み

## セットアップ

### 必要なもの

- Node.js (v18以上)
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### ビルド

```bash
# 本番用ビルド
npm run build

# ビルドしたアプリケーションをプレビュー
npm run preview
```

## コンテンツ

- **Work Experience** - AWS/Linux インフラエンジニア、Ruby on Rails、JavaScript/PHP の経験
- **Links** - Qiita、GitHub、SlideShare、LinkedIn、Blog へのリンク
- **自作サービス** - AWS アイコンクイズ、一日一善、ｼﾝｶﾝｾﾝｽｺﾞｸｶﾀｲｱｲｽbot
- **Certifications** - 基本情報技術者、応用情報技術者、AWS認定資格
- **Contact** - メールアドレス、Twitter

## デプロイ

このプロジェクトはSPAモードで設定されているため、静的ホスティングサービス（Netlify、Vercel、GitHub Pages等）で簡単にデプロイできます。

```bash
npm run generate
```

`dist/` フォルダの内容をホスティングサービスにアップロードしてください。

## カスタマイズ

- `pages/index.vue` - メインページのコンテンツ
- `assets/css/main.css` - カスタムスタイル
- `nuxt.config.ts` - Nuxt.js の設定

## ライセンス

MIT License
