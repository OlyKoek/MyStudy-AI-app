# Projects

## AI Multimodal Image Search App（開発中）

テキストまたは画像を入力すると、類似画像を検索できるアプリです。

### 🎯 プロジェクト概要
AI技術を活用したマルチモーダル画像検索アプリケーションです。自然言語テキストまたは画像をクエリとして、データベース内の類似画像を検索できます。

### 🛠️ 技術スタック

#### Backend
- **Framework**: FastAPI
- **Language**: Python
- **AI Model**: MINI CLIP (MobileNetV3 + Multilingual BERT)
- **Text Encoder**: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`
- **Image Encoder**: MobileNetV3-Small with custom projection head
- **Embedding Dimension**: 256
- **Acceleration**: CUDA GPU support

#### Frontend
- **Framework**: Next.js 15.5.4
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Image Optimization**: Next.js Image component

#### Infrastructure
- **Containerization**: Docker / docker-compose
- **Vector Database**: In-memory vector store (1000 items)
- **Static File Serving**: FastAPI StaticFiles

### ✨ 主な機能

1. **Text-to-Image Search**
   - 自然言語クエリで画像検索
   - 多言語対応（日本語・英語など）
   - コサイン類似度によるランキング

2. **Image-to-Image Search**
   - 画像アップロードによる類似画像検索
   - Drag & Drop対応
   - リアルタイムプレビュー

3. **Modern UI/UX**
   - レスポンシブデザイン
   - グラデーションベースのモダンなデザイン
   - 類似度スコアの可視化
   - スムーズなアニメーション

### 🏗️ アーキテクチャ設計

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  Next.js    │ ──HTTP─→│   FastAPI    │ ──Load─→│   Models    │
│  Frontend   │←─JSON───│   Backend    │         │  & Vectors  │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              ├─ Text Encoder (BERT)
                              ├─ Image Encoder (MobileNetV3)
                              └─ Vector Database (JSON)
```

### 📊 パフォーマンス
- **検索速度**: ~100ms（1000件のベクトルDB）
- **モデルサイズ**: 
  - Text Projector: ~1MB
  - Image Projector: ~5MB
- **埋め込み次元**: 256次元（軽量化）

### 🎓 学習ポイント

#### AIモデリング
- CLIPアーキテクチャの理解と実装
- マルチモーダル埋め込みの作成
- コサイン類似度による検索

#### Web開発
- FastAPI でのREST API設計
- Next.js 15 App Routerの活用
- Docker Composeによるマルチコンテナ構成

#### DevOps
- Dockerfileの最適化
- GPU対応コンテナの構築
- ホットリロード環境の構築

### 🔄 今後の改善予定
- [ ] ベクトルDBのスケーラビリティ向上（Pinecone/Weaviate導入検討）
- [ ] 画像アップロード機能の強化
- [ ] キャッシング機構の実装
- [ ] AWSへのデプロイ
- [ ] モデルのファインチューニング

### 📂 GitHub
[https://github.com/OlyKoek/Udemy-AIperfectMaster-colabo/tree/main/integ-app](https://github.com/OlyKoek/Udemy-AIperfectMaster-colabo/tree/main/integ-app)

### 🚀 デモ（ローカル環境）
```bash
cd integ-app
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

---

## その他のプロジェクト
今後、新しいプロジェクトを追加予定です。