// ==========================================
// Global State
// ==========================================
let currentArticle = null;
let articles = [];
let currentView = 'home'; // 'home' or 'article'
let availableThemes = [];
let activeThemeId = null;
let isThemeMenuOpen = false;
let dropdownInteractionsBound = false;

const themeDropdownElements = {
    wrapper: null,
    toggle: null,
    menu: null,
    label: null,
    nativeSelect: null,
};

// Track generated heading IDs so the TOC can link to unique anchors even for non-Latin titles
const headingSlugCounts = new Map();
const PUNCTUATION_REGEX = /[\u2000-\u206F\u2E00-\u2E7F\u3000-\u303F'!"#$%&()*+,./:;<=>?@[\\\]^`{|}~]/g;

function resetHeadingSlugs() {
    headingSlugCounts.clear();
}

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

// ==========================================
// Marked.js Configuration
// ==========================================

// Initialize Mermaid with dark mode support
if (window.mermaid) {
    mermaid.initialize({
        startOnLoad: false,
        theme: document.body.classList.contains('dark-mode') ? 'dark' : 'default',
        securityLevel: 'loose',
    });
}

marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (err) {
                console.error('Highlight error:', err);
            }
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true,
});

// Custom renderer for headings with IDs
const renderer = new marked.Renderer();
renderer.heading = function(text, level) {
    const headingId = slugifyHeading(text);
    return `<h${level} id="${headingId}">${text}</h${level}>`;
};
marked.setOptions({ renderer: renderer });

// ==========================================
// API Functions
// ==========================================

/**
 * Fetch list of articles from the server
 */
async function fetchArticles() {
    try {
        const url = window.kumoConfig.resolveUrl('data/articles.json');
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        articles = data;
        return data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

/**
 * Fetch article content from pre-built JSON
 * Following Docusaurus: HTML is pre-rendered at build time
 */
async function fetchArticleContent(filename) {
    try {
        // Convert .md filename to .json
        const jsonFilename = filename.replace('.md', '.json');
        const url = window.kumoConfig.resolveUrl(`data/articles/${encodeURIComponent(jsonFilename)}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch article content');
        }
        const data = await response.json();

        // Data includes pre-rendered HTML from build time
        return data;
    } catch (error) {
        console.error('Error fetching article content:', error);
        return null;
    }
}

/**
 * Extract title from frontmatter (helper function)
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
 * Format filename to readable title (helper function)
 */
function formatFilename(filename) {
    return filename
        .replace('.md', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

// ==========================================
// View Management
// ==========================================

/**
 * Show home view (article grid)
 */
function showHomeView() {
    currentView = 'home';
    document.getElementById('homeView').style.display = 'block';
    document.getElementById('articleView').style.display = 'none';

    // Clear URL parameter when returning to home view
    const url = new URL(window.location);
    url.searchParams.delete('article');
    window.history.pushState({}, '', url);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Show article view
 */
function showArticleView() {
    currentView = 'article';
    document.getElementById('homeView').style.display = 'none';
    document.getElementById('articleView').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// UI Rendering Functions
// ==========================================

/**
 * Render article grid in home view
 */
function renderArticleGrid(articles) {
    const articleGrid = document.getElementById('articleGrid');

    if (articles.length === 0) {
        articleGrid.innerHTML = '<div class="loading">記事が見つかりませんでした</div>';
        return;
    }

    articleGrid.innerHTML = articles.map(article => `
        <div class="article-card" data-filename="${article.filename}">
            <div class="article-card-title">${article.title}</div>
            <div class="article-card-date">${formatDate(article.modifiedDate)}</div>
        </div>
    `).join('');

    // Add click event listeners
    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', () => {
            const filename = card.dataset.filename;
            loadArticle(filename);
        });
    });
}

/**
 * Load and display article
 */
async function loadArticle(filename, updateUrl = true) {
    const articleData = await fetchArticleContent(filename);

    if (!articleData) {
        alert('記事の読み込みに失敗しました');
        return;
    }

    currentArticle = articleData;

    // Render article
    renderArticle(articleData);

    // Update URL with article parameter
    if (updateUrl) {
        const url = new URL(window.location);
        url.searchParams.set('article', filename);
        window.history.pushState({ article: filename }, '', url);
    }

    // Show article view
    showArticleView();
}

/**
 * Render article content
 */
function renderArticle(articleData) {
    const articleTitle = document.getElementById('articleTitle');
    const articleMeta = document.getElementById('articleMeta');
    const articleContent = document.getElementById('articleContent');

    // Extract frontmatter if exists
    const { title, meta, content } = parseFrontmatter(articleData.content);

    // Set title
    articleTitle.textContent = title || articleData.title;

    // Set meta information
    if (meta.date || meta.tags) {
        articleMeta.innerHTML = `
            ${meta.date ? `<span>📅 ${meta.date}</span>` : ''}
            ${meta.tags ? `<span>🏷️ ${meta.tags.join(', ')}</span>` : ''}
        `;
    } else {
        articleMeta.innerHTML = '';
    }

    // Use pre-rendered HTML from build time (Docusaurus approach)
    resetHeadingSlugs();
    articleContent.innerHTML = articleData.html;

    // Apply syntax highlighting
    articleContent.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });

    // Render math equations with KaTeX
    renderMath(articleContent);

    // Render Mermaid diagrams
    renderMermaid(articleContent);

    // Render URL cards
    renderUrlCards(articleContent);

    // Generate table of contents
    generateTOC(articleContent);
}

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { title: null, meta: {}, content };
    }

    const frontmatterText = match[1];
    const markdownContent = match[2];
    const meta = {};

    // Parse YAML-like frontmatter
    const lines = frontmatterText.split('\n');
    lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            // Handle arrays (tags)
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(v => v.trim());
            }

            meta[key] = value;
        }
    });

    return {
        title: meta.title || null,
        meta,
        content: markdownContent
    };
}

/**
 * Generate Table of Contents
 */
function generateTOC(contentElement) {
    const headings = contentElement.querySelectorAll('h2, h3');
    const toc = document.getElementById('toc');
    const tocContent = document.getElementById('tocContent');

    if (headings.length === 0) {
        toc.classList.remove('visible');
        return;
    }

    const tocItems = Array.from(headings).map(heading => {
        const level = heading.tagName.toLowerCase();
        const text = heading.textContent;
        const id = heading.id;

        return `<li><a href="#${id}" class="toc-${level}">${text}</a></li>`;
    }).join('');

    tocContent.innerHTML = `<ul>${tocItems}</ul>`;
    toc.classList.add('visible');

    // Add smooth scroll behavior
    tocContent.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Update active TOC item
                tocContent.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Highlight TOC item on scroll
    setupTOCScrollSpy(headings);
}

/**
 * Setup scroll spy for TOC
 */
function setupTOCScrollSpy(headings) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const tocLinks = document.querySelectorAll('.toc-content a');
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-100px 0px -66%',
        threshold: 0
    });

    headings.forEach(heading => observer.observe(heading));
}

/**
 * Render math equations with KaTeX
 */
function renderMath(contentElement) {
    if (!contentElement || !window.katex) {
        return;
    }

    normalizeDisplayMathBlocks(contentElement);

    const katexOptions = {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
        strict: 'ignore',
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    };

    if (window.renderMathInElement) {
        window.renderMathInElement(contentElement, katexOptions);
    } else {
        console.warn('KaTeX auto-render helper not found. Falling back to manual renderer.');
    }

    manualRenderMath(contentElement, katexOptions);
}

/**
 * Manual fallback for math rendering when KaTeX auto-render helper is unavailable.
 * Skips code/pre/kbd nodes to avoid corrupting highlighted code blocks.
 */
function manualRenderMath(contentElement, katexOptions) {
    const skippedTags = new Set(['CODE', 'PRE', 'KBD', 'SAMP', 'TEXTAREA', 'SCRIPT', 'STYLE']);
    const walker = document.createTreeWalker(
        contentElement,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                if (!node.textContent || !node.textContent.includes('$')) {
                    return NodeFilter.FILTER_REJECT;
                }
                let parent = node.parentNode;
                while (parent) {
                    if (parent.nodeType === Node.ELEMENT_NODE && skippedTags.has(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    parent = parent.parentNode;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const nodes = [];
    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    }

    const mathRegex = /\$\$([\s\S]+?)\$\$|\$([\s\S]+?)\$/g;

    nodes.forEach(node => {
        const text = node.textContent;
        let lastIndex = 0;
        const fragments = [];
        let match;

        while ((match = mathRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                fragments.push(document.createTextNode(text.slice(lastIndex, match.index)));
            }

            const mathContent = (match[1] ?? match[2] ?? '').trim();
            const displayMode = Boolean(match[1]);
            const wrapper = document.createElement(displayMode ? 'div' : 'span');

            try {
                katex.render(mathContent, wrapper, {
                    displayMode,
                    throwOnError: katexOptions.throwOnError,
                    strict: katexOptions.strict,
                });
                fragments.push(wrapper);
            } catch (error) {
                console.error('KaTeX error:', error);
                fragments.push(document.createTextNode(match[0]));
            }

            lastIndex = match.index + match[0].length;
        }

        if (!fragments.length) {
            return;
        }

        if (lastIndex < text.length) {
            fragments.push(document.createTextNode(text.slice(lastIndex)));
        }

        const parent = node.parentNode;
        fragments.forEach(fragment => parent.insertBefore(fragment, node));
        parent.removeChild(node);
    });
}

/**
 * Normalize block math that Markdown rendered as separate paragraphs:
 * <p>$$</p><p>...math...</p><p>$$</p> → <p>$$...math...$$</p>
 * This ensures KaTeX auto-render can detect the delimiters correctly.
 */
function normalizeDisplayMathBlocks(root) {
    const paragraphs = Array.from(root.querySelectorAll('p'));

    paragraphs.forEach(paragraph => {
        const trimmedText = paragraph.textContent.trim();

        // Case 1: block already wrapped in a single paragraph with $$...$$ (possibly with newlines)
        if (trimmedText.startsWith('$$') && trimmedText.endsWith('$$') && trimmedText.length > 4) {
            const inner = trimmedText.slice(2, -2).trim();
            paragraph.textContent = `$$${inner}$$`;
            return;
        }

        if (trimmedText !== '$$') {
            return;
        }

        const mathNodes = [];
        let cursor = paragraph.nextSibling;
        let closingMarker = null;

        while (cursor) {
            if (cursor.nodeType === Node.ELEMENT_NODE) {
                const element = cursor;
                if (element.tagName === 'P') {
                    if (element.textContent.trim() === '$$') {
                        closingMarker = element;
                        break;
                    }
                    mathNodes.push(element);
                    cursor = element.nextSibling;
                    continue;
                } else {
                    // Encountered a non-paragraph element; abort normalization for safety
                    return;
                }
            }

            if (cursor.nodeType === Node.TEXT_NODE) {
                mathNodes.push(cursor);
                cursor = cursor.nextSibling;
                continue;
            }

            cursor = cursor.nextSibling;
        }

        if (!closingMarker || mathNodes.length === 0) {
            return;
        }

        const mathContent = mathNodes
            .map(node => node.textContent)
            .join('\n')
            .trim();

        if (!mathContent) {
            return;
        }

        mathNodes.forEach(node => node.remove());
        closingMarker.remove();
        paragraph.textContent = `$$${mathContent}$$`;
    });
}

/**
 * Render Mermaid diagrams
 */
async function renderMermaid(contentElement) {
    if (!window.mermaid) {
        console.warn('Mermaid library not found');
        return;
    }

    // Find all code blocks with language 'mermaid'
    const mermaidBlocks = contentElement.querySelectorAll('pre code.language-mermaid');

    for (let i = 0; i < mermaidBlocks.length; i++) {
        const codeBlock = mermaidBlocks[i];
        const preElement = codeBlock.parentElement;
        const mermaidCode = codeBlock.textContent;

        try {
            // Create a container for the diagram
            const container = document.createElement('div');
            container.className = 'mermaid-container';
            container.setAttribute('data-processed', 'true');

            // Generate unique ID for the diagram
            const id = `mermaid-${Date.now()}-${i}`;

            // Render the diagram
            const { svg } = await mermaid.render(id, mermaidCode);
            container.innerHTML = svg;

            // Replace the code block with the rendered diagram
            preElement.parentNode.replaceChild(container, preElement);
        } catch (error) {
            console.error('Mermaid rendering error:', error);
            // Keep the original code block on error
            codeBlock.textContent = `Error rendering diagram:\n${error.message}\n\n${mermaidCode}`;
        }
    }
}

/**
 * Render URL cards for social media embeds
 */
function renderUrlCards(contentElement) {
    // Find all paragraph elements
    const paragraphs = contentElement.querySelectorAll('p');

    paragraphs.forEach(paragraph => {
        // Check if paragraph contains only a link
        const links = paragraph.querySelectorAll('a');
        if (links.length !== 1 || paragraph.textContent.trim() !== links[0].textContent.trim()) {
            return;
        }

        const link = links[0];
        const url = link.href;

        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (youtubeMatch) {
            const videoId = youtubeMatch[1];
            const card = createYouTubeCard(videoId, url);
            paragraph.parentNode.replaceChild(card, paragraph);
            return;
        }

        // ニコニコ動画
        const nicovideoMatch = url.match(/nicovideo\.jp\/watch\/(sm\d+|so\d+|nm\d+)/);
        if (nicovideoMatch) {
            const videoId = nicovideoMatch[1];
            const card = createNicovideoCard(videoId, url);
            paragraph.parentNode.replaceChild(card, paragraph);
            return;
        }

        // Twitter/X
        const twitterMatch = url.match(/(?:twitter\.com|x\.com)\/([^\/]+)\/status\/(\d+)/);
        if (twitterMatch) {
            const username = twitterMatch[1];
            const tweetId = twitterMatch[2];
            const card = createTwitterCard(username, tweetId, url);
            paragraph.parentNode.replaceChild(card, paragraph);
            return;
        }
    });
}

/**
 * Create YouTube embed card
 */
function createYouTubeCard(videoId, url) {
    const card = document.createElement('div');
    card.className = 'url-card youtube-card';
    card.innerHTML = `
        <div class="url-card-embed">
            <iframe
                src="https://www.youtube.com/embed/${videoId}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
        </div>
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="url-card-link">
            YouTube で開く
        </a>
    `;
    return card;
}

/**
 * Create Nicovideo embed card
 */
function createNicovideoCard(videoId, url) {
    const card = document.createElement('div');
    card.className = 'url-card nicovideo-card';
    card.innerHTML = `
        <div class="url-card-embed">
            <iframe
                src="https://embed.nicovideo.jp/watch/${videoId}"
                frameborder="0"
                allowfullscreen
            ></iframe>
        </div>
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="url-card-link">
            ニコニコ動画で開く
        </a>
    `;
    return card;
}

/**
 * Create Twitter/X embed card
 */
function createTwitterCard(username, tweetId, url) {
    const card = document.createElement('div');
    card.className = 'url-card twitter-card';
    card.innerHTML = `
        <blockquote class="twitter-tweet" data-theme="${document.body.classList.contains('dark-mode') ? 'dark' : 'light'}">
            <a href="${url}" target="_blank" rel="noopener noreferrer">ツイートを読み込み中...</a>
        </blockquote>
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="url-card-link">
            Twitter/X で開く
        </a>
    `;

    // Load Twitter widgets script if not already loaded
    if (!window.twttr) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.onload = () => {
            if (window.twttr && window.twttr.widgets) {
                window.twttr.widgets.load(card);
            }
        };
        document.head.appendChild(script);
    } else if (window.twttr.widgets) {
        window.twttr.widgets.load(card);
    }

    return card;
}

/**
 * Format date string
 */
function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
}

// ==========================================
// Theme Toggle
// ==========================================

/**
 * Update highlight.js theme based on current mode
 */
function updateHighlightTheme(isDark) {
    const themeLink = document.getElementById('highlight-theme');
    if (themeLink) {
        const lightTheme = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css';
        const darkTheme = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css';
        themeLink.href = isDark ? darkTheme : lightTheme;
    }
}

/**
 * Initialize theme from localStorage or system preference
 */
function initTheme() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const isDark = savedDarkMode || (!localStorage.getItem('darkMode') && prefersDark);

    if (isDark) {
        document.body.classList.add('dark-mode');
        updateHighlightTheme(true);
    } else {
        updateHighlightTheme(false);
    }
}

/**
 * Toggle theme between light and dark mode
 */
function toggleTheme() {
    // Use themeManager if available
    if (window.themeManager) {
        window.themeManager.toggleMode();
        // ThemeManager now handles highlight theme automatically
    }
}

/**
 * Populate theme selector with available themes
 */
async function populateThemeSelector() {
    const selector = themeDropdownElements.nativeSelect;
    if (!selector || !window.themeManager) return;

    const themesData = await window.themeManager.loadAvailableThemes();
    availableThemes = themesData.themes || [];

    if (!availableThemes.length) {
        selector.innerHTML = '<option value="">テーマが見つかりません</option>';
        return;
    }

    selector.innerHTML = availableThemes.map(theme =>
        `<option value="${theme.id}">${theme.name}</option>`
    ).join('');

    if (!activeThemeId) {
        const currentTheme = window.themeManager.getCurrentTheme();
        activeThemeId = currentTheme?.id || localStorage.getItem('selectedTheme') || themesData.default || availableThemes[0].id;
    }

    renderThemeDropdownOptions();
}

/**
 * Handle theme selector change
 */
async function handleThemeChange(event) {
    const themeName = event.target.value;
    await selectTheme(themeName);
}

/**
 * Cache dropdown DOM references
 */
function cacheThemeDropdownElements() {
    themeDropdownElements.wrapper = document.getElementById('themeSelectorWrapper');
    themeDropdownElements.toggle = document.getElementById('themeDropdownToggle');
    themeDropdownElements.menu = document.getElementById('themeDropdownMenu');
    themeDropdownElements.label = document.getElementById('themeDropdownLabel');
    themeDropdownElements.nativeSelect = document.getElementById('themeSelector');

    if (themeDropdownElements.wrapper) {
        document.body.classList.add('theme-enhanced');
    }

    if (themeDropdownElements.nativeSelect) {
        themeDropdownElements.nativeSelect.hidden = true;
        themeDropdownElements.nativeSelect.setAttribute('aria-hidden', 'true');
        themeDropdownElements.nativeSelect.setAttribute('tabindex', '-1');
    }
}

/**
 * Bind dropdown interactions once
 */
function setupThemeDropdownInteractions() {
    const { toggle, menu, nativeSelect } = themeDropdownElements;
    if (!toggle || !menu || dropdownInteractionsBound) return;

    dropdownInteractionsBound = true;

    toggle.addEventListener('click', (event) => {
        event.preventDefault();
        toggleThemeMenu();
    });

    toggle.addEventListener('keydown', handleThemeToggleKeydown);
    menu.addEventListener('click', handleThemeMenuClick);
    menu.addEventListener('keydown', handleThemeMenuKeydown);
    document.addEventListener('click', handleThemeOutsideClick);

    if (nativeSelect) {
        nativeSelect.addEventListener('change', handleThemeChange);
    }
}

function handleThemeToggleKeydown(event) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        openThemeMenu();
        focusActiveThemeOption();
    }
}

function handleThemeMenuClick(event) {
    const optionButton = event.target.closest('.theme-dropdown-item');
    if (!optionButton) return;
    const themeId = optionButton.dataset.themeId;
    selectTheme(themeId);
}

function handleThemeMenuKeydown(event) {
    switch (event.key) {
        case 'Escape':
            event.preventDefault();
            closeThemeMenu({ returnFocus: true });
            break;
        case 'ArrowDown':
            event.preventDefault();
            moveThemeOptionFocus(1);
            break;
        case 'ArrowUp':
            event.preventDefault();
            moveThemeOptionFocus(-1);
            break;
        case 'Home':
            event.preventDefault();
            focusThemeOptionByIndex(0);
            break;
        case 'End':
            event.preventDefault();
            focusThemeOptionByIndex(-1);
            break;
        default:
            break;
    }
}

function handleThemeOutsideClick(event) {
    if (!isThemeMenuOpen) return;
    if (!themeDropdownElements.wrapper?.contains(event.target)) {
        closeThemeMenu();
    }
}

function toggleThemeMenu(forceState) {
    if (typeof forceState === 'boolean') {
        return forceState ? openThemeMenu() : closeThemeMenu();
    }
    return isThemeMenuOpen ? closeThemeMenu() : openThemeMenu();
}

function openThemeMenu() {
    if (isThemeMenuOpen || !themeDropdownElements.wrapper) return;
    themeDropdownElements.wrapper.classList.add('open');
    themeDropdownElements.toggle?.setAttribute('aria-expanded', 'true');
    isThemeMenuOpen = true;
}

function closeThemeMenu(options = {}) {
    if (!isThemeMenuOpen || !themeDropdownElements.wrapper) return;
    themeDropdownElements.wrapper.classList.remove('open');
    themeDropdownElements.toggle?.setAttribute('aria-expanded', 'false');
    isThemeMenuOpen = false;
    if (options.returnFocus && themeDropdownElements.toggle) {
        themeDropdownElements.toggle.focus();
    }
}

function focusActiveThemeOption() {
    const { menu } = themeDropdownElements;
    if (!menu) return;
    const activeOption = menu.querySelector('.theme-dropdown-item.active');
    const fallback = menu.querySelector('.theme-dropdown-item');
    (activeOption || fallback)?.focus();
}

function moveThemeOptionFocus(direction) {
    const { menu } = themeDropdownElements;
    if (!menu) return;
    const options = Array.from(menu.querySelectorAll('.theme-dropdown-item'));
    if (!options.length) return;
    const currentIndex = options.indexOf(document.activeElement);
    const nextIndex = currentIndex === -1
        ? (direction > 0 ? 0 : options.length - 1)
        : (currentIndex + direction + options.length) % options.length;
    options[nextIndex].focus();
}

function focusThemeOptionByIndex(index) {
    const { menu } = themeDropdownElements;
    if (!menu) return;
    const options = Array.from(menu.querySelectorAll('.theme-dropdown-item'));
    if (!options.length) return;
    let targetIndex = index;
    if (index === -1) {
        targetIndex = options.length - 1;
    }
    options[Math.max(0, Math.min(targetIndex, options.length - 1))].focus();
}

function renderThemeDropdownOptions() {
    const { menu, label, nativeSelect } = themeDropdownElements;
    if (!menu) return;

    menu.innerHTML = availableThemes.map(theme => {
        const isActive = theme.id === activeThemeId;
        return `
            <li>
                <button type="button" class="theme-dropdown-item${isActive ? ' active' : ''}" role="option" aria-selected="${isActive}" data-theme-id="${theme.id}" tabindex="-1">
                    <span class="theme-option-name">${theme.name}</span>
                </button>
            </li>
        `;
    }).join('');

    if (label) {
        label.textContent = getActiveThemeName() || 'テーマを選択';
    }

    if (nativeSelect) {
        nativeSelect.value = activeThemeId || '';
    }
}

function getActiveThemeName() {
    const activeTheme = availableThemes.find(theme => theme.id === activeThemeId);
    return activeTheme?.name;
}

async function selectTheme(themeId) {
    if (!themeId) return;
    if (themeId === activeThemeId) {
        closeThemeMenu();
        return;
    }

    try {
        if (window.themeManager) {
            await window.themeManager.applyTheme(themeId);
            window.themeManager.rehighlightCodeBlocks();
        }
        activeThemeId = themeId;
        renderThemeDropdownOptions();
    } catch (error) {
        console.error('Failed to apply theme:', error);
    } finally {
        closeThemeMenu();
    }
}

// ==========================================
// Event Handlers
// ==========================================

/**
 * Refresh article list
 */
async function refreshArticles() {
    const articleGrid = document.getElementById('articleGrid');
    articleGrid.innerHTML = '<div class="loading">記事を読み込み中...</div>';

    const articles = await fetchArticles();
    renderArticleGrid(articles);
}

// ==========================================
// Initialization
// ==========================================

/**
 * Initialize the application
 */
async function init() {
    console.log('Initializing KumoCode...');

    // Initialize theme
    initTheme();

    cacheThemeDropdownElements();
    setupThemeDropdownInteractions();

    // Wait for themeManager to be ready
    if (window.themeManager) {
        await window.themeManager.init();

        const currentTheme = window.themeManager.getCurrentTheme();
        if (currentTheme?.id) {
            activeThemeId = currentTheme.id;
        }

        // Populate theme selector
        await populateThemeSelector();
        // ThemeManager now handles highlight theme automatically
    }

    // Setup theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Setup home button (logo)
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
        homeButton.addEventListener('click', showHomeView);
    }

    // Setup back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', showHomeView);
    }

    // Setup refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshArticles);
    }

    // Setup browser back/forward navigation
    window.addEventListener('popstate', (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        const articleParam = urlParams.get('article');

        if (articleParam) {
            loadArticle(articleParam, false);
        } else {
            showHomeView();
        }
    });

    // Load articles
    await refreshArticles();

    // Check if URL has article parameter
    const urlParams = new URLSearchParams(window.location.search);
    const articleParam = urlParams.get('article');

    if (articleParam) {
        // Load article from URL parameter
        await loadArticle(articleParam, false);
    } else {
        // Show home view by default
        showHomeView();
    }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
