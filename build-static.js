#!/usr/bin/env node

/**
 * Build script for generating static files for GitHub Pages
 * Converts Markdown and YAML to JSON for optimal performance
 * Following Docusaurus architecture: build-time rendering
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');
const marked = require('marked');

const ARTICLES_DIR = path.join(__dirname, 'articles');
const THEMES_DIR = path.join(__dirname, 'themes');
const DATA_DIR = path.join(__dirname, 'data');
const DEFAULT_THEME = process.env.DEFAULT_THEME || 'ocean';

// Configure marked for optimal HTML output
marked.setOptions({
  breaks: true,
  gfm: true,
});

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
 * Build articles index (metadata only)
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
 * Build individual article JSON files with pre-rendered HTML
 * Following Docusaurus: Markdown → HTML at build time
 */
async function buildArticleFiles() {
  console.log('📄 Building article HTML files...');

  try {
    const files = await fs.readdir(ARTICLES_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const articlesDataDir = path.join(DATA_DIR, 'articles');
    await fs.mkdir(articlesDataDir, { recursive: true });

    for (const filename of markdownFiles) {
      const filePath = path.join(ARTICLES_DIR, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);
      const title = extractTitle(content) || formatFilename(filename);

      // Parse Markdown to HTML at build time (Docusaurus approach)
      const htmlContent = marked.parse(content);

      const articleData = {
        filename,
        title,
        content: content,      // Original Markdown
        html: htmlContent,     // Pre-rendered HTML
        modifiedDate: stats.mtime.toISOString(),
      };

      const outputFilename = filename.replace('.md', '.json');
      await fs.writeFile(
        path.join(articlesDataDir, outputFilename),
        JSON.stringify(articleData, null, 2)
      );
    }

    console.log(`✅ Generated ${markdownFiles.length} article HTML files`);
    console.log(`   Note: Markdown → HTML conversion done at build time`);
  } catch (error) {
    console.error('❌ Error building article files:', error);
    throw error;
  }
}

/**
 * Build themes index (metadata only)
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
 * Build individual theme JSON files from YAML
 * Following Docusaurus: YAML → JSON at build time
 */
async function buildThemeFiles() {
  console.log('🎨 Building theme JSON files...');

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
    console.log(`   Note: YAML → JSON conversion done at build time`);
  } catch (error) {
    console.error('❌ Error building theme files:', error);
    throw error;
  }
}

/**
 * Main build function
 */
async function build() {
  console.log('🚀 Starting Docusaurus-style static build...\n');

  try {
    // Build metadata indexes
    await buildArticlesIndex();
    await buildThemesIndex();

    // Build full content files (Docusaurus approach)
    await buildArticleFiles();
    await buildThemeFiles();

    console.log('\n✨ Static build completed successfully!');
    console.log(`📦 Build output:`);
    console.log(`   - data/articles.json (article list)`);
    console.log(`   - data/articles/*.json (pre-rendered HTML)`);
    console.log(`   - data/themes.json (theme list)`);
    console.log(`   - data/themes/*.json (theme data)`);
    console.log(`\n⚡ Performance: No runtime Markdown/YAML parsing needed!`);
  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

// Run build
build();
