/* ============================================================
   Profound Physics — App script
   Loads articles.json, renders the featured grid + archive,
   wires the search input and category filter pills, and
   triggers KaTeX's auto-render once content is on the page.
   ============================================================ */

(() => {
  'use strict';

  // ---------- Configuration ----------
  const CATEGORIES = [
    { id: 'all',                    label: 'All',                    blurb: '' },
    { id: 'relativity',             label: 'Relativity',             blurb: 'Special and general — spacetime, geometry, the field equations.' },
    { id: 'mathematics',            label: 'Mathematics',            blurb: 'The mathematical language of physics, treated as physics.' },
    { id: 'general-physics',        label: 'General Physics',        blurb: 'Electromagnetism, photons, gravity, energy, momentum.' },
    { id: 'lagrangian-hamiltonian', label: 'Lagrangian–Hamiltonian', blurb: 'The reformulation of classical mechanics around energy.' },
    { id: 'quantum-mechanics',      label: 'Quantum Mechanics',      blurb: 'The theory of the very small — states, observables, the Schrödinger equation.' },
  ];

  const ARTICLES_URL = './articles.json';

  // ---------- State ----------
  const state = {
    articles: [],
    query: '',
    category: 'all',
  };

  // ---------- DOM lookups (populated after DOMContentLoaded) ----------
  const dom = {};

  // ---------- Utilities ----------
  const escapeHTML = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const escapeAttr = escapeHTML; // identical contract

  const formatDate = (iso) => {
    // YYYY-MM-DD → "Sep 1, 2024"
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || '';
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  };

  const sortByDateDesc = (a, b) => (b.date || '').localeCompare(a.date || '');

  // ---------- Render: hero teaser (single recent article in active category) ----------
  function renderHeroTeaser() {
    if (!dom.heroTeaser) return;
    const inCategory = state.category === 'all'
      ? state.articles
      : state.articles.filter(a => a.category === state.category);
    const recent = inCategory.slice().sort(sortByDateDesc)[0];
    if (!recent) {
      dom.heroTeaser.innerHTML = '';
      return;
    }
    dom.heroTeaser.innerHTML = `
      <span class="badge-coral">Recent</span>
      <h3 class="hero-teaser__title">
        <a href="${escapeAttr(recent.original_url)}" target="_blank" rel="noopener">${escapeHTML(recent.title)}</a>
      </h3>
      <p class="hero-teaser__excerpt">${escapeHTML(recent.excerpt)}</p>
      <p class="hero-teaser__meta">${escapeHTML(formatDate(recent.date))} · ${escapeHTML(categoryLabel(recent.category))}</p>
    `;
  }

  // ---------- Render: category pills ----------
  function renderPills() {
    if (!dom.pills) return;
    dom.pills.innerHTML = CATEGORIES.map(c => `
      <button
        type="button"
        role="tab"
        class="category-tab"
        data-category="${escapeAttr(c.id)}"
        aria-pressed="${state.category === c.id ? 'true' : 'false'}"
        aria-label="Filter: ${escapeAttr(c.label)}"
        tabindex="${state.category === c.id ? '0' : '-1'}">
        ${escapeHTML(c.label)}
      </button>
    `).join('');

    // Wire click + arrow-key navigation
    const buttons = Array.from(dom.pills.querySelectorAll('.category-tab'));
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => setCategory(btn.dataset.category));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = buttons[(i + 1) % buttons.length];
          next.focus();
          setCategory(next.dataset.category);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = buttons[(i - 1 + buttons.length) % buttons.length];
          prev.focus();
          setCategory(prev.dataset.category);
        } else if (e.key === 'Home') {
          e.preventDefault();
          buttons[0].focus();
          setCategory(buttons[0].dataset.category);
        } else if (e.key === 'End') {
          e.preventDefault();
          buttons[buttons.length - 1].focus();
          setCategory(buttons[buttons.length - 1].dataset.category);
        }
      });
    });
  }

  // ---------- Render: featured grid (4 cards, 1 in coral) ----------
  function renderFeatured() {
    if (!dom.featuredGrid) return;
    const featured = state.articles
      .filter(a => a.featured)
      .sort((a, b) => {
        // cornerstone first, then cream-1/2/3 in declared order
        const order = { 'cornerstone': 0, 'cream-1': 1, 'cream-2': 2, 'cream-3': 3 };
        return (order[a.featured_role] ?? 99) - (order[b.featured_role] ?? 99);
      });

    dom.featuredGrid.innerHTML = featured.map((a, i) => {
      const isCoral = a.featured_role === 'cornerstone';
      const tag = isCoral ? 'div' : 'div';
      const cls = isCoral ? 'callout-card-coral' : 'feature-card';
      return `
        <${tag} class="${cls}">
          <span class="feature-card__category">${escapeHTML(categoryLabel(a.category))}</span>
          <h3 class="feature-card__title">
            <a href="${escapeAttr(a.original_url)}" target="_blank" rel="noopener">${escapeHTML(a.title)}</a>
          </h3>
          <p class="feature-card__excerpt">${escapeHTML(a.excerpt)}</p>
          <p class="feature-card__meta">
            <span>${escapeHTML(formatDate(a.date))}</span>
            <span>Read →</span>
          </p>
        </${tag}>
      `;
    }).join('');
  }

  // ---------- Render: archive groups ----------
  function renderArchive() {
    if (!dom.archiveGroups) return;
    const q = state.query.toLowerCase().trim();
    const tokens = q.length ? q.split(/\s+/) : [];
    const activeCategory = state.category;

    // Filter articles per current state
    const matches = state.articles.filter(a => {
      // category gate
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      // query gate: every token must be a substring of title or excerpt
      if (tokens.length === 0) return true;
      const haystack = (a.title + ' ' + a.excerpt).toLowerCase();
      return tokens.every(t => haystack.includes(t));
    });

    // Group by category
    const grouped = {};
    for (const a of matches) {
      (grouped[a.category] = grouped[a.category] || []).push(a);
    }
    // Within each group: sort by date desc
    for (const cat of Object.keys(grouped)) {
      grouped[cat].sort(sortByDateDesc);
    }

    // Build markup. Always show all 5 categories (even if empty) so the user
    // sees the structure of the archive; collapse empty groups but keep their
    // header visible with a "0 articles" count.
    const visibleCats = CATEGORIES.filter(c => c.id !== 'all');
    const groupsMarkup = visibleCats.map(cat => {
      const list = grouped[cat.id] || [];
      const listMarkup = list.length === 0
        ? `<p class="archive-empty">No articles in this category match your search.</p>`
        : `<ul class="archive-list" role="list">
            ${list.map(a => `
              <li class="article-list-item">
                <div class="article-list-item__main">
                  <h4 class="article-list-item__title">
                    <a href="${escapeAttr(a.original_url)}" target="_blank" rel="noopener">${escapeHTML(a.title)}</a>
                  </h4>
                  <p class="article-list-item__excerpt">${escapeHTML(a.excerpt)}</p>
                </div>
                <time class="article-list-item__date" datetime="${escapeAttr(a.date)}">${escapeHTML(formatDate(a.date))}</time>
              </li>
            `).join('')}
          </ul>`;
      return `
        <details class="archive-group" ${list.length > 0 ? 'open' : ''}>
          <summary class="archive-group__summary">
            <span class="archive-group__title">${escapeHTML(cat.label)}</span>
            <span class="archive-group__count">
              ${list.length} ${list.length === 1 ? 'article' : 'articles'}
              <svg class="archive-group__chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </summary>
          ${listMarkup}
        </details>
      `;
    }).join('');

    dom.archiveGroups.innerHTML = groupsMarkup;

    // Update results count for screen readers + visual
    const totalLabel = matches.length === 0
      ? 'No articles match your search.'
      : `Showing ${matches.length} of ${state.articles.length} articles.`;
    if (dom.resultsCount) dom.resultsCount.textContent = totalLabel;
  }

  // ---------- Helpers ----------
  function categoryLabel(id) {
    const c = CATEGORIES.find(c => c.id === id);
    return c ? c.label : id;
  }

  // ---------- State setters ----------
  function setQuery(q) {
    state.query = q;
    renderArchive();
    runKaTeX(dom.archiveGroups);
  }
  function setCategory(id) {
    if (!CATEGORIES.find(c => c.id === id)) return;
    state.category = id;
    renderPills();
    renderHeroTeaser();
    renderArchive();
    runKaTeX(dom.archiveGroups);
    runKaTeX(dom.heroTeaser);
  }

  // ---------- KaTeX ----------
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
      // KaTeX errors are non-fatal
      console.warn('KaTeX render error:', e);
    }
  }

  // ---------- Init ----------
  async function init() {
    // Cache DOM
    dom.searchInput     = document.getElementById('search-input');
    dom.pills           = document.getElementById('category-pills');
    dom.resultsCount    = document.getElementById('results-count');
    dom.featuredGrid    = document.getElementById('featured-grid');
    dom.archiveGroups   = document.getElementById('archive-groups');
    dom.heroTeaser      = document.getElementById('hero-teaser');
    dom.navSearchBtn    = document.getElementById('nav-search-btn');

    // Fetch articles
    let data;
    try {
      const res = await fetch(ARTICLES_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (e) {
      console.error('Failed to load articles.json:', e);
      if (dom.archiveGroups) {
        dom.archiveGroups.innerHTML = `<p class="archive-empty">Could not load the article archive. Try refreshing the page.</p>`;
      }
      return;
    }
    state.articles = (data.articles || []).slice();

    // Wire search input
    if (dom.searchInput) {
      dom.searchInput.addEventListener('input', (e) => {
        setQuery(e.target.value);
      });
      dom.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dom.searchInput.value = '';
          setQuery('');
          dom.searchInput.blur();
        }
      });
    }

    // Wire "Search" affordance in the top nav
    if (dom.navSearchBtn && dom.searchInput) {
      dom.navSearchBtn.addEventListener('click', () => {
        const inputRect = dom.searchInput.getBoundingClientRect();
        // Offset for the sticky nav
        const top = window.scrollY + inputRect.top - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        // Defer focus so the smooth scroll doesn't fight the focus
        setTimeout(() => dom.searchInput.focus({ preventScroll: true }), 320);
      });
    }

    // Wire footer topic links (any [data-cat] anchor inside the footer jumps
    // to the archive and pre-selects the category)
    document.querySelectorAll('a[data-cat]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = a.dataset.cat;
        if (cat) {
          setCategory(cat);
          // Scroll to archive section
          const target = document.getElementById('archive');
          if (target) {
            const top = window.scrollY + target.getBoundingClientRect().top - 80;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      });
    });

    // Initial render
    renderPills();
    renderFeatured();
    renderHeroTeaser();
    renderArchive();

    // Run KaTeX on all dynamic containers
    runKaTeX(dom.featuredGrid);
    runKaTeX(dom.archiveGroups);
    runKaTeX(dom.heroTeaser);
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
