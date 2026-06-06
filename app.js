/* ============================================================
   Profound Physics — App script
   Loads articles.json, renders the archive,
   wires the search input and category filter pills,
   triggers KaTeX's auto-render, and handles the theme toggle.
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

  const escapeAttr = escapeHTML;

  const formatDate = (iso) => {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || '';
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  };

  const sortByDateDesc = (a, b) => (b.date || '').localeCompare(a.date || '');

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

  // ---------- Render: archive groups ----------
  function renderArchive() {
    if (!dom.archiveGroups) return;
    const q = state.query.toLowerCase().trim();
    const tokens = q.length ? q.split(/\s+/) : [];
    const activeCategory = state.category;

    // Filter articles per current state
    const matches = state.articles.filter(a => {
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      if (tokens.length === 0) return true;
      const haystack = (a.title + ' ' + a.excerpt).toLowerCase();
      return tokens.every(t => haystack.includes(t));
    });

    // Group by category
    const grouped = {};
    for (const a of matches) {
      (grouped[a.category] = grouped[a.category] || []).push(a);
    }
    for (const cat of Object.keys(grouped)) {
      grouped[cat].sort(sortByDateDesc);
    }

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
                    <a href="./article.html?slug=${escapeAttr(a.slug)}">${escapeHTML(a.title)}</a>
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
    renderArchive();
    runKaTeX(dom.archiveGroups);
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
      console.warn('KaTeX render error:', e);
    }
  }

  // ---------- Theme toggle (3 states: light, dark, system) ----------
  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const menu = document.getElementById('theme-menu');
    if (!toggle || !menu) return;

    const html = document.documentElement;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    // Resolve the stored preference. Valid values: 'light' | 'dark' | 'system'
    // (anything else, including null, is treated as 'system')
    const VALID = new Set(['light', 'dark', 'system']);
    const stored = localStorage.getItem('theme');
    let preference = VALID.has(stored) ? stored : 'system';

    // The *effective* theme is what the page actually renders.
    // When preference is 'system', the effective theme follows the OS.
    function effectiveTheme(pref) {
      return pref === 'system' ? (mql.matches ? 'dark' : 'light') : pref;
    }

    function applyTheme() {
      const eff = effectiveTheme(preference);
      html.setAttribute('data-theme', eff);
      // Reflect the *preference* (not effective) in the data-pref attribute
      // so CSS can show the right toggle icon for the chosen mode.
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
        const opt = btn.dataset.themeOption;
        btn.setAttribute('aria-checked', opt === preference ? 'true' : 'false');
      });
      // Update the toggle button's icon by toggling visibility classes
      const iconWrap = toggle.querySelector('.theme-toggle__icon-wrap');
      if (iconWrap) {
        iconWrap.setAttribute('data-mode', preference);
      }
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
    function toggleMenu() {
      if (menu.classList.contains('theme-menu--open')) closeMenu();
      else openMenu();
    }

    // Toggle button: open/close the dropdown
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Option buttons: set preference and close
    menu.querySelectorAll('[data-theme-option]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setPreference(btn.dataset.themeOption);
        closeMenu();
      });
    });

    // Click outside closes
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Escape closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('theme-menu--open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Live-update when preference is 'system' and the OS theme changes
    mql.addEventListener('change', () => {
      if (preference === 'system') applyTheme();
    });

    // Initial apply
    applyTheme();
    updateMenuActiveState();
  }

  // ---------- Init ----------
  async function init() {
    // Cache DOM
    dom.searchInput     = document.getElementById('search-input');
    dom.pills           = document.getElementById('category-pills');
    dom.resultsCount    = document.getElementById('results-count');
    dom.archiveGroups   = document.getElementById('archive-groups');
    dom.navSearchBtn    = document.getElementById('nav-search-btn');

    // Init theme toggle
    initThemeToggle();

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

    // Read initial category from URL hash (e.g., #archive&cat=relativity)
    const hashMatch = window.location.hash.match(/cat=([^&]+)/);
    if (hashMatch) {
      const cat = decodeURIComponent(hashMatch[1]);
      if (CATEGORIES.find(c => c.id === cat)) {
        state.category = cat;
      }
    }

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
        const top = window.scrollY + inputRect.top - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        setTimeout(() => dom.searchInput.focus({ preventScroll: true }), 320);
      });
    }

    // Wire footer topic links
    document.querySelectorAll('a[data-cat]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = a.dataset.cat;
        if (cat) {
          setCategory(cat);
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
    renderArchive();

    // Run KaTeX on archive
    runKaTeX(dom.archiveGroups);
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
