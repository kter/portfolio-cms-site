# 高橋智彦のポートフォリオサイト

魚とお茶と富士山と車と新しいもの好きエンジニアのポートフォリオサイトです。

## 技術スタック

- **フロントエンド**: Nuxt.js 3 (SPA)
- **スタイリング**: TailwindCSS v3
- **インフラ**: AWS (S3 + CloudFront + Route53)
- **IaC**: AWS CDK (TypeScript)
- **CI/CD**: GitHub Actions (OIDC認証)

## 開発環境のセットアップ

### 必要な環境
- Node.js 18以上
- npm

### インストール
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

### 静的サイトの生成
```bash
npm run generate
```

生成された静的ファイルは `dist/public/` ディレクトリに出力されます。

## AWS インフラのデプロイ

### 前提条件
- AWS CLI がインストールされ、設定済みであること
- AWS CDK CLI がインストールされていること (`npm install -g aws-cdk`)
- tomohiko.io のRoute53ホストゾーンが存在すること

### インフラのデプロイ手順

1. **CDKディレクトリに移動**
   ```bash
   cd infra
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **CDKのブートストラップ（初回のみ）**
   ```bash
   npx aws-cdk bootstrap --region us-east-1
   ```

4. **インフラのデプロイ**
   ```bash
   npx aws-cdk deploy --require-approval never
   ```

デプロイされるリソース：
- S3バケット（www.tomohiko.io）
- CloudFront ディストリビューション
- SSL証明書（AWS Certificate Manager）
- Route53 Aレコード（www.tomohiko.io, tomohiko.io）
- GitHub Actions用OIDCプロバイダーとIAMロール

## CI/CD セットアップ

### セキュアな認証方式
このプロジェクトではGitHub ActionsのOIDC（OpenID Connect）を使用してAWSリソースにアクセスします。IAMアクセスキーは不要で、よりセキュアです。

### GitHub Variablesの設定

リポジトリの Settings > Secrets and variables > Actions > Variables で以下のVariableを設定してください：

- `AWS_ROLE_ARN`: CDKデプロイ後に出力されるGitHub Actions用IAMロールのARN

### IAMロールARNの取得方法

CDKデプロイ後、以下のコマンドでロールARNを取得できます：

```bash
cd infra
aws cloudformation describe-stacks --stack-name PortfolioSiteStack --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleArn`].OutputValue' --output text
```

出力例:
```
arn:aws:iam::848738341109:role/PortfolioSiteGitHubActionsRole
```

### GitHubリポジトリ設定の確認

CDKスタックでは以下のリポジトリを想定しています：
- **リポジトリ**: `kter/portfolio-cms-site`
- **ブランチ**: `main`

異なるリポジトリ名を使用する場合は、`infra/lib/infra-stack.ts` の以下の部分を修正してください：

```typescript
StringLike: {
  'token.actions.githubusercontent.com:sub': 'repo:YOUR_USERNAME/YOUR_REPO_NAME:ref:refs/heads/main',
},
```

### 自動デプロイ

`main` ブランチにプッシュすると、GitHub Actionsが自動的に：

1. Nuxtアプリケーションをビルド
2. 静的ファイルをS3にアップロード
3. CloudFrontのキャッシュを無効化

## セキュリティ機能

- **OIDC認証**: IAMアクセスキー不要のセキュアな認証
- **最小権限の原則**: GitHub Actionsロールには必要最小限の権限のみ付与
- **CloudFront OAC**: S3バケットへの直接アクセスを防止
- **HTTPS強制**: すべてのトラフィックをHTTPSにリダイレクト

## サイト構成

### セクション
- **Hero**: プロフィール情報とギャラリー画像のスライドショー
- **Work Experience**: 技術経験年数
- **Links**: 各種SNS・技術サイトへのリンク
- **自作サービス**: 開発したアプリケーション
- **Certifications**: 国家資格とAWS認定資格（14資格）
- **Contact**: 連絡先情報

### 特徴
- レスポンシブデザイン
- AWS認定資格ロゴの表示
- 自動画像スライドショー
- モダンなUI/UX

## トラブルシューティング

### OIDCエラーの場合
1. GitHubリポジトリ名がCDKスタックの設定と一致しているか確認
2. `main` ブランチからのプッシュか確認
3. IAMロールARNが正しく設定されているか確認
4. GitHub VariablesにAWS_ROLE_ARNが設定されているか確認

### CloudFormationスタックエラーの場合
1. us-east-1 リージョンでデプロイしているか確認
2. tomohiko.io のホストゾーンが存在するか確認
3. 既存のS3バケットが削除されているか確認

## ライセンス

このプロジェクトは個人のポートフォリオサイトです。

---

© 2025 高橋智彦 (Takahashi Tomohiko)
