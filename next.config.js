/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静的サイト生成（GitHub Pages対応）
  basePath: process.env.NODE_ENV === 'production' ? '/KumoCode' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/KumoCode' : '',
  images: {
    unoptimized: true, // GitHub Pagesでは画像最適化が使えない
  },
  eslint: {
    ignoreDuringBuilds: true, // ビルド時のESLintエラーを無視
  },
  typescript: {
    ignoreBuildErrors: true, // ビルド時のTypeScriptエラーを無視
  },
  // Note: 静的エクスポート時、ブラウザコンソールに以下のエラーが表示される場合がありますが、
  // これは正常な動作です（機能には影響しません）:
  // - "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT" (広告ブロッカーによるブロック)
  // - "GET /KumoCode.txt?_rsc=xxx 404" (Next.js App RouterのRSCプリフェッチ)
}

module.exports = nextConfig
