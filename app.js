/* ============================================================
   Profound Physics — App script
   Loads articles.json, renders topic cards with modal popups,
   wires the search input and category filter pills,
   triggers KaTeX's auto-render, handles the theme toggle,
   and runs the hero equation animation.
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

  // SVG logos for each topic (inline, 48x48 viewBox)
  const TOPIC_ICONS = {
    'relativity': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Light cone: two crossing diagonals with curved spacetime grid -->
      <line x1="24" y1="4" x2="24" y2="44" opacity="0.3"/>
      <line x1="4" y1="24" x2="44" y2="24" opacity="0.3"/>
      <path d="M24 4 L44 44" opacity="0.6"/>
      <path d="M24 4 L4 44" opacity="0.6"/>
      <ellipse cx="24" cy="24" rx="16" ry="6" opacity="0.4"/>
      <ellipse cx="24" cy="24" rx="10" ry="14" opacity="0.4" transform="rotate(30 24 24)"/>
      <ellipse cx="24" cy="24" rx="10" ry="14" opacity="0.4" transform="rotate(-30 24 24)"/>
      <circle cx="24" cy="24" r="2.5" fill="currentColor" stroke="none"/>
    </svg>`,

    'mathematics': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Integral symbol with coordinate axes -->
      <line x1="8" y1="40" x2="8" y2="8"/>
      <line x1="8" y1="40" x2="42" y2="40"/>
      <!-- Arrow heads -->
      <path d="M5 12 L8 8 L11 12"/>
      <path d="M38 37 L42 40 L38 43"/>
      <!-- Integral sign -->
      <path d="M22 12 C18 12 18 16 18 18 L18 30 C18 32 18 36 14 36" stroke-width="2"/>
      <path d="M26 12 C30 12 30 16 30 18 L30 30 C30 32 30 36 34 36" stroke-width="2" opacity="0.4"/>
      <!-- Small tick marks -->
      <line x1="6" y1="32" x2="10" y2="32" opacity="0.4"/>
      <line x1="6" y1="24" x2="10" y2="24" opacity="0.4"/>
      <line x1="6" y1="16" x2="10" y2="16" opacity="0.4"/>
      <line x1="16" y1="38" x2="16" y2="42" opacity="0.4"/>
      <line x1="24" y1="38" x2="24" y2="42" opacity="0.4"/>
      <line x1="32" y1="38" x2="32" y2="42" opacity="0.4"/>
    </svg>`,

    'general-physics': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Atom: nucleus with orbiting electrons -->
      <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none"/>
      <ellipse cx="24" cy="24" rx="18" ry="7"/>
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(60 24 24)"/>
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(-60 24 24)"/>
      <!-- Electron dots -->
      <circle cx="42" cy="24" r="1.8" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="10.2" r="1.8" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="37.8" r="1.8" fill="currentColor" stroke="none"/>
    </svg>`,

    'lagrangian-hamiltonian': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Phase space: closed orbit with coordinate axes -->
      <line x1="6" y1="42" x2="6" y2="6" opacity="0.3"/>
      <line x1="6" y1="42" x2="44" y2="42" opacity="0.3"/>
      <!-- Phase space orbit (closed curve) -->
      <path d="M24 14 C32 14 38 20 38 26 C38 32 32 36 26 36 C20 36 14 32 14 26 C14 20 18 14 24 14 Z" stroke-width="1.8"/>
      <!-- Direction arrow on orbit -->
      <path d="M36 20 L38 22 L35 23" stroke-width="1.5"/>
      <!-- Center dot -->
      <circle cx="24" cy="26" r="1.5" fill="currentColor" stroke="none" opacity="0.4"/>
      <!-- Axis labels (q, p) -->
      <text x="42" y="44" font-size="7" fill="currentColor" stroke="none" font-family="serif" font-style="italic" opacity="0.5">q</text>
      <text x="2" y="8" font-size="7" fill="currentColor" stroke="none" font-family="serif" font-style="italic" opacity="0.5">p</text>
    </svg>`,

    'quantum-mechanics': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Wavefunction: sine wave with probability envelope -->
      <path d="M4 24 C8 24 8 12 12 12 C16 12 16 36 20 36 C24 36 24 12 28 12 C32 12 32 36 36 36 C40 36 40 24 44 24" stroke-width="1.8"/>
      <!-- Probability envelope (dashed) -->
      <path d="M4 24 C10 24 10 10 16 10 C22 10 22 10 24 10 C26 10 26 10 28 10 C34 10 34 24 44 24" stroke-dasharray="2 3" opacity="0.3"/>
      <path d="M4 24 C10 24 10 38 16 38 C22 38 22 38 24 38 C26 38 26 38 28 38 C34 38 34 24 44 24" stroke-dasharray="2 3" opacity="0.3"/>
      <!-- |ψ|² label -->
      <text x="36" y="10" font-size="6" fill="currentColor" stroke="none" font-family="serif" font-style="italic" opacity="0.5">ψ</text>
    </svg>`,
  };

  const ARTICLES_URL = './articles.json';

  // ---------- State ----------
  const state = {
    articles: [],
    query: '',
    category: 'all',
  };

  // ---------- DOM lookups ----------
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

  // ---------- Render: topic cards ----------
  function renderTopicCards() {
    if (!dom.topicCards) return;
    const q = state.query.toLowerCase().trim();
    const tokens = q.length ? q.split(/\s+/) : [];
    const activeCategory = state.category;

    // Filter articles
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

    const visibleCats = CATEGORIES.filter(c => c.id !== 'all');
    const cardsMarkup = visibleCats.map((cat, i) => {
      const list = grouped[cat.id] || [];
      const count = list.length;
      const isActive = count > 0;
      return `
        <button
          type="button"
          class="topic-card${isActive ? '' : ' topic-card--empty'}"
          data-topic="${escapeAttr(cat.id)}"
          aria-label="${escapeAttr(cat.label)} — ${count} articles"
          style="--card-delay: ${1200 + i * 80}ms">
          <div class="topic-card__icon">
            ${TOPIC_ICONS[cat.id] || ''}
          </div>
          <h3 class="topic-card__title">${escapeHTML(cat.label)}</h3>
          <p class="topic-card__blurb">${escapeHTML(cat.blurb)}</p>
          <span class="topic-card__count">
            ${count} ${count === 1 ? 'article' : 'articles'}
            <svg class="topic-card__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </span>
        </button>
      `;
    }).join('');

    dom.topicCards.innerHTML = cardsMarkup;

    // Wire click events
    dom.topicCards.querySelectorAll('.topic-card:not(.topic-card--empty)').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.topic));
    });

    // Update results count
    const totalLabel = matches.length === 0
      ? 'No articles match your search.'
      : `Showing ${matches.length} of ${state.articles.length} articles.`;
    if (dom.resultsCount) dom.resultsCount.textContent = totalLabel;
  }

  // ---------- Modal ----------
  function openModal(topicId) {
    const cat = CATEGORIES.find(c => c.id === topicId);
    if (!cat) return;

    const articles = state.articles
      .filter(a => a.category === topicId)
      .sort(sortByDateDesc);

    // Populate modal
    if (dom.modalIcon) dom.modalIcon.innerHTML = TOPIC_ICONS[topicId] || '';
    if (dom.modalTitle) dom.modalTitle.textContent = cat.label;
    if (dom.modalSubtitle) dom.modalSubtitle.textContent = cat.blurb;

    if (dom.modalList) {
      dom.modalList.innerHTML = articles.map(a => `
        <li class="modal__item">
          <a href="./article.html?slug=${escapeAttr(a.slug)}" class="modal__link">
            <span class="modal__link-title">${escapeHTML(a.title)}</span>
            <time class="modal__link-date" datetime="${escapeAttr(a.date)}">${escapeHTML(formatDate(a.date))}</time>
          </a>
        </li>
      `).join('');
    }

    // Show
    dom.overlay.classList.add('modal-overlay--open');
    dom.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap: focus the close button
    requestAnimationFrame(() => {
      if (dom.modalClose) dom.modalClose.focus();
    });

    // Run KaTeX on the modal content (in case excerpts have math)
    runKaTeX(dom.modalList);
  }

  function closeModal() {
    dom.overlay.classList.remove('modal-overlay--open');
    dom.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initModal() {
    dom.overlay = document.getElementById('modal-overlay');
    dom.modalClose = document.getElementById('modal-close');
    dom.modalTitle = document.getElementById('modal-title');
    dom.modalSubtitle = document.getElementById('modal-subtitle');
    dom.modalIcon = document.getElementById('modal-icon');
    dom.modalList = document.getElementById('modal-list');

    if (!dom.overlay) return;

    // Close button
    if (dom.modalClose) {
      dom.modalClose.addEventListener('click', closeModal);
    }

    // Click outside modal panel closes
    dom.overlay.addEventListener('click', (e) => {
      if (e.target === dom.overlay) closeModal();
    });

    // Escape closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.overlay.classList.contains('modal-overlay--open')) {
        closeModal();
      }
    });
  }

  // ---------- State setters ----------
  function setQuery(q) {
    state.query = q;
    renderTopicCards();
  }

  function setCategory(id) {
    if (!CATEGORIES.find(c => c.id === id)) return;
    state.category = id;
    renderPills();
    renderTopicCards();
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

    const VALID = new Set(['light', 'dark', 'system']);
    const stored = localStorage.getItem('theme');
    let preference = VALID.has(stored) ? stored : 'system';

    function effectiveTheme(pref) {
      return pref === 'system' ? (mql.matches ? 'dark' : 'light') : pref;
    }

    function applyTheme() {
      const eff = effectiveTheme(preference);
      html.setAttribute('data-theme', eff);
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

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    menu.querySelectorAll('[data-theme-option]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setPreference(btn.dataset.themeOption);
        closeMenu();
      });
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
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

  // ---------- Hero equation animation ----------
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Respect reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    const ctx = canvas.getContext('2d');
    let width, height, centerX, centerY;
    let particles = [];
    let animId;

    const EQUATIONS = [
      '∇·E = ρ/ε₀',
      '∇×B = μ₀J + μ₀ε₀∂E/∂t',
      'iℏ ∂ψ/∂t = Ĥψ',
      'Gμν = 8πG Tμν',
      'ds² = −c²dt² + dx²',
      'ℒ = T − V',
      'E = mc²',
      '∂ℒ/∂q − d/dt(∂ℒ/∂q̇) = 0',
      'H = Σ pᵢq̇ᵢ − L',
      'ΔxΔp ≥ ℏ/2',
      'S = k_B ln Ω',
      '∮ E·dl = −dΦ_B/dt',
      'Rμν − ½gμν R = 8πG Tμν',
      'ψ = Ae^{i(kx−ωt)}',
      'F = ma',
      'p = ℏk',
      'E² = (pc)² + (mc²)²',
      '∇²φ = −ρ/ε₀',
      'δS = 0',
      '⟨x|p⟩ = e^{ipx/ℏ}',
    ];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      centerX = width / 2;
      centerY = height / 2;
    }

    function createParticle() {
      // Start near center with slight random offset
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.35;
      const startDist = Math.random() * 40;

      return {
        x: centerX + Math.cos(angle) * startDist,
        y: centerY + Math.sin(angle) * startDist,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: (Math.random() - 0.5) * 0.3,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
        text: EQUATIONS[Math.floor(Math.random() * EQUATIONS.length)],
        fontSize: 11 + Math.random() * 6,
        opacity: 0,
        maxOpacity: 0.04 + Math.random() * 0.08,
        life: 0,
        maxLife: 400 + Math.random() * 600,
      };
    }

    function initParticles() {
      particles = [];
      // Stagger initial particles across their lifecycle
      const count = Math.min(30, Math.floor(width * height / 25000));
      for (let i = 0; i < count; i++) {
        const p = createParticle();
        p.life = Math.random() * p.maxLife;
        particles.push(p);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const textColor = isDark ? 'rgba(250, 249, 245,' : 'rgba(20, 20, 19,';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Fade in/out based on life
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) {
          p.opacity = (lifeRatio / 0.15) * p.maxOpacity;
        } else if (lifeRatio > 0.8) {
          p.opacity = ((1 - lifeRatio) / 0.2) * p.maxOpacity;
        } else {
          p.opacity = p.maxOpacity;
        }

        // Respawn if dead or out of bounds
        if (p.life >= p.maxLife || p.x < -100 || p.x > width + 100 || p.y < -100 || p.y > height + 100) {
          particles[i] = createParticle();
          continue;
        }

        // Draw
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.fontSize}px "AnthropicSerif", "Cormorant Garamond", Georgia, serif`;
        ctx.fillStyle = `${textColor}${p.opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.text, 0, 0);
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    }

    // Init
    resize();
    initParticles();
    draw();

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        initParticles();
      }, 200);
    });

    // Listen for reduced motion changes
    motionQuery.addEventListener('change', () => {
      if (motionQuery.matches) {
        cancelAnimationFrame(animId);
        ctx.clearRect(0, 0, width, height);
      } else {
        initParticles();
        draw();
      }
    });

    // Re-render when theme changes (text color changes)
    const observer = new MutationObserver(() => {
      // Next frame will pick up the new color
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  // ---------- Init ----------
  async function init() {
    // Cache DOM
    dom.searchInput     = document.getElementById('search-input');
    dom.pills           = document.getElementById('category-pills');
    dom.resultsCount    = document.getElementById('results-count');
    dom.topicCards      = document.getElementById('topic-cards');
    dom.navSearchBtn    = document.getElementById('nav-search-btn');

    // Init theme toggle
    initThemeToggle();

    // Init modal
    initModal();

    // Fetch articles
    let data;
    try {
      const res = await fetch(ARTICLES_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (e) {
      console.error('Failed to load articles.json:', e);
      if (dom.topicCards) {
        dom.topicCards.innerHTML = `<p class="archive-empty">Could not load the article archive. Try refreshing the page.</p>`;
      }
      return;
    }
    state.articles = (data.articles || []).slice();

    // Read initial category from URL hash
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
    renderTopicCards();

    // Start hero canvas animation
    initHeroCanvas();
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
