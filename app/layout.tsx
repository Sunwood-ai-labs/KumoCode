import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata: Metadata = {
  title: 'KumoCode - Modern Markdown Documentation Platform',
  description: 'Next.js-powered Markdown documentation platform with theme support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get default theme from environment variable (defaults to 'system')
  const defaultTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME || 'system'

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
