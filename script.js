/* ============================================================
   STRATEGE ADVISORY — Interactions & Animations
   ============================================================ */
'use strict';

// ── Typewriter ──────────────────────────────────────────────
const TYPEWRITER_PHRASES_EN = [
  'Strategic Intelligence\nfor the Gulf.',
  'Precision Advisory.\nProtected Investments.',
  'Vision 2040\nAligned Strategy.',
];

const TYPEWRITER_PHRASES_AR = [
  'معرفة استراتيجية\nللخليج.',
  'استشارات دقيقة.\nاستثمارات محمية.',
  'رؤية ٢٠٤٠\nاستراتيجية متوافقة.',
];

class Typewriter {
  constructor(el, phrases, opts = {}) {
    this.el = el;
    this.phrases = phrases;
    this.typeSpeed = opts.typeSpeed || 55;
    this.deleteSpeed = opts.deleteSpeed || 28;
    this.pauseAfter = opts.pauseAfter || 2200;
    this.pauseBefore = opts.pauseBefore || 600;
    this.phraseIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.onComplete = opts.onComplete || null;
    this._doneFirst = false;
  }

  start(delay = 0) {
    setTimeout(() => this._tick(), delay);
  }

  _tick() {
    const phrase = this.phrases[this.phraseIndex];
    const current = phrase.substring(0, this.charIndex);
    // Render with line breaks preserved
    this.el.innerHTML = current.replace(/\n/g, '<br>');

    if (!this.isDeleting) {
      // Typing forward
      if (this.charIndex < phrase.length) {
        this.charIndex++;
        setTimeout(() => this._tick(), this.typeSpeed + (Math.random() * 30 - 15));
      } else {
        // Finished typing a phrase
        if (!this._doneFirst) {
          this._doneFirst = true;
          if (this.onComplete) this.onComplete();
        }
        setTimeout(() => {
          this.isDeleting = true;
          this._tick();
        }, this.pauseAfter);
      }
    } else {
      // Deleting
      if (this.charIndex > 0) {
        this.charIndex--;
        setTimeout(() => this._tick(), this.deleteSpeed);
      } else {
        this.isDeleting = false;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        setTimeout(() => this._tick(), this.pauseBefore);
      }
    }
  }
}

// ── Counter animation ───────────────────────────────────────
function animateCounter(el, target, suffix, duration = 1800) {
  const start = performance.now();
  function update(now) {
    const elapsed = Math.min(now - start, duration);
    const progress = easeOutCubic(elapsed / duration);
    const value = Math.round(progress * target);
    el.textContent = value + suffix;
    if (elapsed < duration) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

// ── Intersection Observer factory ──────────────────────────
function observe(selector, onEnter, options = {}) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { onEnter(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.15, ...options });
  els.forEach(el => io.observe(el));
}

// ── Mouse tracking glow on pillar cards ────────────────────
function initPillarGlow() {
  document.querySelectorAll('.pillar-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
      card.style.setProperty('--mx', x);
      card.style.setProperty('--my', y);
    });
  });
}

// ── Navbar scroll behaviour ────────────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Hamburger & Mobile Menu Logic
  const hamburger = document.getElementById('navHamburger');
  const links = document.getElementById('navLinks');

  // Create overlay if it doesn't exist
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  const toggleMenu = (force) => {
    const isOpen = links.classList.toggle('open', force);
    hamburger?.classList.toggle('active', isOpen);
    overlay?.classList.toggle('visible', isOpen);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // Prevent touch scrolling
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    if (isOpen) {
      // Auto-expand dropdowns on mobile as requested
      links.querySelectorAll('.nav-dropdown').forEach(li => {
        li.classList.add('open');
        li.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'true');
      });
    }
  };

  hamburger?.addEventListener('click', () => toggleMenu());
  overlay?.addEventListener('click', () => toggleMenu(false));

  // Close on link click
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMenu(false));
  });
}

// ── Dropdown nav (Services menu) ───────────────────────────
function initDropdownNav() {
  document.querySelectorAll('.nav-dropdown-toggle').forEach(btn => {
    const li = btn.closest('.nav-dropdown');

    // Click to toggle (mobile + accessibility)
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = li.classList.contains('open');
      // Close any other open dropdowns
      document.querySelectorAll('.nav-dropdown.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        li.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-dropdown.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
    }
  });
}


// ── Smooth active section highlight ────────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.getAttribute('id');
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}

// ── Parallax orbs ──────────────────────────────────────────
function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    orbs.forEach((o, i) => {
      const speed = 0.05 + i * 0.035;
      o.style.transform = `translateY(${sy * speed}px)`;
    });
  }, { passive: true });
}

// ── Contact form ───────────────────────────────────────────
function initForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  if (!form || !btn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI: loading state
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Sending…</span>';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      // Web3Forms free plan doesn't support Turnstile server-side verification.
      // Turnstile still protects the page client-side — we just strip the token
      // before submitting so Web3Forms doesn't treat it as a Pro feature request.
      data.delete('cf-turnstile-response');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        // Success state
        btn.innerHTML = '<span>✓ Request Received</span>';
        btn.style.background = '#2E5E2E';
        btn.style.color = '#AADDAA';
        form.reset();
        if (window.turnstile) window.turnstile.reset();
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 4000);
      } else {
        // Surface the real API error message
        console.error('Web3Forms error:', result);
        throw new Error(result.message || 'Submission failed');
      }

    } catch (err) {
      console.error('Form submission error:', err.message);
      btn.innerHTML = `<span>✗ ${err.message || 'Error — Please retry'}</span>`;
      btn.style.background = '#5E2A2A';
      btn.style.color = '#FFAAAA';
      if (window.turnstile) window.turnstile.reset();
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 5000);
    }
  });
}

// ── DOMContentLoaded ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // 1. Navbar
  initNavbar();
  initDropdownNav();
  initActiveNav();
  initParallax();
  initPillarGlow();
  initForm();

  // 2. Hero entrance sequence
  const label = document.getElementById('heroLabel');
  const subtitle = document.getElementById('heroSubtitle');
  const actions = document.getElementById('heroActions');
  const twText = document.getElementById('typewriterText');

  const isAr = document.documentElement.lang === 'ar';
  const phrases = isAr ? TYPEWRITER_PHRASES_AR : TYPEWRITER_PHRASES_EN;

  // Show label
  setTimeout(() => label?.classList.add('visible'), 400);

  // Start typewriter after label appears
  const tw = new Typewriter(twText, phrases, {
    typeSpeed: 60,
    deleteSpeed: 30,
    pauseAfter: 2800,
    pauseBefore: 500,
    onComplete: () => {
      // Reveal subtitle & CTA after first phrase is typed out
      subtitle?.classList.add('visible');
      actions?.classList.add('visible');
    },
  });
  tw.start(900);

  // 3. Stats counter animation on scroll
  const statCards = document.querySelectorAll('.stat-card');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = Number(el.dataset.delay || 0);
        setTimeout(() => {
          el.classList.add('visible');
          const numEl = el.querySelector('.stat-number');
          const target = parseInt(el.dataset.target || '0');
          const suffix = el.dataset.suffix || '';
          if (numEl && target) animateCounter(numEl, target, suffix);
        }, delay);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

  statCards.forEach(el => statsObserver.observe(el));

  // 4. Pillar cards reveal
  observe('.pillar-card', el => {
    const idx = [...document.querySelectorAll('.pillar-card')].indexOf(el);
    setTimeout(() => el.classList.add('visible'), idx * 120);
  });

  // Solutions for Oman cards reveal
  observe('.solution-card', el => {
    const idx = [...document.querySelectorAll('.solution-card')].indexOf(el);
    setTimeout(() => el.classList.add('visible'), idx * 100);
  });

  // 5. Vision 2040 pillar items
  observe('.vision-pillar-item', el => {
    const items = document.querySelectorAll('.vision-pillar-item');
    items.forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), i * 180);
    });
  });
});
