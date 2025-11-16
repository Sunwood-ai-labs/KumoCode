// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

const app = express();
const PORT = process.env.PORT || 3000;
const ARTICLES_DIR = process.env.ARTICLES_DIR || path.join(__dirname, 'articles');
const THEMES_DIR = path.join(__dirname, 'themes');
const DEFAULT_THEME = process.env.DEFAULT_THEME || 'default';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/**
 * Get list of all articles
 */
app.get('/api/articles', async (req, res) => {
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

    res.json(articles);
  } catch (error) {
    console.error('Error reading articles:', error);
    res.status(500).json({ error: 'Failed to read articles' });
  }
});

/**
 * Get specific article content
 */
app.get('/api/articles/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;

    // Security: Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    if (!filename.endsWith('.md')) {
      return res.status(400).json({ error: 'Only markdown files are allowed' });
    }

    const filePath = path.join(ARTICLES_DIR, filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Article not found' });
    }

    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);
    const title = extractTitle(content) || formatFilename(filename);

    res.json({
      filename,
      title,
      content,
      modifiedDate: stats.mtime.toISOString(),
    });
  } catch (error) {
    console.error('Error reading article:', error);
    res.status(500).json({ error: 'Failed to read article' });
  }
});

/**
 * Get list of available themes
 */
app.get('/api/themes', async (req, res) => {
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
          console.error(`Error parsing theme ${filename}:`, parseError);
          return null;
        }
      })
    );

    // Filter out null values (failed parses)
    const validThemes = themes.filter(theme => theme !== null);

    res.json({
      themes: validThemes,
      default: DEFAULT_THEME,
    });
  } catch (error) {
    console.error('Error reading themes:', error);
    res.status(500).json({ error: 'Failed to read themes' });
  }
});

/**
 * Get specific theme data
 */
app.get('/api/themes/:name', async (req, res) => {
  try {
    const themeName = req.params.name;

    // Security: Prevent directory traversal
    // Security: Prevent directory traversal by validating theme name format.
    if (!/^[a-zA-Z0-9_-]+$/.test(themeName)) {
      return res.status(400).json({ error: 'Invalid theme name' });
    }

    // Try .yaml first, then .yml
    let filePath = path.join(THEMES_DIR, `${themeName}.yaml`);

    try {
      await fs.access(filePath);
    } catch {
      filePath = path.join(THEMES_DIR, `${themeName}.yml`);
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({ error: 'Theme not found' });
      }
    }

    const content = await fs.readFile(filePath, 'utf-8');
    const themeData = yaml.load(content);

    res.json({
      id: themeName,
      ...themeData,
    });
  } catch (error) {
    console.error('Error reading theme:', error);
    res.status(500).json({ error: 'Failed to read theme' });
  }
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
 * Serve index.html for root path
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`\n🚀 KumoCode server is running!`);
  console.log(`📝 Open http://localhost:${PORT} in your browser\n`);
  console.log(`📚 Articles directory: ${ARTICLES_DIR}`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});
