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

    // We use an IntersectionObserver to track which section is currently on screen
    let activeId = sections.length > 0 ? sections[0].id : null;

    const tocObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When a section comes into view, mark it as active
                activeId = entry.target.id;
                updateTocLinks(activeId);
            }
        });
    }, {
        // Trigger when a section is 20% down from the top of the viewport
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(sec => {
        if (sec.id) {
            tocObserver.observe(sec);
        }
    });

    function updateTocLinks(id) {
        tocLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const linkId = href.slice(1);
                if (linkId === id) {
                    link.classList.add('toc-active');
                } else {
                    link.classList.remove('toc-active');
                }
            }
        });
    }

    // Set initial active link
    updateTocLinks(activeId);

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

// ── Dropdown nav init for service pages ──────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-dropdown-toggle').forEach(btn => {
        const li = btn.closest('.nav-dropdown');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = li.classList.contains('open');
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
    document.addEventListener('click', () => {
        document.querySelectorAll('.nav-dropdown.open').forEach(el => {
            el.classList.remove('open');
            el.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
    });
});
