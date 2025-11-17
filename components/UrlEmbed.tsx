'use client'

import React from 'react'

interface UrlEmbedProps {
  children: React.ReactNode
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
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
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
            src={`https://embed.nicovideo.jp/watch/${videoId}?persistence=1`}
            allow="autoplay; encrypted-media"
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
      <div className="url-card twitter-card">
        <div className="url-card-embed">
          <blockquote className="twitter-tweet">
            <a href={`https://twitter.com/${username}/status/${tweetId}`}>
              ツイートを読み込み中...
            </a>
          </blockquote>
        </div>
        <a
          href={`https://twitter.com/${username}/status/${tweetId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="url-card-link"
        >
          Twitter/Xで見る
        </a>
      </div>
    )
  }

  // マッチしない場合は通常の段落として表示
  return <p>{children}</p>
}

export default UrlEmbed
