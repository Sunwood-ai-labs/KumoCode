/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静的サイト生成（GitHub Pages対応）
  basePath: process.env.NODE_ENV === 'production' ? '/KumoCode' : '',
  images: {
    unoptimized: true, // GitHub Pagesでは画像最適化が使えない
  },
  eslint: {
    ignoreDuringBuilds: true, // ビルド時のESLintエラーを無視
  },
  typescript: {
    ignoreBuildErrors: true, // ビルド時のTypeScriptエラーを無視
  },
}

module.exports = nextConfig
