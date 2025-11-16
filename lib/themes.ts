import fs from 'fs'
import path from 'path'

const themesDirectory = path.join(process.cwd(), 'themes')

export interface ThemeColors {
  primary: string
  accent: string
  background: string
  surface: string
  text_primary: string
  text_secondary: string
  text_muted: string
  border: string
  code_bg: string
  link: string
  link_hover: string
  header_text: string
}

export interface ThemeGradients {
  header: string
  card_hover: string
}

export interface ThemeBackgrounds {
  header_image: string
  body_image: string
  card_image: string
}

export interface ThemeMode {
  colors: ThemeColors
  gradients: ThemeGradients
  backgrounds: ThemeBackgrounds
}

export interface ThemeData {
  name: string
  version: string
  description: string
  fonts: {
    primary: string
    code: string
  }
  highlight_themes: {
    light: string
    dark: string
  }
  light: ThemeMode
  dark: ThemeMode
  styles: {
    border_radius: string
    card_shadow: string
    header_height: string
    backdrop_blur: string
  }
}

/**
 * Load theme JSON file
 */
export function loadTheme(themeName: string): ThemeData | null {
  try {
    const filePath = path.join(themesDirectory, `${themeName}.json`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error(`Error loading theme ${themeName}:`, error)
    return null
  }
}

/**
 * Get list of available themes
 */
export function getAvailableThemes(): string[] {
  try {
    const files = fs.readdirSync(themesDirectory)
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''))
  } catch (error) {
    console.error('Error reading themes directory:', error)
    return []
  }
}
