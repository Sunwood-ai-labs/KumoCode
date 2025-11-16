import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { loadTheme } from '@/lib/themes'
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
  // Get theme name from environment variable (ocean, sunset, etc.)
  const themeName = process.env.NEXT_PUBLIC_DEFAULT_THEME || 'ocean'
  const themeData = loadTheme(themeName)

  // Generate CSS variables for both light and dark modes
  const lightModeVars = themeData ? generateCSSVars(themeData, 'light') : ''
  const darkModeVars = themeData ? generateCSSVars(themeData, 'dark') : ''

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
        {themeData && (
          <style dangerouslySetInnerHTML={{ __html: `
            :root {
              ${lightModeVars}
            }
            .dark {
              ${darkModeVars}
            }
          ` }} />
        )}
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

function generateCSSVars(themeData: any, mode: 'light' | 'dark'): string {
  const modeData = themeData[mode]
  const vars: string[] = []

  // Colors
  Object.entries(modeData.colors).forEach(([key, value]) => {
    vars.push(`--${key.replace(/_/g, '-')}: ${value};`)
  })

  // Gradients
  Object.entries(modeData.gradients).forEach(([key, value]) => {
    vars.push(`--gradient-${key.replace(/_/g, '-')}: ${value};`)
  })

  // Header gradient
  vars.push(`--header-gradient-start: ${modeData.colors.primary};`)
  vars.push(`--header-gradient-end: ${modeData.colors.accent};`)
  vars.push(`--bg-gradient-start: ${modeData.colors.background};`)
  vars.push(`--bg-gradient-end: ${modeData.colors.surface};`)

  return vars.join('\n              ')
}
