# インフラストラクチャ管理

## CDKデプロイ手順

### 前提条件
- AWS CLI設定済み（`dev`プロファイル）
- Node.js 20以上
- AWS CDK CLI

### デプロイ手順

1. infraディレクトリに移動
```bash
cd infra
```

2. 依存関係をインストール
```bash
npm install
```

3. CDKスタックをデプロイ
```bash
AWS_PROFILE=dev npx cdk deploy --require-approval never
```

### 現在の設定

- **ドメイン**: `tomohiko.io`, `www.tomohiko.io`
- **リダイレクト**: `tomohiko.io` → `www.tomohiko.io` (301)
- **S3バケット**: `www.tomohiko.io`
- **CloudFront**: 両ドメインで同じディストリビューション
- **SSL証明書**: ACMで管理、両ドメイン対応

### 最新の変更

- CloudFront Functionを追加して`tomohiko.io`から`www.tomohiko.io`への301リダイレクトを実装
- SEOの一貫性とリンクエクイティの維持のため

### 注意事項

- 本番環境のため、デプロイ時は十分な注意が必要
- 変更前にステージング環境での確認を推奨