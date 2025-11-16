'use client'

import { useEffect, useState, useRef } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Extract headings from the article content
    const extractHeadings = () => {
      const headingElements = document.querySelectorAll('.article-content h2, .article-content h3')
      const items: TOCItem[] = []

      headingElements.forEach((heading) => {
        const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || ''
        const text = heading.textContent || ''
        const level = parseInt(heading.tagName.substring(1))

        // Add ID to heading if it doesn't have one
        if (!heading.id) {
          heading.id = id
        }

        items.push({ id, text, level })
      })

      setHeadings(items)
    }

    // Wait for content to be rendered
    const timer = setTimeout(extractHeadings, 100)
    return () => clearTimeout(timer)
  }, [content])

  useEffect(() => {
    // Set up Intersection Observer for scroll spy
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '-100px 0px -66%',
      threshold: 0,
    })

    // Observe all headings
    const headingElements = document.querySelectorAll('.article-content h2, .article-content h3')
    headingElements.forEach((element) => {
      if (observer.current) {
        observer.current.observe(element)
      }
    })

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [headings])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <aside className="toc visible">
      <div className="toc-header">📑 目次</div>
      <nav className="toc-content">
        <ul>
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`toc-h${heading.level} ${activeId === heading.id ? 'active' : ''}`}
                onClick={(e) => handleClick(e, heading.id)}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
