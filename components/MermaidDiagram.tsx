'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    })

    if (ref.current) {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
      ref.current.innerHTML = `<div class="mermaid" id="${id}">${chart}</div>`

      mermaid.contentLoaded()
    }
  }, [chart])

  return (
    <div className="mermaid-container" ref={ref} />
  )
}
