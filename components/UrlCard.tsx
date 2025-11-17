'use client'

import { useEffect } from 'react'

interface UrlCardProps {
  url: string
  type: 'youtube' | 'twitter' | 'nicovideo'
}

export default function UrlCard({ url, type }: UrlCardProps) {
  useEffect(() => {
    // Load Twitter widgets script if needed
    if (type === 'twitter' && !window.twttr) {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [type])

  if (type === 'youtube') {
    const videoId = extractYouTubeId(url)
    if (!videoId) return null

    return (
      <div className="url-card youtube-card">
        <div className="url-card-embed">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          />
        </div>
        <a
          href={url}
          className="url-card-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          YouTubeで見る
        </a>
      </div>
    )
  }

  if (type === 'twitter') {
    return (
      <div className="url-card twitter-card">
        <div className="url-card-embed">
          <blockquote className="twitter-tweet" data-theme="light">
            <a href={url}></a>
          </blockquote>
        </div>
        <a
          href={url}
          className="url-card-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitterで見る
        </a>
      </div>
    )
  }

  if (type === 'nicovideo') {
    const videoId = extractNicovideoId(url)
    if (!videoId) return null

    return (
      <div className="url-card nicovideo-card">
        <div className="url-card-embed">
          <iframe
            src={`https://embed.nicovideo.jp/watch/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Nicovideo player"
          />
        </div>
        <a
          href={url}
          className="url-card-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          ニコニコ動画で見る
        </a>
      </div>
    )
  }

  return null
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

function extractNicovideoId(url: string): string | null {
  const match = url.match(/nicovideo\.jp\/watch\/(sm\d+|so\d+)/)
  return match ? match[1] : null
}

declare global {
  interface Window {
    twttr?: any
  }
}
