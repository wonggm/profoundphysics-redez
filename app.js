/* ============================================================
   Profound Physics — App script
   Loads articles.json, renders topic cards with modal popups,
   wires the search input, triggers KaTeX's auto-render,
   handles the theme toggle, and runs the hero equation animation.
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
      <line x1="8" y1="40" x2="8" y2="8"/>
      <line x1="8" y1="40" x2="42" y2="40"/>
      <path d="M5 12 L8 8 L11 12"/>
      <path d="M38 37 L42 40 L38 43"/>
      <path d="M22 12 C18 12 18 16 18 18 L18 30 C18 32 18 36 14 36" stroke-width="2"/>
      <path d="M26 12 C30 12 30 16 30 18 L30 30 C30 32 30 36 34 36" stroke-width="2" opacity="0.4"/>
      <line x1="6" y1="32" x2="10" y2="32" opacity="0.4"/>
      <line x1="6" y1="24" x2="10" y2="24" opacity="0.4"/>
      <line x1="6" y1="16" x2="10" y2="16" opacity="0.4"/>
      <line x1="16" y1="38" x2="16" y2="42" opacity="0.4"/>
      <line x1="24" y1="38" x2="24" y2="42" opacity="0.4"/>
      <line x1="32" y1="38" x2="32" y2="42" opacity="0.4"/>
    </svg>`,

    'general-physics': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none"/>
      <ellipse cx="24" cy="24" rx="18" ry="7"/>
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(60 24 24)"/>
      <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(-60 24 24)"/>
      <circle cx="42" cy="24" r="1.8" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="10.2" r="1.8" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="37.8" r="1.8" fill="currentColor" stroke="none"/>
    </svg>`,

    'lagrangian-hamiltonian': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="6" y1="42" x2="6" y2="6" opacity="0.3"/>
      <line x1="6" y1="42" x2="44" y2="42" opacity="0.3"/>
      <path d="M24 14 C32 14 38 20 38 26 C38 32 32 36 26 36 C20 36 14 32 14 26 C14 20 18 14 24 14 Z" stroke-width="1.8"/>
      <path d="M36 20 L38 22 L35 23" stroke-width="1.5"/>
      <circle cx="24" cy="26" r="1.5" fill="currentColor" stroke="none" opacity="0.4"/>
      <text x="42" y="44" font-size="7" fill="currentColor" stroke="none" font-family="serif" font-style="italic" opacity="0.5">q</text>
      <text x="2" y="8" font-size="7" fill="currentColor" stroke="none" font-family="serif" font-style="italic" opacity="0.5">p</text>
    </svg>`,

    'quantum-mechanics': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 24 C8 24 8 12 12 12 C16 12 16 36 20 36 C24 36 24 12 28 12 C32 12 32 36 36 36 C40 36 40 24 44 24" stroke-width="1.8"/>
      <path d="M4 24 C10 24 10 10 16 10 C22 10 22 10 24 10 C26 10 26 10 28 10 C34 10 34 24 44 24" stroke-dasharray="2 3" opacity="0.3"/>
      <path d="M4 24 C10 24 10 38 16 38 C22 38 22 38 24 38 C26 38 26 38 28 38 C34 38 34 24 44 24" stroke-dasharray="2 3" opacity="0.3"/>
      <text x="36" y="10" font-size="6" fill="currentColor" stroke="none" font-family="serif" font-style="italic" opacity="0.5">ψ</text>
    </svg>`,
  };

  const ARTICLES_URL = './articles.json';

  // ---------- State ----------
  const state = {
    articles: [],
    query: '',
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

  // ---------- Render: topic cards ----------
  function renderTopicCards() {
    if (!dom.topicCards) return;

    const q = state.query.toLowerCase().trim();
    const tokens = q.length ? q.split(/\s+/) : [];

    // Filter articles by search query
    const matches = state.articles.filter(a => {
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
      const dimmed = tokens.length > 0 && count === 0;
      return `
        <button
          type="button"
          class="topic-card${count > 0 ? '' : ' topic-card--empty'}${dimmed ? ' topic-card--dimmed' : ''}"
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

    // Wire click events (only for cards with matching articles)
    dom.topicCards.querySelectorAll('.topic-card:not(.topic-card--empty)').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.topic));
    });
  }

  // ---------- Modal ----------
  function openModal(topicId) {
    const cat = CATEGORIES.find(c => c.id === topicId);
    if (!cat) return;

    // Filter by search query too
    const q = state.query.toLowerCase().trim();
    const tokens = q.length ? q.split(/\s+/) : [];

    const articles = state.articles
      .filter(a => {
        if (a.category !== topicId) return false;
        if (tokens.length === 0) return true;
        const haystack = (a.title + ' ' + a.excerpt).toLowerCase();
        return tokens.every(t => haystack.includes(t));
      })
      .sort(sortByDateDesc);

    // Populate modal
    if (dom.modalIcon) dom.modalIcon.innerHTML = TOPIC_ICONS[topicId] || '';
    if (dom.modalTitle) dom.modalTitle.textContent = cat.label;
    if (dom.modalSubtitle) {
      dom.modalSubtitle.textContent = tokens.length > 0
        ? `${articles.length} matching article${articles.length !== 1 ? 's' : ''}`
        : cat.blurb;
    }

    if (dom.modalList) {
      if (articles.length === 0) {
        dom.modalList.innerHTML = '<li class="modal__empty">No articles match your search.</li>';
      } else {
        dom.modalList.innerHTML = articles.map(a => `
          <li class="modal__item">
            <a href="./article.html?slug=${escapeAttr(a.slug)}" class="modal__link">
              <span class="modal__link-title">${escapeHTML(a.title)}</span>
              <time class="modal__link-date" datetime="${escapeAttr(a.date)}">${escapeHTML(formatDate(a.date))}</time>
            </a>
          </li>
        `).join('');
      }
    }

    // Show
    dom.overlay.classList.add('modal-overlay--open');
    dom.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      if (dom.modalClose) dom.modalClose.focus();
    });

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

    if (dom.modalClose) {
      dom.modalClose.addEventListener('click', closeModal);
    }

    dom.overlay.addEventListener('click', (e) => {
      if (e.target === dom.overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.overlay.classList.contains('modal-overlay--open')) {
        closeModal();
      }
    });
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

  // ---------- Hero equation animation (one-time explosion + hover) ----------
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    const ctx = canvas.getContext('2d');
    let width, height, centerX, centerY;
    let particles = [];
    let animId = null;
    let animDone = false;
    let mouseX = -9999, mouseY = -9999;
    let mouseActive = false;

    const EQUATIONS = [
      '∇·E = ρ/ε₀', '∇×B = μ₀J + μ₀ε₀∂E/∂t', 'iℏ ∂ψ/∂t = Ĥψ',
      'Gμν = 8πG Tμν', 'ds² = −c²dt² + dx²', 'ℒ = T − V',
      'E = mc²', '∂ℒ/∂q − d/dt(∂ℒ/∂q̇) = 0', 'H = Σ pᵢq̇ᵢ − L',
      'ΔxΔp ≥ ℏ/2', 'S = k_B ln Ω', '∮ E·dl = −dΦ_B/dt',
      'Rμν − ½gμν R = 8πG Tμν', 'ψ = Ae^{i(kx−ωt)}', 'F = ma',
      'p = ℏk', 'E² = (pc)² + (mc²)²', '∇²φ = −ρ/ε₀',
      'δS = 0', '⟨x|p⟩ = e^{ipx/ℏ}', '∂²u/∂t² = c²∇²u',
      'F = −∇V', 'dS ≥ δQ/T', 'λ = h/p',
    ];

    const FONT = '"Caveat", cursive';

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

    function createParticle(index, total) {
      // Golden-angle spiral for even distribution
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const angle = index * goldenAngle;
      const maxR = Math.min(width, height) * 0.48;
      const r = Math.sqrt((index + 1) / total) * maxR;

      const targetX = centerX + Math.cos(angle) * r;
      const targetY = centerY + Math.sin(angle) * r;

      // Stagger: outer particles start later
      const delay = Math.floor((index / total) * 40 + Math.random() * 20);

      return {
        x: centerX,
        y: centerY,
        targetX,
        targetY,
        offsetX: 0,
        offsetY: 0,
        delay,
        started: false,
        progress: 0,
        text: EQUATIONS[index % EQUATIONS.length],
        fontSize: 20 + Math.random() * 14, // 20-34px
        rotation: (Math.random() - 0.5) * 0.2,
        opacity: 0,
        maxOpacity: 0.07 + Math.random() * 0.08,
      };
    }

    function initParticles() {
      particles = [];
      animDone = false;
      const count = Math.min(26, Math.max(14, Math.floor(width * height / 35000)));
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(i, count));
      }
    }

    function drawPencilText(text, x, y, fontSize, opacity, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.font = `500 ${fontSize}px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const r = isDark ? 240 : 40, g = isDark ? 238 : 40, b = isDark ? 230 : 35;

      // Layer 1: Soft pencil shadow
      ctx.fillStyle = `rgba(${r},${g},${b},${opacity * 0.35})`;
      ctx.shadowColor = `rgba(${r},${g},${b},${opacity * 0.15})`;
      ctx.shadowBlur = fontSize * 0.12;
      ctx.fillText(text, 0.5, 0.5);

      // Layer 2: Main stroke
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(${r},${g},${b},${opacity * 0.85})`;
      ctx.fillText(text, 0, 0);

      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      let allSettled = true;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Wait for stagger delay
        if (!p.started) {
          p.delay--;
          if (p.delay <= 0) {
            p.started = true;
          } else {
            allSettled = false;
            continue;
          }
        }

        // Explosion progress (ease-out cubic, ~80 frames to complete)
        if (p.progress < 1) {
          p.progress = Math.min(1, p.progress + 0.013);
          allSettled = false;
        }

        const ease = 1 - Math.pow(1 - p.progress, 3);

        // Lerp from center to target
        const baseX = centerX + (p.targetX - centerX) * ease;
        const baseY = centerY + (p.targetY - centerY) * ease;

        // Hover repulsion
        if (mouseActive) {
          const dx = (baseX + p.offsetX) - mouseX;
          const dy = (baseY + p.offsetY) - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = 140;

          if (dist < repelRadius && dist > 1) {
            const force = (1 - dist / repelRadius) * 18;
            p.offsetX += (dx / dist) * force;
            p.offsetY += (dy / dist) * force;
          }
        }

        // Spring return
        p.offsetX *= 0.9;
        p.offsetY *= 0.9;

        const finalX = baseX + p.offsetX;
        const finalY = baseY + p.offsetY;

        // Opacity: fade in during first 40% of progress
        p.opacity = p.maxOpacity * Math.min(1, p.progress * 2.5);

        if (Math.abs(p.offsetX) > 0.2 || Math.abs(p.offsetY) > 0.2 || p.progress < 1) {
          allSettled = false;
        }

        if (p.opacity < 0.003) continue;

        drawPencilText(p.text, finalX, finalY, p.fontSize, p.opacity, p.rotation);
      }

      if (allSettled && !animDone) {
        animDone = true;
      }

      // Keep animating while exploding or while mouse interaction is active
      if (!animDone || mouseActive) {
        animId = requestAnimationFrame(draw);
      } else {
        animId = null;
      }
    }

    function ensureAnimating() {
      if (!animId) {
        animId = requestAnimationFrame(draw);
      }
    }

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
      ensureAnimating();
    });

    canvas.addEventListener('mouseleave', () => {
      mouseActive = false;
      mouseX = -9999;
      mouseY = -9999;
      ensureAnimating();
      // Continue until springs settle
      const check = setInterval(() => {
        const anyOffset = particles.some(p => Math.abs(p.offsetX) > 0.2 || Math.abs(p.offsetY) > 0.2);
        if (!anyOffset) {
          clearInterval(check);
        } else {
          ensureAnimating();
        }
      }, 80);
    });

    // Init
    resize();
    initParticles();
    animId = requestAnimationFrame(draw);

    // Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        initParticles();
        animId = requestAnimationFrame(draw);
      }, 200);
    });

    // Reduced motion
    motionQuery.addEventListener('change', () => {
      if (motionQuery.matches) {
        if (animId) cancelAnimationFrame(animId);
        ctx.clearRect(0, 0, width, height);
      }
    });
  }

  // ---------- Init ----------
  async function init() {
    // Cache DOM
    dom.topicCards     = document.getElementById('topic-cards');
    dom.navSearchInput = document.getElementById('nav-search-input');

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

    // Wire search input
    if (dom.navSearchInput) {
      dom.navSearchInput.addEventListener('input', (e) => {
        state.query = e.target.value;
        renderTopicCards();
      });
      dom.navSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dom.navSearchInput.value = '';
          state.query = '';
          renderTopicCards();
          dom.navSearchInput.blur();
        }
      });
    }

    // Wire footer topic links → scroll to archive
    document.querySelectorAll('a[data-cat]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('archive');
        if (target) {
          const top = window.scrollY + target.getBoundingClientRect().top - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    // Initial render
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
