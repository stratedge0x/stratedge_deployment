/* ============================================================
   STRATEGE ADVISORY — Interactions & Animations
   ============================================================ */
'use strict';

// ── Typewriter ──────────────────────────────────────────────
const TYPEWRITER_PHRASES = [
  'Strategic Intelligence\nfor the Gulf.',
  'Precision Advisory.\nProtected Investments.',
  'Vision 2040\nAligned Strategy.',
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

  // Hamburger
  const hamburger = document.getElementById('navHamburger');
  const links = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  // Close on link click
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
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

    // Validate Cloudflare Turnstile token is present
    const tokenInput = form.querySelector('[name="cf-turnstile-response"]');
    const token = tokenInput?.value;
    if (!token) {
      showStatus('⚠ Please complete the security check.', '#8B7A3A');
      return;
    }

    // UI: loading state
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Sending…</span>';
    btn.disabled = true;

    try {
      const data = new FormData(form);

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
        // Reset Turnstile widget for a fresh submission
        if (window.turnstile) window.turnstile.reset();
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error(result.message || 'Submission failed');
      }

    } catch (err) {
      console.error('Form error:', err);
      btn.innerHTML = '<span>✗ Error — Please retry</span>';
      btn.style.background = '#5E2A2A';
      btn.style.color = '#FFAAAA';
      if (window.turnstile) window.turnstile.reset();
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 3500);
    }
  });

  function showStatus(msg, color) {
    const el = document.createElement('p');
    el.textContent = msg;
    el.style.cssText = `color:${color};font-size:0.8rem;margin-top:0.75rem;letter-spacing:0.05em;`;
    el.id = 'formStatus';
    document.getElementById('formStatus')?.remove();
    form.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}


// ── DOMContentLoaded ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // 1. Navbar
  initNavbar();
  initActiveNav();
  initParallax();
  initPillarGlow();
  initForm();

  // 2. Hero entrance sequence
  const label = document.getElementById('heroLabel');
  const subtitle = document.getElementById('heroSubtitle');
  const actions = document.getElementById('heroActions');
  const twText = document.getElementById('typewriterText');

  // Show label
  setTimeout(() => label?.classList.add('visible'), 400);

  // Start typewriter after label appears
  const tw = new Typewriter(twText, TYPEWRITER_PHRASES, {
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

  // 5. Vision 2040 pillar items
  observe('.vision-pillar-item', el => {
    const items = document.querySelectorAll('.vision-pillar-item');
    items.forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), i * 180);
    });
  });
});
