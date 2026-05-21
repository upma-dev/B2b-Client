// Anchor scroll behavior moved from `script.js` to its own module.
function initAnchorScrollOffset() {
  const header = document.getElementById('header');
  const headerHeight = header ? header.offsetHeight : 80;
  let heroHidden = false;

  function hideHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    hero.style.display = 'none';
    hero.setAttribute('aria-hidden', 'true');
    heroHidden = true;
  }

  function showHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    hero.style.display = '';
    hero.removeAttribute('aria-hidden');
    heroHidden = false;
  }

  function hideHomeOnlySections() {
    hideHero();
    const homeStats = document.getElementById('home-stats');
    if (homeStats) {
      homeStats.style.display = 'none';
      homeStats.setAttribute('aria-hidden', 'true');
    }
  }

  function showHomeOnlySections() {
    showHero();
    const homeStats = document.getElementById('home-stats');
    if (homeStats) {
      homeStats.style.display = '';
      homeStats.removeAttribute('aria-hidden');
    }
  }

  window.hideHomeOnlySections = hideHomeOnlySections;
  window.showHomeOnlySections = showHomeOnlySections;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return; // ignore empty anchors

    // If the anchor has an inline onclick handler (e.g. showProjectDetails), skip
    // letting that handler control scrolling to avoid double/conflicting scrolls.
    if (a.hasAttribute('onclick')) return;

    a.addEventListener('click', (e) => {
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();

        // Hide home-only sections first, then recalc target position
        if (targetId && targetId !== 'home') {
          hideHomeOnlySections();
        } else {
          showHomeOnlySections();
        }

        requestAnimationFrame(() => {
          const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
          window.scrollTo({ top, behavior: 'smooth' });
        });

        // Update the URL hash without jumping
        history.replaceState(null, '', '#' + targetId);
      }
    });
  });
}

// Initialize after DOMContentLoaded to ensure header dimensions are correct
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof initAnchorScrollOffset === 'function') initAnchorScrollOffset();

    // On load, hide hero if URL hash is not #home (or empty)
    const initialHash = window.location.hash ? window.location.hash.replace('#', '') : '';
    const hero = document.querySelector('.hero');
    function hideHeroOnLoad() {
      if (hero) {
        hero.style.display = 'none';
        hero.setAttribute('aria-hidden', 'true');
      }
    }

    if (initialHash && initialHash !== 'home') {
      if (typeof window.hideHomeOnlySections === 'function') {
        window.hideHomeOnlySections();
      }
      // scroll to the target with offset after layout update
      requestAnimationFrame(() => {
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 80;
        const target = document.getElementById(initialHash);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
          window.scrollTo({ top, behavior: 'auto' });
        }
      });
    } else {
      if (typeof window.showHomeOnlySections === 'function') {
        window.showHomeOnlySections();
      }
    }

    // If the user navigates history (back/forward), update hero visibility
    window.addEventListener('hashchange', () => {
      const h = window.location.hash ? window.location.hash.replace('#', '') : '';
      if (h && h !== 'home') {
        hideHomeOnlySections();
      } else {
        showHomeOnlySections();
      }
    });
  }, 10);
});
