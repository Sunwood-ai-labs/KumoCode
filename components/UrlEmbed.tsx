'use client'

import React, { useEffect } from 'react'

interface UrlEmbedProps {
  children: React.ReactNode
}

// Twitter/Xスクリプトの読み込み管理
let twitterScriptLoaded = false
let twitterScriptLoading = false

const loadTwitterScript = () => {
  if (twitterScriptLoaded || twitterScriptLoading) return

  twitterScriptLoading = true
  const script = document.createElement('script')
  script.src = 'https://platform.twitter.com/widgets.js'
  script.async = true
  script.charset = 'utf-8'
  script.onload = () => {
    twitterScriptLoaded = true
    twitterScriptLoading = false
  }
  document.body.appendChild(script)
}

const UrlEmbed: React.FC<UrlEmbedProps> = ({ children }) => {
  // テキストノードからURLを抽出
  const extractUrl = (node: React.ReactNode): string | null => {
    if (typeof node === 'string') {
      const trimmed = node.trim()
      // URLパターンにマッチするかチェック
      if (trimmed.match(/^https?:\/\//)) {
        return trimmed
      }
    }
    return null
  }

  const url = extractUrl(children)

  useEffect(() => {
    // Twitter埋め込みがある場合にスクリプトを読み込む
    if (url && url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/\d+/)) {
      loadTwitterScript()

      // ウィジェットを再レンダリング
      const timer = setTimeout(() => {
        if (window.twttr && window.twttr.widgets) {
          window.twttr.widgets.load()
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [url])

  if (!url) {
    return <p>{children}</p>
  }

  // YouTube埋め込み
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (youtubeMatch) {
    const videoId = youtubeMatch[1]
    return (
      <div className="url-card youtube-card">
        <div className="url-card-embed">
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="url-card-link"
        >
          YouTubeで見る
        </a>
      </div>
    )
  }

  // ニコニコ動画埋め込み
  const nicovideoMatch = url.match(/nicovideo\.jp\/watch\/((?:sm|so)\d+)/)
  if (nicovideoMatch) {
    const videoId = nicovideoMatch[1]
    return (
      <div className="url-card nicovideo-card">
        <div className="url-card-embed">
          <iframe
            src={`https://embed.nicovideo.jp/watch/${videoId}`}
            title="Nicovideo player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="url-card-link"
        >
          ニコニコ動画で見る
        </a>
      </div>
    )
  }

  // Twitter/X埋め込み
  const twitterMatch = url.match(/(?:twitter\.com|x\.com)\/(\w+)\/status\/(\d+)/)
  if (twitterMatch) {
    const [, username, tweetId] = twitterMatch

    return (
      <>
        <blockquote className="twitter-tweet" data-theme="light">
          <a href={`https://twitter.com/${username}/status/${tweetId}?ref_src=twsrc%5Etfw`}>
            ツイートを読み込み中...
          </a>
        </blockquote>
      </>
    )
  }

  // マッチしない場合は通常の段落として表示
  return <p>{children}</p>
}

// TypeScript declarations
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void
      }
    }
  }
}

export default UrlEmbed
