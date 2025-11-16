#!/usr/bin/env node

/**
 * Build script for generating static JSON files for GitHub Pages
 * This replaces the dynamic API endpoints from server.js
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

const ARTICLES_DIR = path.join(__dirname, 'articles');
const THEMES_DIR = path.join(__dirname, 'themes');
const DATA_DIR = path.join(__dirname, 'data');
const DEFAULT_THEME = process.env.DEFAULT_THEME || 'ocean';

/**
 * Extract title from frontmatter
 */
function extractTitle(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return null;

  const frontmatter = match[1];
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);

  if (!titleMatch) return null;

  let title = titleMatch[1].trim();
  // Remove quotes if present
  if ((title.startsWith('"') && title.endsWith('"')) ||
      (title.startsWith("'") && title.endsWith("'"))) {
    title = title.slice(1, -1);
  }

  return title;
}

/**
 * Format filename to readable title
 */
function formatFilename(filename) {
  return filename
    .replace('.md', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Build articles.json
 */
async function buildArticlesIndex() {
  console.log('📝 Building articles index...');

  try {
    const files = await fs.readdir(ARTICLES_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const articles = await Promise.all(
      markdownFiles.map(async (filename) => {
        const filePath = path.join(ARTICLES_DIR, filename);
        const stats = await fs.stat(filePath);
        const content = await fs.readFile(filePath, 'utf-8');

        // Extract title from frontmatter or filename
        const title = extractTitle(content) || formatFilename(filename);

        return {
          filename,
          title,
          modifiedDate: stats.mtime.toISOString(),
        };
      })
    );

    // Sort by modified date (newest first)
    articles.sort((a, b) => new Date(b.modifiedDate) - new Date(a.modifiedDate));

    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(
      path.join(DATA_DIR, 'articles.json'),
      JSON.stringify(articles, null, 2)
    );

    console.log(`✅ Generated articles.json with ${articles.length} articles`);
  } catch (error) {
    console.error('❌ Error building articles index:', error);
    throw error;
  }
}

/**
 * Note: Individual article JSON files are not generated.
 * Articles are served directly as Markdown files from the articles/ directory.
 */

/**
 * Build themes.json
 */
async function buildThemesIndex() {
  console.log('🎨 Building themes index...');

  try {
    const files = await fs.readdir(THEMES_DIR);
    const yamlFiles = files.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));

    const themes = await Promise.all(
      yamlFiles.map(async (filename) => {
        const filePath = path.join(THEMES_DIR, filename);
        const content = await fs.readFile(filePath, 'utf-8');

        try {
          const themeData = yaml.load(content);
          const themeName = filename.replace(/\.(yaml|yml)$/, '');

          return {
            id: themeName,
            name: themeData.name || themeName,
            description: themeData.description || '',
            version: themeData.version || '1.0.0',
          };
        } catch (parseError) {
          console.error(`⚠️  Error parsing theme ${filename}:`, parseError);
          return null;
        }
      })
    );

    // Filter out null values (failed parses)
    const validThemes = themes.filter(theme => theme !== null);

    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(
      path.join(DATA_DIR, 'themes.json'),
      JSON.stringify({
        themes: validThemes,
        default: DEFAULT_THEME,
      }, null, 2)
    );

    console.log(`✅ Generated themes.json with ${validThemes.length} themes (default: ${DEFAULT_THEME})`);
  } catch (error) {
    console.error('❌ Error building themes index:', error);
    throw error;
  }
}

/**
 * Build individual theme JSON files
 */
async function buildThemeFiles() {
  console.log('🎨 Building individual theme files...');

  try {
    const files = await fs.readdir(THEMES_DIR);
    const yamlFiles = files.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));

    const themesDataDir = path.join(DATA_DIR, 'themes');
    await fs.mkdir(themesDataDir, { recursive: true });

    for (const filename of yamlFiles) {
      const filePath = path.join(THEMES_DIR, filename);
      const content = await fs.readFile(filePath, 'utf-8');

      try {
        const themeData = yaml.load(content);
        const themeName = filename.replace(/\.(yaml|yml)$/, '');

        const themeJson = {
          id: themeName,
          ...themeData,
        };

        await fs.writeFile(
          path.join(themesDataDir, `${themeName}.json`),
          JSON.stringify(themeJson, null, 2)
        );
      } catch (parseError) {
        console.error(`⚠️  Error parsing theme ${filename}:`, parseError);
      }
    }

    console.log(`✅ Generated ${yamlFiles.length} theme JSON files`);
  } catch (error) {
    console.error('❌ Error building theme files:', error);
    throw error;
  }
}

/**
 * Main build function
 */
async function build() {
  console.log('🚀 Starting static build for GitHub Pages...\n');

  try {
    await buildArticlesIndex();
    // Note: Article JSON files are not generated - Markdown files are served directly
    await buildThemesIndex();
    await buildThemeFiles();

    console.log('\n✨ Static build completed successfully!');
    console.log(`📂 Theme JSON files are in the data/themes/ directory`);
    console.log(`📝 Articles are served directly from the articles/ directory`);
  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

// Run build
build();
