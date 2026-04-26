/**
 * STRATEGE ADVISORY — GLOBAL CONFIGURATION
 * Central destination for contact details & social media links
 */
const STRATEGE_CONFIG = {
  social: {
    linkedin: 'https://www.linkedin.com/in/stratedge-advisory-om/',
    x: 'https://x.com/StratEdgeOman',
    whatsapp: 'https://api.whatsapp.com/send?phone=96894774000',
  },
  contact: {
    phone_raw: '+96894774000',
    phone_display: '+968 9477 4000'
  }
};

/**
 * Updates all social and contact links across the site.
 */
function initSocialLinks() {
  document.querySelectorAll('a[aria-label="LinkedIn"]').forEach(a => {
    a.href = STRATEGE_CONFIG.social.linkedin;
  });

  document.querySelectorAll('a[aria-label="X (Twitter)"]').forEach(a => {
    a.href = STRATEGE_CONFIG.social.x;
  });

  document.querySelectorAll('.btn-whatsapp, a[aria-label="WhatsApp"]').forEach(a => {
    a.href = STRATEGE_CONFIG.social.whatsapp;
  });

  document.querySelectorAll('.btn-phone, .footer-tel').forEach(a => {
    a.href = `tel:${STRATEGE_CONFIG.contact.phone_raw}`;
    if (a.textContent.includes('968') || a.classList.contains('footer-tel')) {
       const svg = a.querySelector('svg');
       if (svg) {
         a.innerHTML = '';
         a.appendChild(svg);
         a.appendChild(document.createTextNode(' ' + STRATEGE_CONFIG.contact.phone_display));
       } else {
         a.textContent = STRATEGE_CONFIG.contact.phone_display;
       }
    }
  });

  const schemaScript = document.querySelector('script[type="application/ld+json"]');
  if (schemaScript) {
    try {
      const data = JSON.parse(schemaScript.textContent);
      if (data.telephone) data.telephone = STRATEGE_CONFIG.contact.phone_raw;
      if (data.sameAs) {
        data.sameAs = data.sameAs.map(link => {
          if (link.includes('linkedin.com')) return STRATEGE_CONFIG.social.linkedin;
          return link;
        });
      }
      schemaScript.textContent = JSON.stringify(data, null, 2);
    } catch (e) { console.warn('Schema refinement skipped: invalid JSON'); }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSocialLinks();
});
