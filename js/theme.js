/**
 * Theme Manager for KumoCode
 * Handles loading and applying YAML-based themes
 */

class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.currentMode = 'light';
    this.themes = [];
    this.init();
  }

  /**
   * Initialize theme manager
   */
  async init() {
    // Load saved mode from localStorage
    const savedMode = localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light';

    this.currentMode = savedMode;

    // Load available themes and get default theme from server
    const themesData = await this.loadAvailableThemes();
    const defaultTheme = themesData.default || 'default';

    // Load saved theme or use default from environment variable
    const savedTheme = localStorage.getItem('selectedTheme') || defaultTheme;

    // Apply saved or default theme
    await this.applyTheme(savedTheme);
  }

  /**
   * Load list of available themes
   */
  async loadAvailableThemes() {
    try {
      const url = window.kumoConfig.resolveUrl('data/themes.json');
      const response = await fetch(url);
      const data = await response.json();
      this.themes = data.themes || [];
      // Return full data object including default theme
      return data;
    } catch (error) {
      console.error('Failed to load themes:', error);
      return { themes: [], default: window.kumoConfig.defaultTheme };
    }
  }

  /**
   * Apply a theme by name
   * Following Docusaurus: Load pre-built JSON from build time
   */
  async applyTheme(themeName) {
    try {
      // Load pre-built JSON (YAML → JSON done at build time)
      const url = window.kumoConfig.resolveUrl(`data/themes/${themeName}.json`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load theme: ${themeName}`);
      }

      const themeData = await response.json();
      this.currentTheme = themeData;

      // Apply theme to DOM
      this.applyThemeToDOM(themeData);

      // Save to localStorage
      localStorage.setItem('selectedTheme', themeName);

      return themeData;
    } catch (error) {
      console.error('Error applying theme:', error);
      // Fallback to default theme if loading fails
      const defaultTheme = window.kumoConfig.defaultTheme;
      if (themeName !== defaultTheme) {
        console.log(`Falling back to ${defaultTheme} theme`);
        return this.applyTheme(defaultTheme);
      }
    }
  }

  /**
   * Apply theme data to DOM using CSS variables
   */
  applyThemeToDOM(themeData) {
    const root = document.documentElement;
    const body = document.body;
    const targets = [root, body].filter(Boolean);
    const mode = this.currentMode;
    const modeData = themeData[mode];

    if (!modeData) {
      console.error(`Theme mode ${mode} not found in theme data`);
      return;
    }

    const setVar = (name, value) => {
      targets.forEach(target => target.style.setProperty(name, value));
    };

    // Apply colors
    if (modeData.colors) {
      Object.entries(modeData.colors).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/_/g, '-')}`;
        setVar(cssVar, value);
      });

      // Apply header text color as header-text-color variable
      if (modeData.colors.header_text) {
        setVar('--header-text-color', modeData.colors.header_text);
      }
    }

    // Apply fonts
    if (themeData.fonts) {
      if (themeData.fonts.primary) {
        setVar('--font-primary', themeData.fonts.primary);
      }
      if (themeData.fonts.code) {
        setVar('--font-code', themeData.fonts.code);
      }
    }

    // Apply styles
    if (themeData.styles) {
      Object.entries(themeData.styles).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/_/g, '-')}`;
        setVar(cssVar, value);
      });
    }

    // Apply gradients
    if (modeData.gradients) {
      Object.entries(modeData.gradients).forEach(([key, value]) => {
        const cssVar = `--gradient-${key.replace(/_/g, '-')}`;
        setVar(cssVar, value);
      });
    }

    // Apply background images
    if (modeData.backgrounds) {
      Object.entries(modeData.backgrounds).forEach(([key, value]) => {
        if (value) {
          const cssVar = `--bg-image-${key.replace(/_/g, '-')}`;
          setVar(cssVar, `url(${value})`);
        }
      });
    }

    // Apply header background (gradient + image)
    this.applyHeaderBackground(modeData);

    // Apply syntax highlight theme
    this.applyHighlightTheme(themeData);

    // Apply theme colors to dropdown options
    this.updateDropdownColors(modeData);
  }

  /**
   * Update dropdown option colors based on current theme
   */
  updateDropdownColors(modeData) {
    const selector = document.getElementById('themeSelector');
    if (!selector || !modeData || !modeData.colors) {
      return;
    }

    const surface = modeData.colors.surface || '#ffffff';
    const textPrimary = modeData.colors.text_primary || '#1e293b';

    // Apply colors to all options
    Array.from(selector.options).forEach(option => {
      option.style.backgroundColor = surface;
      option.style.color = textPrimary;
    });
  }

  /**
   * Apply syntax highlight theme
   */
  applyHighlightTheme(themeData) {
    if (!themeData.highlight_themes) return;

    const mode = this.currentMode;
    const highlightTheme = themeData.highlight_themes[mode];

    if (!highlightTheme) return;

    const themeLink = document.getElementById('highlight-theme');
    if (themeLink) {
      themeLink.href = highlightTheme;
    }
  }

  /**
   * Apply header background with gradient and optional image
   */
  applyHeaderBackground(modeData) {
    const header = document.querySelector('header');
    if (!header) return;

    let background = '';

    // If there's a header image, combine it with gradient
    if (modeData.backgrounds?.header_image) {
      const gradient = modeData.gradients?.header || '';
      background = `${gradient}, url(${modeData.backgrounds.header_image})`;
      header.style.backgroundSize = 'cover';
      header.style.backgroundPosition = 'center';
      header.style.backgroundBlendMode = 'overlay';
    } else if (modeData.gradients?.header) {
      // Just gradient
      background = modeData.gradients.header;
    }

    if (background) {
      header.style.background = background;
    }
  }

  /**
   * Toggle between light and dark mode
   */
  toggleMode() {
    this.currentMode = this.currentMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('darkMode', this.currentMode === 'dark');

    // Update body class for dark mode
    document.body.classList.toggle('dark-mode', this.currentMode === 'dark');

    // Reapply current theme with new mode
    if (this.currentTheme) {
      this.applyThemeToDOM(this.currentTheme);
      // Re-highlight code blocks
      this.rehighlightCodeBlocks();
    }
  }

  /**
   * Set specific mode
   */
  setMode(mode) {
    if (mode !== 'light' && mode !== 'dark') {
      console.error('Invalid mode. Use "light" or "dark"');
      return;
    }

    this.currentMode = mode;
    localStorage.setItem('darkMode', mode === 'dark');

    // Update body class
    document.body.classList.toggle('dark-mode', mode === 'dark');

    // Reapply current theme
    if (this.currentTheme) {
      this.applyThemeToDOM(this.currentTheme);
      // Re-highlight code blocks
      this.rehighlightCodeBlocks();
    }
  }

  /**
   * Re-highlight all code blocks
   */
  rehighlightCodeBlocks() {
    const articleContent = document.getElementById('articleContent');
    if (articleContent) {
      articleContent.querySelectorAll('pre code').forEach((block) => {
        if (window.hljs) {
          window.hljs.highlightElement(block);
        }
      });
    }
  }

  /**
   * Get current theme info
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Get available themes
   */
  getAvailableThemes() {
    return this.themes;
  }
}

// Create global theme manager instance
window.themeManager = new ThemeManager();
