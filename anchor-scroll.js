// anchor-scroll.js — Enhanced smooth anchor scrolling with proper section visibility

function initAnchorScrollOffset() {
  const header = document.getElementById('header');
  const headerHeight = header ? header.offsetHeight : 80;

  // Container IDs used to inject/load sections from `index.html`
  const containers = [
    'hero-container', 'stats-container', 'projects-container',
    'calculator-container', 'rental-container', 'progress-container', 'media-container',
    'jv-container', 'contact-container'
  ];

  // Hide all container elements
  function hideAllSections() {
    containers.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
      }
    });
    // Also hide static floorplans section if present
    const fp = document.getElementById('floorplans');
    if (fp) { fp.style.display = 'none'; fp.setAttribute('aria-hidden', 'true'); }
  }

  // Show all container elements
  function showAllSections() {
    containers.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = '';
        el.removeAttribute('aria-hidden');
      }
    });
    const fp = document.getElementById('floorplans');
    if (fp) { fp.style.display = ''; fp.removeAttribute('aria-hidden'); }
  }

  // Show only the container that contains the target element (or the static section)
  function showOnlySection(sectionSelector) {
    const target = document.querySelector(sectionSelector);
    // find container that holds the target (closest ancestor with id ending '-container')
    let containerEl = null;
    if (target) containerEl = target.closest('[id$="-container"]');
    // if target is a top-level static section (like #floorplans), use that directly
    if (!containerEl) containerEl = document.getElementById(sectionSelector.replace('#', '')) || null;

    hideAllSections();
    if (containerEl) {
      containerEl.style.display = '';
      containerEl.removeAttribute('aria-hidden');
    } else if (target) {
      // fallback: show the element itself
      target.style.display = '';
      target.removeAttribute('aria-hidden');
    }
  }

  window.hideAllSections = hideAllSections;
  window.showAllSections = showAllSections;
  window.showOnlySection = showOnlySection;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    if (a.hasAttribute('onclick')) return;

    a.addEventListener('click', (e) => {
      const targetId = href.slice(1);
      e.preventDefault();

      // Wait up to 800ms for section to exist (sections are loaded dynamically)
      const start = Date.now();
      (function waitForTarget(){
        const target = document.getElementById(targetId);
        if (!target && (Date.now() - start) < 800) {
          return setTimeout(waitForTarget, 60);
        }
        

        // If still not found, abort
        if (!target) return;

        // Navigate to section (show container first)
        if (targetId === 'home') {
          showAllSections();
        } else {
          showOnlySection('#' + targetId);
        }

        requestAnimationFrame(() => {
          // Prefer scrolling to the parent container to avoid header overlap
          let containerEl = target ? target.closest('[id$="-container"]') : null;
          if (!containerEl) containerEl = document.getElementById(targetId + '-container');
          const hdr = document.getElementById('header');
          const hdrH = hdr ? hdr.offsetHeight : 80;
          const elToMeasure = containerEl || target;
          if (!elToMeasure) return;
          const top = elToMeasure.getBoundingClientRect().top + window.pageYOffset - hdrH - 12;
          window.scrollTo({ top, behavior: 'smooth' });
        });

        history.replaceState(null, '', '#' + targetId);
      })();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof initAnchorScrollOffset === 'function') initAnchorScrollOffset();

    const initialHash = window.location.hash ? window.location.hash.replace('#', '') : '';

    // Helper: wait for an element by id (with timeout)
    function waitForElement(id, timeout = 1200) {
      return new Promise((resolve) => {
        const start = Date.now();
        (function check(){
          const el = document.getElementById(id);
          if (el) return resolve(el);
          if ((Date.now() - start) > timeout) return resolve(null);
          setTimeout(check, 60);
        })();
      });
    }

    // On page load, check if there's a hash and wait for the section to be present
    (async function handleInitialHash(){
      if (initialHash && initialHash !== 'home') {
        const target = await waitForElement(initialHash, 1500);
        if (target) {
          if (typeof window.showOnlySection === 'function') {
            window.showOnlySection('#' + initialHash);
          }
          requestAnimationFrame(() => {
            let containerEl = target.closest('[id$="-container"]') || document.getElementById(initialHash + '-container');
            const header = document.getElementById('header');
            const headerHeight = header ? header.offsetHeight : 80;
            const elToMeasure = containerEl || target;
            const top = elToMeasure.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
            window.scrollTo({ top, behavior: 'auto' });
          });
          return;
        }
      }
      if (typeof window.showAllSections === 'function') window.showAllSections();
    })();

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      const h = window.location.hash ? window.location.hash.replace('#', '') : '';
      if (h && h !== 'home') {
        if (typeof window.showOnlySection === 'function') {
          window.showOnlySection('#' + h);
        }
      } else {
        if (typeof window.showAllSections === 'function') window.showAllSections();
      }
    });
  }, 10);
});