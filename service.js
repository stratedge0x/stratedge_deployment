/* ============================================================
   SERVICE PAGE — JavaScript
   Handles: active TOC highlighting, scroll-reveal, navbar
   ============================================================ */
'use strict';

// ── Navbar scroll (already scrolled on load for service pages) ──
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('navbar');
    // Service pages always show the solid nav
    nav?.classList.add('scrolled');

    // Hamburger
    const hamburger = document.getElementById('navHamburger');
    const links = document.getElementById('navLinks');
    hamburger?.addEventListener('click', () => {
        links?.classList.toggle('open');
    });
    links?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => links.classList.remove('open'));
    });

    // ── Active TOC link on scroll ─────────────────────────────
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = [...document.querySelectorAll('.svc-chapter, .svc-pillars-recovery, .recovery-pillar')];

    function updateActiveToc() {
        const scrollY = window.scrollY + 140;
        let current = null;
        sections.forEach(sec => {
            if (sec.offsetTop <= scrollY) current = sec.id;
        });
        tocLinks.forEach(link => {
            const href = link.getAttribute('href')?.slice(1);
            link.classList.toggle('toc-active', href === current);
        });
    }

    window.addEventListener('scroll', updateActiveToc, { passive: true });
    updateActiveToc();

    // ── Scroll-reveal for chapters, pillars, etc. ─────────────
    const revealEls = document.querySelectorAll(
        '.svc-chapter, .svc-pillars-recovery, .recovery-pillar, .svc-pullquote, .svc-cta-banner, .svc-also'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('svc-revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
        revealObserver.observe(el);
    });

    // Inject the revealed state
    document.head.insertAdjacentHTML('beforeend', `
    <style>
      .svc-revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    </style>
  `);

    // ── Stagger recovery pillars ──────────────────────────────
    const rPillars = document.querySelectorAll('.recovery-pillar');
    const rObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('svc-revealed');
                }, i * 150);
                rObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.06 });
    rPillars.forEach(el => rObserver.observe(el));
});
