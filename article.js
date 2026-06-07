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
        // Unify text in math (\text, \mathrm, \textrm) with the body font
        // so inline math doesn't look like a different typeface from the prose.
        // Spectral is our body sans; KaTeX's default text mode uses KaTeX_SansSerif.
        // We override with a CSS rule on .katex .mord.text, .mathit, etc.
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

    // Protect display math $$...$$ (only on its own line)
    protectedBody = protectedBody.replace(/(?:^|\n)\s*\$\$\n?([\s\S]*?)\n?\$\$\s*(?:\n|$)/g, (match, math) => {
      const idx = mathBlocks.length;
      mathBlocks.push({ type: 'display', content: math });
      return `\n@@MATH_BLOCK_${idx}@@\n`;
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

    // Add IDs to headings for TOC linking
    const headingSlugs = new Map();
    html = html.replace(/<h([23])>(.*?)<\/h\1>/g, (match, level, text) => {
      // Strip HTML tags from heading text for slug
      const cleanText = text.replace(/<[^>]+>/g, '');
      let slug = cleanText.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 60);
      // Ensure unique slugs
      let count = headingSlugs.get(slug) || 0;
      headingSlugs.set(slug, count + 1);
      if (count > 0) slug = `${slug}-${count}`;
      return `<h${level} id="${slug}">${text}</h${level}>`;
    });

    // Store headings for TOC generation
    renderArticle.headings = [];
    html.replace(/<h([23]) id="([^"]+)">(.*?)<\/h\1>/g, (match, level, id, text) => {
      const cleanText = text.replace(/<[^>]+>/g, '');
      renderArticle.headings.push({ level: parseInt(level), id, text: cleanText });
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

      // Build and wire the right-side table of contents
      buildTOC(renderArticle.headings);

      // Highlight the current category in the left panel
      highlightLeftPanelCategory(category);
    }
  }

  // Highlight the matching category link in the left panel
  function highlightLeftPanelCategory(category) {
    // Remove existing active state
    document.querySelectorAll('.left-panel__link').forEach(link => {
      link.classList.remove('left-panel__link--active');
    });

    // Find and highlight the matching category link
    const target = document.querySelector(`.left-panel__link[data-cat="${category}"]`);
    if (target) {
      target.classList.add('left-panel__link--active');
    }
  }

  // Build the right-side table of contents from article headings
  function buildTOC(headings) {
    const tocContainer = document.getElementById('toc-list');
    if (!tocContainer || !headings || headings.length === 0) {
      // Hide the TOC panel if no headings
      const tocPanel = document.getElementById('toc-panel');
      if (tocPanel) tocPanel.style.display = 'none';
      return;
    }

    tocContainer.innerHTML = headings.map(h => `
      <li class="toc-item toc-item--level-${h.level}">
        <a href="#${escapeAttr(h.id)}" class="toc-link" data-target="${escapeAttr(h.id)}">${escapeHTML(h.text)}</a>
      </li>
    `).join('');

    // Set up IntersectionObserver to highlight active heading
    initTocObserver(headings);

    // Smooth scroll on click
    tocContainer.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.target);
        if (target) {
          const top = window.scrollY + target.getBoundingClientRect().top - 100;
          window.scrollTo({ top, behavior: 'smooth' });
          history.replaceState(null, '', `#${link.dataset.target}`);
        }
      });
    });
  }

  // IntersectionObserver to track which heading is currently in view
  function initTocObserver(headings) {
    const links = document.querySelectorAll('.toc-link');
    if (links.length === 0) return;

    let activeId = null;
    const visibleHeadings = new Map();

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleHeadings.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleHeadings.delete(entry.target.id);
        }
      }

      // Pick the heading closest to the top of the viewport
      let bestId = null;
      let bestTop = -Infinity;
      for (const [id] of visibleHeadings) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top < 100 && top > bestTop) {
            bestTop = top;
            bestId = id;
          }
        }
      }

      if (!bestId && visibleHeadings.size > 0) {
        // Fallback: pick the first visible heading
        bestId = visibleHeadings.keys().next().value;
      }

      if (bestId && bestId !== activeId) {
        activeId = bestId;
        links.forEach(link => {
          if (link.dataset.target === bestId) {
            link.classList.add('toc-link--active');
          } else {
            link.classList.remove('toc-link--active');
          }
        });
      }
    }, {
      rootMargin: '-100px 0px -60% 0px',
      threshold: [0, 0.5, 1],
    });

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
  }

  // Theme toggle (3 states: light, dark, system)
  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const menu = document.getElementById('theme-menu');
    if (!toggle || !menu) return;

    const html = document.documentElement;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    const VALID = new Set(['light', 'dark', 'system']);
    const stored = localStorage.getItem('theme');
    let preference = VALID.has(stored) ? stored : 'system';

    function effectiveTheme(pref) {
      return pref === 'system' ? (mql.matches ? 'dark' : 'light') : pref;
    }

    function applyTheme() {
      html.setAttribute('data-theme', effectiveTheme(preference));
      html.setAttribute('data-theme-pref', preference);
    }

    function setPreference(pref) {
      preference = pref;
      localStorage.setItem('theme', pref);
      applyTheme();
      updateMenuActiveState();
    }

    function updateMenuActiveState() {
      menu.querySelectorAll('[data-theme-option]').forEach(btn => {
        btn.setAttribute('aria-checked', btn.dataset.themeOption === preference ? 'true' : 'false');
      });
      const iconWrap = toggle.querySelector('.theme-toggle__icon-wrap');
      if (iconWrap) iconWrap.setAttribute('data-mode', preference);
    }

    function openMenu() {
      menu.classList.add('theme-menu--open');
      toggle.setAttribute('aria-expanded', 'true');
      updateMenuActiveState();
    }
    function closeMenu() {
      menu.classList.remove('theme-menu--open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menu.classList.contains('theme-menu--open')) closeMenu();
      else openMenu();
    });

    menu.querySelectorAll('[data-theme-option]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setPreference(btn.dataset.themeOption);
        closeMenu();
      });
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('theme-menu--open')) {
        closeMenu();
        toggle.focus();
      }
    });

    mql.addEventListener('change', () => {
      if (preference === 'system') applyTheme();
    });

    applyTheme();
    updateMenuActiveState();
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

    // Wire left panel category links (they navigate to index.html#archive
    // with a query param that the index page can read to pre-select category)
    document.querySelectorAll('.left-panel__link[data-cat]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = a.dataset.cat;
        // Navigate to index with the category pre-selected
        window.location.href = `./index.html#archive&cat=${encodeURIComponent(cat)}`;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
