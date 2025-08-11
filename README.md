# 体重・体脂肪率トラッカー

体重と体脂肪率を記録・追跡するためのブラウザーアプリケーションです。

## セットアップ

### 1. 依存関係のインストール

```bash
bun install
```

### 2. アプリケーションの起動

```bash
bun run dev
```

### 3. データベースの設定

1. ブラウザでアクセス
2. 「Database Configuration」リンクをクリック（または `/config` にアクセス）
3. 以下の情報を入力：
   - **Database URL**: Tursoデータベースの URL（例: `http://localhost:10801`）
   - **Auth Token**: リモートTursoの場合は認証トークン（ローカルの場合は空欄でOK）
4. 「Save Configuration & Initialize Tables」をクリック

設定を保存すると、アプリケーションが自動的に：
- データベース接続をテスト
- 必要なテーブル（`weight_records`）を作成
- インデックスを作成

### 本番環境

```bash
# 本番用ビルド
bun run build

# 本番サーバー起動
bun run start
```

## 開発コマンド

```bash
# TypeScriptの型チェック
bun run typecheck

# リンティングとフォーマット修正（必須）
bun run check:fix

# リンティングのみ
bun run lint

# フォーマット確認のみ  
bun run format
```

## 機能

- 日別の体重・体脂肪率記録
- 月別カレンダービューでのデータ入力
- カスタム期間でのグラフ表示
- データのエクスポート/インポート機能

## ページ構成

- `/` - ホームページ（ナビゲーション）
- `/monthly` - 月選択画面
- `/monthly/:year/:month` - 月別詳細ビュー（インライン編集・グラフ）
- `/graph` - グラフ表示（期間フィルタリング対応）
- `/export-import` - データエクスポート/インポート

## データベース
 
- **テーブル**: `weight_records`
- **スキーマ詳細**: `TURSO_TABLES.md`を参照
