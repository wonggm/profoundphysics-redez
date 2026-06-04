/* ============================================================
   Profound Physics — Per-article page renderer
   Reads ?slug=<slug> from the URL, looks up the article in
   articles.json, and renders a long-form reading page.
   The canonical body lives on profoundphysics.com — this page
   serves as a stable deep link with a coral CTA to the original.
   ============================================================ */

(() => {
  'use strict';

  const ARTICLES_URL = './articles.json';

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

  function renderArticle(article, all) {
    document.title = `${article.title} — Profound Physics`;

    // Find next/prev by date within the same category
    const sameCat = all.filter(a => a.category === article.category).sort((a, b) => a.date.localeCompare(b.date));
    const idx = sameCat.findIndex(a => a.slug === article.slug);
    const next = idx >= 0 && idx < sameCat.length - 1 ? sameCat[idx + 1] : null;
    const prev = idx > 0 ? sameCat[idx - 1] : null;

    const navNext = document.getElementById('article-nav-next');
    if (navNext) {
      navNext.innerHTML = next
        ? `<a href="./article.html?slug=${escapeAttr(next.slug)}">Next: ${escapeHTML(next.title)} →</a>`
        : '';
    }

    const content = document.getElementById('article-content');
    if (content) {
      content.innerHTML = `
        <p class="article-page__eyebrow">${escapeHTML(categoryLabel(article.category))}</p>
        <h1 class="article-page__title">${escapeHTML(article.title)}</h1>
        <div class="article-page__meta">
          <span>Published ${escapeHTML(formatDate(article.date))}</span>
          <span>·</span>
          <span>Originally on <a href="${escapeAttr(article.original_url)}" target="_blank" rel="noopener">profoundphysics.com</a></span>
        </div>
        <div class="article-page__body">
          <p>${escapeHTML(article.excerpt)}</p>
          <p>This is a redesigned reading entry for the article. The full piece — with figures, embedded math, and worked examples — lives at
          <a href="${escapeAttr(article.original_url)}" target="_blank" rel="noopener">profoundphysics.com</a>.
          Click through to read it on the original site.</p>

          <blockquote>The archive preserves the article as a card-catalogue entry: a stable, citable URL, an excerpt, and a deep link to the canonical source. The math typesets on the original site; here, only the excerpt's inline TeX renders.</blockquote>

          ${prev ? `<p><em>Previous in ${escapeHTML(categoryLabel(article.category))}: <a href="./article.html?slug=${escapeAttr(prev.slug)}">${escapeHTML(prev.title)}</a></em></p>` : ''}
          ${next ? `<p><em>Next in ${escapeHTML(categoryLabel(article.category))}: <a href="./article.html?slug=${escapeAttr(next.slug)}">${escapeHTML(next.title)}</a></em></p>` : ''}
        </div>

        <div class="article-page__cta">
          <h2 class="article-page__cta-heading">Read the full piece</h2>
          <p>The article body, with all math, figures, and worked examples, lives at the original site.</p>
          <a class="button-primary" href="${escapeAttr(article.original_url)}" target="_blank" rel="noopener">Open on profoundphysics.com →</a>
        </div>
      `;
      runKaTeX(content);
    }
  }

  async function init() {
    const slug = getSlug();
    if (!slug) { renderNotFound(); return; }

    let data;
    try {
      const res = await fetch(ARTICLES_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (e) {
      console.error('Failed to load articles.json:', e);
      renderNotFound();
      return;
    }

    const all = data.articles || [];
    const article = all.find(a => a.slug === slug);
    if (!article) { renderNotFound(); return; }
    renderArticle(article, all);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
