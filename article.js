/* ============================================================
   Profound Physics — Per-article page renderer
   Reads ?slug=<slug> from the URL, fetches the markdown file
   from articles/<slug>.md, parses YAML frontmatter, converts
   markdown to HTML, and renders with KaTeX math.
   ============================================================ */

(() => {
  'use strict';

  const ARTICLES_URL = './articles.json';
  const ARTICLES_DIR = './articles';

  const escapeHTML = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const escapeAttr = escapeHTML;

  const formatDate = (iso) => {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || '';
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  };

  const categoryLabel = (id) => {
    const labels = {
      'relativity': 'Relativity',
      'mathematics': 'Mathematics',
      'general-physics': 'General Physics',
      'lagrangian-hamiltonian': 'Lagrangian–Hamiltonian Mechanics',
      'quantum-mechanics': 'Quantum Mechanics',
    };
    return labels[id] || id;
  };

  function getSlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
  }

  function runKaTeX(el) {
    if (!el || typeof window.renderMathInElement !== 'function') return;
    try {
      window.renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$',  right: '$',  display: false },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
        ],
        throwOnError: false,
        errorColor: '#cc785c',
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
      });
    } catch (e) {
      console.warn('KaTeX render error:', e);
    }
  }

  function parseFrontmatter(markdown) {
    const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: markdown };

    const meta = {};
    const lines = match[1].split('\n');
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim();
        meta[key] = value;
      }
    }

    return { meta, body: match[2] };
  }

  function renderNotFound() {
    document.title = 'Not found — Profound Physics';
    const el = document.getElementById('article-content');
    if (el) {
      el.innerHTML = `
        <p class="article-page__eyebrow">Error</p>
        <h1 class="article-page__title">Article not found</h1>
        <p style="margin-top: 16px; color: var(--color-body);">We couldn't find that article in our archive.
        <a href="./index.html#archive">Browse all 50 articles</a> or
        <a href="https://profoundphysics.com/" target="_blank" rel="noopener">visit the original site</a>.</p>
      `;
    }
  }

  function renderArticle(markdown, allArticles) {
    const { meta, body } = parseFrontmatter(markdown);

    // Use frontmatter metadata, fallback to articles.json
    const slug = getSlug();
    const articleMeta = allArticles.find(a => a.slug === slug) || {};

    const title = meta.title || articleMeta.title || 'Untitled';
    const category = meta.category || articleMeta.category || '';
    const date = meta.date || articleMeta.date || '';
    const originalUrl = meta.original_url || articleMeta.original_url || '#';
    const excerpt = meta.excerpt || articleMeta.excerpt || '';

    // Update page title
    document.title = `${title} — Profound Physics`;

    // Find next/prev by date within the same category
    const sameCat = allArticles
      .filter(a => a.category === category)
      .sort((a, b) => a.date.localeCompare(b.date));
    const idx = sameCat.findIndex(a => a.slug === slug);
    const next = idx >= 0 && idx < sameCat.length - 1 ? sameCat[idx + 1] : null;
    const prev = idx > 0 ? sameCat[idx - 1] : null;

    const navNext = document.getElementById('article-nav-next');
    if (navNext) {
      navNext.innerHTML = next
        ? `<a href="./article.html?slug=${escapeAttr(next.slug)}">Next: ${escapeHTML(next.title)} →</a>`
        : '';
    }

    // Protect math blocks from marked.js processing
    const mathBlocks = [];
    let protectedBody = body;

    // Protect display math $$...$$
    protectedBody = protectedBody.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
      const idx = mathBlocks.length;
      mathBlocks.push({ type: 'display', content: math });
      return `@@MATH_BLOCK_${idx}@@`;
    });

    // Protect inline math $...$
    protectedBody = protectedBody.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
      const idx = mathBlocks.length;
      mathBlocks.push({ type: 'inline', content: math });
      return `@@MATH_BLOCK_${idx}@@`;
    });

    // Convert markdown to HTML
    let html = window.marked.parse(protectedBody);

    // Restore math blocks
    html = html.replace(/@@MATH_BLOCK_(\d+)@@/g, (match, idx) => {
      const block = mathBlocks[parseInt(idx)];
      if (block.type === 'display') {
        return `$$${block.content}$$`;
      } else {
        return `$${block.content}$`;
      }
    });

    const content = document.getElementById('article-content');
    if (content) {
      content.innerHTML = `
        <p class="article-page__eyebrow">${escapeHTML(categoryLabel(category))}</p>
        <h1 class="article-page__title">${escapeHTML(title)}</h1>
        <div class="article-page__meta">
          <span>Published ${escapeHTML(formatDate(date))}</span>
          <span>·</span>
          <span>Originally on <a href="${escapeAttr(originalUrl)}" target="_blank" rel="noopener">profoundphysics.com</a></span>
        </div>
        <div class="article-page__body">
          ${html}
        </div>

        <div class="article-page__cta">
          <h2 class="article-page__cta-heading">Read the original</h2>
          <p>This article was originally published on profoundphysics.com, where you can find additional resources and comments.</p>
          <a class="button-primary" href="${escapeAttr(originalUrl)}" target="_blank" rel="noopener">Open original →</a>
        </div>
      `;

      // Render math
      runKaTeX(content);
    }
  }

  // Theme toggle
  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const html = document.documentElement;
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = saved || (prefersDark ? 'dark' : 'light');

    function setTheme(theme) {
      currentTheme = theme;
      html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }

    toggle.addEventListener('click', () => {
      const next = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(next);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  async function init() {
    initThemeToggle();

    const slug = getSlug();
    if (!slug) { renderNotFound(); return; }

    // Load articles.json for metadata
    let allArticles = [];
    try {
      const res = await fetch(ARTICLES_URL, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        allArticles = data.articles || [];
      }
    } catch (e) {
      console.warn('Could not load articles.json:', e);
    }

    // Load the markdown file
    let markdown;
    try {
      const res = await fetch(`${ARTICLES_DIR}/${slug}.md`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      markdown = await res.text();
    } catch (e) {
      console.error('Failed to load article:', e);
      renderNotFound();
      return;
    }

    renderArticle(markdown, allArticles);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
