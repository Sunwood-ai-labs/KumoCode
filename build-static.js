#!/usr/bin/env node

/**
 * Build script for generating static files for GitHub Pages
 * Converts Markdown to HTML for optimal performance
 * Following Docusaurus architecture: build-time rendering
 * Note: Themes are now JSON source files (no YAML conversion needed)
 */

const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');

const ARTICLES_DIR = path.join(__dirname, 'articles');
const THEMES_DIR = path.join(__dirname, 'themes');
const DATA_DIR = path.join(__dirname, 'data');
const DEFAULT_THEME = process.env.DEFAULT_THEME || 'ocean';

// Heading ID generation (for TOC support)
const headingSlugCounts = new Map();
const PUNCTUATION_REGEX = /[\u2000-\u206F\u2E00-\u2E7F\u3000-\u303F'!"#$%&()*+,./:;<=>?@[\\\]^`{|}~]/g;

function slugifyHeading(text) {
  const normalized = (text || '')
    .toString()
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(PUNCTUATION_REGEX, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const baseSlug = normalized || 'section';
  const count = headingSlugCounts.get(baseSlug) || 0;
  headingSlugCounts.set(baseSlug, count + 1);
  return count ? `${baseSlug}-${count}` : baseSlug;
}

// Configure marked with custom renderer for heading IDs
const renderer = new marked.Renderer();
renderer.heading = function(text, level) {
  const headingId = slugifyHeading(text);
  return `<h${level} id="${headingId}">${text}</h${level}>`;
};

marked.setOptions({
  breaks: true,
  gfm: true,
  renderer: renderer,
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

      // Reset heading slug counts for each article
      headingSlugCounts.clear();

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
 * Build themes index from JSON source files
 * Themes are now stored as JSON (no YAML conversion needed)
 */
async function buildThemesIndex() {
  console.log('🎨 Building themes index from JSON sources...');

  try {
    const files = await fs.readdir(THEMES_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const themes = await Promise.all(
      jsonFiles.map(async (filename) => {
        const filePath = path.join(THEMES_DIR, filename);
        const content = await fs.readFile(filePath, 'utf-8');

        try {
          const themeData = JSON.parse(content);
          const themeName = filename.replace('.json', '');

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
    console.log(`   Note: Themes are JSON source files (no conversion needed)`);
  } catch (error) {
    console.error('❌ Error building themes index:', error);
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

    // Build article content files (MD → HTML at build time)
    await buildArticleFiles();

    console.log('\n✨ Static build completed successfully!');
    console.log(`📦 Build output:`);
    console.log(`   - data/articles.json (article list)`);
    console.log(`   - data/articles/*.json (pre-rendered HTML)`);
    console.log(`   - data/themes.json (theme list metadata)`);
    console.log(`\n📁 Source files:`);
    console.log(`   - themes/*.json (theme source files, no conversion)`);
    console.log(`\n⚡ Performance: No runtime Markdown parsing needed!`);
  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

// Run build
build();
