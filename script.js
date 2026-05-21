/* Urban Lease - Enhanced JavaScript with 3D Effects & Smooth Interactions */

// Wait for sections to load FIRST, then initialize all components
async function initializeApp() {
  // Wait a bit for sections to be loaded
  await new Promise(resolve => {
    if (document.querySelectorAll('#header-container [class*="header"]').length > 0) {
      resolve();
    } else {
      setTimeout(() => resolve(), 500);
    }
  });

  // Now initialize all components
  initCustomCursor();
  initSmoothScroll();
  initNavbar();
  initAnchorScrollOffset();
  initHeroSlider();
  initHeroParallax();
  initCounters();
  initProjectsSlider();
  initProjectCard3D();
  initFloorPlans();
  initTestimonials();
  initVideoModal();
  initScrollReveal();
  initPartnerCalculator();
  initRentalHub();
  initProgressTimeline();
  initMediaCenter();
  initPreloader(); // Initialize preloader LAST - it hides after sections load
}

document.addEventListener('DOMContentLoaded', initializeApp);

/* =============================================
   CUSTOM CURSOR
   ============================================= */
function initCustomCursor() {
  // Touch devices skip cursor
  if ('ontouchstart' in window) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100;  // mouse position
  let rx = -100, ry = -100;  // ring position (lagged)
  let raf;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth ring lag using rAF
  function animateRing() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const interactiveEls = document.querySelectorAll('a, button, input, select, textarea, .project-card, .nav-arrow, .slider-dot, .progress-tab, .floorplan-tab, .testimonials-dot, .play-btn-wrapper, .dropdown-item, .media-card, .partner-range-slider');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('active');
      if (el.classList.contains('project-card')) {
        ring.classList.add('hovering-card');
      } else {
        ring.classList.add('active');
      }
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('active');
      ring.classList.remove('active', 'hovering-card');
    });
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}

/* =============================================
   SMOOTH SCROLL (Lenis-inspired, pure JS)
   ============================================= */
function initSmoothScroll() {
  // We let CSS handle scroll-behavior smooth for anchor clicks
  // and add a momentum overlay for wheel events
  let current = window.scrollY;
  let target = window.scrollY;
  let ease = 0.1;
  let ticking = false;

  // Only apply on desktop
  if ('ontouchstart' in window) return;

  // We use a simpler approach: intercept wheel events for smooth momentum
  // but keep native scroll so scrollbar / anchors still work
  // Actually, to avoid complexity with fixed elements, we'll use:
  // CSS scroll-behavior + enhanced anchor offset already in anchor-scroll.js
  // Here we add a "scroll progress" indicator and section fade effects

  // Scroll progress bar
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(90deg, var(--primary-light), var(--accent));
    z-index: 99997; transition: width 0.1s linear; pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrolled / total) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });
}

/* =============================================
   PRELOADER
   ============================================= */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  function hidePreloader() {
    if (!preloader || preloader.classList.contains('fade-out')) return;
    preloader.classList.add('fade-out');
    setTimeout(() => { preloader.remove(); }, 700);
  }
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 900);
}

/* =============================================
   STICKY NAVBAR
   ============================================= */
function initNavbar() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('mobile-open');
      // Reset dropdowns when closing menu
      if (!hamburger.classList.contains('open')) {
        document.querySelectorAll('.nav-item.dropdown').forEach(dropdown => {
          dropdown.classList.remove('mobile-expanded');
        });
      }
    });

    // Close mobile menu when clicking normal links
    navLinks.querySelectorAll('.nav-link:not(.dropdown > a), .btn, .dropdown-item a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('mobile-open');
      });
    });

    // Handle dropdown toggle on mobile
    navLinks.querySelectorAll('.nav-item.dropdown > a').forEach(dropdownToggle => {
      dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault(); // Prevent scrolling to #projects instantly
          dropdownToggle.parentElement.classList.toggle('mobile-expanded');
        }
      });
    });
  }
}

/* =============================================
   HERO SLIDER
   ============================================= */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slides.length) return;

  let currentSlideIndex = 0;
  let slideInterval;
  const slideDuration = 6500;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlideIndex = index;
  }

  function startSlideTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => showSlide((currentSlideIndex + 1) % slides.length), slideDuration);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => { showSlide(idx); startSlideTimer(); });
  });

  startSlideTimer();
}

/* =============================================
   HERO PARALLAX ON MOUSE MOVE
   ============================================= */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero || 'ontouchstart' in window) return;

  let ticking = false;

  hero.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (e.clientX - rect.left - cx) / cx; // -1 to 1
      const dy = (e.clientY - rect.top - cy) / cy;

      const activeBg = hero.querySelector('.hero-slide.active .hero-slide-bg');
      if (activeBg) {
        activeBg.style.transform = `scale(1) translate(${dx * -12}px, ${dy * -8}px)`;
      }
      ticking = false;
    });
  });

  hero.addEventListener('mouseleave', () => {
    const activeBg = hero.querySelector('.hero-slide.active .hero-slide-bg');
    if (activeBg) activeBg.style.transform = 'scale(1) translate(0,0)';
  });
}

/* =============================================
   COUNTERS
   ============================================= */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.target, 10));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  statNumbers.forEach(n => observer.observe(n));
}

function animateCounter(el, target) {
  let start = 0;
  const duration = 2200;
  const increment = target > 500 ? 10 : target > 100 ? 5 : 1;
  const stepTime = Math.max(Math.abs(Math.floor(duration / target)), 10);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = start;
    }
  }, stepTime);
}

/* =============================================
   PROJECTS SLIDER
   ============================================= */
let currentProjectOffset = 0;

function initProjectsSlider() {
  const track = document.getElementById('projects-track');
  const prevBtn = document.getElementById('project-prev');
  const nextBtn = document.getElementById('project-next');
  if (!track || !prevBtn || !nextBtn) return;

  const getCardWidth = () => {
    const card = track.querySelector('.project-card');
    return card ? card.offsetWidth + 30 : 400;
  };
  const getMaxOffset = () => {
    const total = track.querySelectorAll('.project-card').length;
    const w = getCardWidth();
    return Math.max(0, total * w - 30 - track.parentElement.offsetWidth);
  };
  const updatePosition = () => {
    track.style.transform = `translateX(-${currentProjectOffset}px)`;
  };

  nextBtn.addEventListener('click', () => {
    currentProjectOffset = Math.min(currentProjectOffset + getCardWidth(), getMaxOffset());
    updatePosition();
  });
  prevBtn.addEventListener('click', () => {
    currentProjectOffset = Math.max(currentProjectOffset - getCardWidth(), 0);
    updatePosition();
  });
  window.addEventListener('resize', () => {
    if (currentProjectOffset > getMaxOffset()) { currentProjectOffset = getMaxOffset(); updatePosition(); }
  });
}

function showProjectDetails(index) {
  const track = document.getElementById('projects-track');
  if (!track) return;
  const card = track.querySelector('.project-card');
  const cardWidth = card ? card.offsetWidth + 30 : 400;
  const total = track.querySelectorAll('.project-card').length;
  const maxOffset = Math.max(0, total * cardWidth - 30 - track.parentElement.offsetWidth);
  currentProjectOffset = Math.min(index * cardWidth, maxOffset);
  track.style.transform = `translateX(-${currentProjectOffset}px)`;

  if (typeof window.hideHomeOnlySections === 'function') window.hideHomeOnlySections();

  const section = document.getElementById('projects');
  if (section) {
    const header = document.getElementById('header');
    const headerH = header ? header.offsetHeight : 80;
    window.scrollTo({ top: section.getBoundingClientRect().top + window.pageYOffset - headerH - 10, behavior: 'smooth' });
  }
}

/* =============================================
   3D TILT EFFECT ON PROJECT CARDS
   ============================================= */
function initProjectCard3D() {
  const track = document.getElementById('projects-track');
  if (!track || 'ontouchstart' in window) return;

  // Add glare & active-badge elements to every card
  track.querySelectorAll('.project-card').forEach((card, i) => {
    // Active badge
    const badge = document.createElement('div');
    badge.className = 'project-card-active-badge';
    badge.textContent = 'Viewing';
    card.appendChild(badge);

    // Glare layer
    const glare = document.createElement('div');
    glare.className = 'project-card-glare';
    card.appendChild(glare);

    // Mouse enter: flag track for group dimming
    card.addEventListener('mouseenter', () => {
      track.classList.add('has-hover');
    });

    card.addEventListener('mouseleave', () => {
      track.classList.remove('has-hover');
      // Reset 3D transform
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      glare.style.background = '';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Normalise -1 to 1
      const nx = (e.clientX - cx) / (rect.width / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);

      // Tilt angles (max ±10deg)
      const rotY =  nx * 10;
      const rotX = -ny *  8;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`;

      // Move glare with mouse
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      glare.style.background = `radial-gradient(ellipse at ${glareX}% ${glareY}%, rgba(255,255,255,0.13) 0%, transparent 65%)`;
    });
  });
}

/* =============================================
   FLOOR PLANS
   ============================================= */
function initFloorPlans() {
  const tabs = document.querySelectorAll('.floorplan-tab');
  const displays = document.querySelectorAll('.floorplan-display');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      displays.forEach(d => d.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

/* =============================================
   TESTIMONIALS
   ============================================= */
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonials-dot');
  if (!slides.length) return;

  let currentIndex = 0;
  let interval;

  function showTestimonial(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentIndex = index;
  }

  function startRotation() {
    clearInterval(interval);
    interval = setInterval(() => showTestimonial((currentIndex + 1) % slides.length), 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showTestimonial(parseInt(dot.dataset.index, 10));
      startRotation();
    });
  });
  startRotation();
}

/* =============================================
   VIDEO MODAL
   ============================================= */
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');
  const openBtns = [
    document.getElementById('open-video-btn'),
    document.getElementById('open-video-btn-2'),
    document.getElementById('open-video-btn-3')
  ];
  const closeBtn = document.querySelector('.video-modal-close');
  const videoSrc = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';

  openBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal && iframe) { iframe.src = videoSrc; modal.classList.add('active'); }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    if (iframe) iframe.src = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* =============================================
   SCROLL REVEAL — staggered children
   ============================================= */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-item, .stat-card, .value-card, .section-title');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal-item, .stat-card, .value-card')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.1}s`;
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
}

/* =============================================
   FORM SUBMIT
   ============================================= */
function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('leadForm');
  const successMsg = document.getElementById('form-msg');
  if (!form || !successMsg) return;
  form.style.opacity = '0.3';
  form.style.pointerEvents = 'none';
  setTimeout(() => { form.style.display = 'none'; successMsg.classList.add('success'); }, 1000);
}

/* =============================================
   PARTNER CALCULATOR
   ============================================= */
function initPartnerCalculator() {
  const volumeRange = document.getElementById('volume-range');
  const commissionRange = document.getElementById('commission-range');
  const volumeVal = document.getElementById('volume-val');
  const commissionVal = document.getElementById('commission-val');
  const payoutVal = document.getElementById('payout-val');
  const bracketVal = document.getElementById('bracket-val');
  const rebateVal = document.getElementById('rebate-val');
  const radialBar = document.getElementById('radial-progress');
  if (!volumeRange || !commissionRange) return;

  function updateCalculator() {
    const volume = parseFloat(volumeRange.value);
    const commission = parseFloat(commissionRange.value);
    const payout = volume * (commission / 100);

    volumeVal.textContent = 'EGP ' + volume.toLocaleString('en-US');
    commissionVal.textContent = commission.toFixed(1) + '%';

    payoutVal.textContent = payout >= 1000000
      ? 'EGP ' + (payout / 1000000).toFixed(2).replace(/\.00$/, '') + 'M'
      : 'EGP ' + (payout / 1000).toFixed(0) + 'K';

    let tier = 'Bronze Partner', rebatePct = 0.05;
    if (volume >= 50000000) { tier = 'Gold Partner'; rebatePct = 0.12; bracketVal.style.color = '#E5C158'; }
    else if (volume >= 20000000) { tier = 'Silver Partner'; rebatePct = 0.08; bracketVal.style.color = '#C0C0C0'; }
    else { bracketVal.style.color = '#CD7F32'; }
    bracketVal.textContent = tier;

    const rebate = payout * rebatePct;
    rebateVal.textContent = 'EGP ' + rebate.toLocaleString('en-US', { maximumFractionDigits: 0 });

    const maxPayout = 5000000;
    const offset = 440 * (1 - Math.min(payout / maxPayout, 1));
    radialBar.style.strokeDashoffset = offset;
  }

  volumeRange.addEventListener('input', updateCalculator);
  commissionRange.addEventListener('input', updateCalculator);
  updateCalculator();
}

/* =============================================
   RENTAL HUB
   ============================================= */
function initRentalHub() {
  // Rental Income Calculator
  const propertyRange = document.getElementById('property-range');
  const yieldRange = document.getElementById('yield-range');
  const propertyVal = document.getElementById('property-val');
  const yieldVal = document.getElementById('yield-val');
  const monthlyRental = document.getElementById('monthly-rental');
  const annualRental = document.getElementById('annual-rental');
  const threeYearRental = document.getElementById('three-year-rental');
  
  if (propertyRange && yieldRange) {
    function updateRentalCalculator() {
      const property = parseFloat(propertyRange.value);
      const yield_pct = parseFloat(yieldRange.value);
      
      propertyVal.textContent = 'EGP ' + (property / 1000000).toFixed(1) + 'M';
      yieldVal.textContent = yield_pct.toFixed(1) + '%';
      
      const monthly = (property * yield_pct) / (12 * 100);
      const annual = monthly * 12;
      const threeYear = annual * 3;
      
      monthlyRental.textContent = 'EGP ' + monthly.toLocaleString('en-US', { maximumFractionDigits: 0 });
      annualRental.textContent = 'EGP ' + annual.toLocaleString('en-US', { maximumFractionDigits: 0 });
      threeYearRental.textContent = 'EGP ' + threeYear.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    
    propertyRange.addEventListener('input', updateRentalCalculator);
    yieldRange.addEventListener('input', updateRentalCalculator);
    updateRentalCalculator();
  }
  
  // Available Properties for Lease - sample data
  const rentalPropertiesGrid = document.getElementById('rental-properties-grid');
  if (rentalPropertiesGrid) {
    const rentalProperties = [
      {
        name: 'Vert Zayed - Villa Unit A3',
        location: 'New Zayed',
        monthlyRent: 'EGP 18,500',
        yield: '4.4%',
        beds: 4,
        baths: 3
      },
      {
        name: 'Zayard Residence - Penthouse Suite',
        location: 'New Zayed',
        monthlyRent: 'EGP 25,000',
        yield: '6.0%',
        beds: 3,
        baths: 2
      },
      {
        name: 'Zayard Elite - Estate Plot 12',
        location: 'New Zayed',
        monthlyRent: 'EGP 35,000',
        yield: '7.8%',
        beds: 5,
        baths: 4
      },
      {
        name: 'Zayard Avenue - Commercial Suite',
        location: 'New Zayed',
        monthlyRent: 'EGP 22,000',
        yield: '5.5%',
        beds: 2,
        baths: 2
      }
    ];
    
    rentalProperties.forEach(prop => {
      const card = document.createElement('div');
      card.className = 'rental-property-card';
      card.innerHTML = `
        <div class="property-card-header">
          <span class="property-card-name">${prop.name}</span>
          <span class="property-card-yield">${prop.yield}</span>
        </div>
        <div class="property-card-details">
          <span class="property-card-detail">📍 ${prop.location}</span>
          <span class="property-card-detail">💰 ${prop.monthlyRent}/mo</span>
          <span class="property-card-detail">🛏️ ${prop.beds} BR | ${prop.baths} BA</span>
        </div>
      `;
      rentalPropertiesGrid.appendChild(card);
    });
  }
  
  // Lease Request Form
  const leaseForm = document.getElementById('lease-request-form');
  const leaseMessage = document.getElementById('lease-form-message');
  if (leaseForm && leaseMessage) {
    leaseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const property = document.getElementById('lease-property').value;
      const type = document.getElementById('lease-type').value;
      const amount = document.getElementById('lease-amount').value;
      const email = document.getElementById('lease-contact').value;
      
      leaseForm.style.opacity = '0.5';
      leaseForm.style.pointerEvents = 'none';
      
      setTimeout(() => {
        leaseMessage.className = 'success';
        leaseMessage.textContent = `✓ Lease request for "${property}" submitted successfully! We'll contact you at ${email} within 24 hours.`;
        leaseMessage.style.display = 'block';
        
        setTimeout(() => {
          leaseForm.reset();
          leaseForm.style.opacity = '1';
          leaseForm.style.pointerEvents = 'auto';
          leaseMessage.style.display = 'none';
        }, 3000);
      }, 800);
    });
  }
}

/* =============================================
   PROGRESS TIMELINE
   ============================================= */
function initProgressTimeline() {
  const tabs = document.querySelectorAll('.progress-tab');
  const nameEl = document.getElementById('progress-project-name');
  const descEl = document.getElementById('progress-project-desc');
  const pctEl = document.getElementById('overall-percentage');
  const fillEl = document.getElementById('overall-bar-fill');
  const listEl = document.getElementById('timeline-nodes-list');
  const photoEl = document.getElementById('progress-photo');
  const captionEl = document.getElementById('progress-photo-caption');
  if (!tabs.length || !listEl) return;

  const progressData = [
    {
      name: "Vert Zayed Construction Milestones",
      desc: "Premium boutique residential community in New Zayed. Concrete structural frame works are in their final stage.",
      percentage: 72,
      photo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
      caption: "Concrete structural skeleton pouring in zone B (Vert Zayed)",
      milestones: [
        { title: "Excavation & Shoring", status: "completed", date: "Q3 2025", desc: "100% finished. Earthworks and retainment structures fully anchored.", pct: 100 },
        { title: "Foundation Concrete Pouring", status: "completed", date: "Q4 2025", desc: "100% finished. Raft foundations poured, waterproof membrane audited.", pct: 100 },
        { title: "Concrete Skeleton Frame", status: "active", date: "Q1 2026", desc: "90% finished. Top residential levels in final casting phase.", pct: 90 },
        { title: "Masonry, Partitioning & Facades", status: "pending", date: "Q2-Q3 2026", desc: "40% finished. Interior brick walls commenced on lower levels.", pct: 40 },
        { title: "Interior Utilities & Finishing", status: "pending", date: "Q4 2026", desc: "10% finished. Conduits for electrical grids and HVAC being laid.", pct: 10 }
      ]
    },
    {
      name: "Zayard Villa Construction Milestones",
      desc: "Luxury standalone smart homes in New Zayed. Raft foundation systems are cured, columns currently being raised.",
      percentage: 45,
      photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      caption: "Tower crane assembly and foundation reinforcement (Zayard Villa)",
      milestones: [
        { title: "Excavation & Shoring", status: "completed", date: "Q4 2025", desc: "100% finished. Perimeter shoring completed, basement cleared.", pct: 100 },
        { title: "Foundation Concrete Pouring", status: "active", date: "Q1 2026", desc: "80% finished. Main slabs poured for Cluster A & B.", pct: 80 },
        { title: "Concrete Skeleton Frame", status: "pending", date: "Q2 2026", desc: "30% finished. Structural pillar reinforcement commenced.", pct: 30 },
        { title: "Masonry, Partitioning & Facades", status: "pending", date: "Q3-Q4 2026", desc: "Scheduled following skeleton curing.", pct: 0 },
        { title: "Interior Utilities & Finishing", status: "pending", date: "Q1 2027", desc: "Scheduled for subsequent fiscal phase.", pct: 0 }
      ]
    },
    {
      name: "Zayard Residence Construction Milestones",
      desc: "Low-rise elegant apartments. Concrete frame fully finished, masonry partitions complete, facade detailing wrapping up.",
      percentage: 88,
      photo: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
      caption: "Exterior facade painting and window glazing installation (Zayard Residence)",
      milestones: [
        { title: "Excavation & Shoring", status: "completed", date: "Q1 2025", desc: "100% finished. Base preparation finalized.", pct: 100 },
        { title: "Foundation Concrete Pouring", status: "completed", date: "Q2 2025", desc: "100% finished. Approved by third-party auditors.", pct: 100 },
        { title: "Concrete Skeleton Frame", status: "completed", date: "Q3 2025", desc: "100% finished. All building blocks fully capped.", pct: 100 },
        { title: "Masonry, Partitioning & Facades", status: "active", date: "Q4 2025", desc: "90% finished. External stucco and aluminum glazing underway.", pct: 90 },
        { title: "Interior Utilities & Finishing", status: "pending", date: "Q1-Q2 2026", desc: "70% finished. Fine plaster and plumbing in progress.", pct: 70 }
      ]
    }
  ];

  function showTimelineForProject(index) {
    const proj = progressData[index];
    if (!proj) return;
    nameEl.textContent = proj.name;
    descEl.textContent = proj.desc;
    pctEl.textContent = proj.percentage + '%';
    fillEl.style.width = proj.percentage + '%';
    listEl.innerHTML = '';
    let completedCount = 0, activeCount = 0;

    proj.milestones.forEach(m => {
      const node = document.createElement('div');
      node.className = `timeline-node ${m.status}`;
      if (m.status === 'completed') completedCount++;
      if (m.status === 'active') activeCount++;
      node.innerHTML = `
        <div class="timeline-bullet"></div>
        <div class="timeline-node-content">
          <div class="timeline-node-header">
            <span class="timeline-node-title">${m.title}</span>
            <span class="timeline-node-pct">${m.pct}%</span>
          </div>
          <span class="timeline-node-date">${m.date}</span>
          <p class="timeline-node-desc">${m.desc}</p>
        </div>
      `;
      listEl.appendChild(node);
    });

    const progressFactor = (completedCount + activeCount * 0.5) / proj.milestones.length;
    listEl.style.setProperty('--timeline-progress-height', (progressFactor * 100) + '%');

    if (photoEl) {
      photoEl.classList.add('updating');
      setTimeout(() => {
        photoEl.src = proj.photo;
        if (captionEl) captionEl.textContent = proj.caption;
        photoEl.classList.remove('updating');
      }, 350);
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      showTimelineForProject(parseInt(tab.dataset.proj, 10));
    });
  });

  showTimelineForProject(0);
}

/* =============================================
   MEDIA CENTER
   ============================================= */
function initMediaCenter() {
  const assetGrid = document.getElementById('media-asset-grid');
  const searchField = document.getElementById('asset-search');
  const filterField = document.getElementById('asset-filter');
  const selectAll = document.getElementById('select-all-assets');
  const countLabel = document.getElementById('selected-count-label');
  const downloadBtn = document.getElementById('download-selected-btn');
  const progressWrapper = document.getElementById('download-progress-wrapper');
  const progressBar = document.getElementById('download-bar-fill');
  const progressPct = document.getElementById('download-progress-pct');
  if (!assetGrid || !downloadBtn) return;

  const mediaAssets = [
    { id: 1, name: "Vert Zayed Sales Brochure (White-Label)", project: "vert", type: "PDF Brochure", size: "14.2 MB" },
    { id: 2, name: "Vert Zayed Architectural CAD Layouts", project: "vert", type: "CAD Files", size: "48.5 MB" },
    { id: 3, name: "Zayard Villa Executive Presentation", project: "villa", type: "PDF Brochure", size: "18.1 MB" },
    { id: 4, name: "Zayard Villa 3D High-Res Renders Package", project: "villa", type: "ZIP Renders", size: "124.0 MB" },
    { id: 5, name: "Zayard Elite Luxury Estate Catalog", project: "elite", type: "PDF Brochure", size: "22.3 MB" },
    { id: 6, name: "Zayard Elite CAD Elevation Plans", project: "elite", type: "CAD Files", size: "64.8 MB" },
    { id: 7, name: "Zayard Residence Commercial Price List", project: "residence", type: "PDF Pricing", size: "2.4 MB" },
    { id: 8, name: "Zayard Residence Brochure & Floorplans", project: "residence", type: "PDF Brochure", size: "16.8 MB" },
    { id: 9, name: "Zayard North Strike Coastal Portfolio", project: "strike", type: "PDF Brochure", size: "34.5 MB" },
    { id: 10, name: "Zayard North Strike Shore Renders Pack", project: "strike", type: "ZIP Renders", size: "192.2 MB" }
  ];

  let selectedAssetIds = new Set();
  let visibleAssetIds = [];

  function getIcon(type) {
    if (type.includes("PDF")) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
    if (type.includes("CAD")) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`;
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`;
  }

  function updateSelectedCount() { countLabel.textContent = `${selectedAssetIds.size} files selected`; }

  function syncSelectAll() {
    selectAll.checked = visibleAssetIds.length > 0 && visibleAssetIds.every(id => selectedAssetIds.has(id));
  }

  function toggleSelection(id) {
    selectedAssetIds.has(id) ? selectedAssetIds.delete(id) : selectedAssetIds.add(id);
    updateSelectedCount(); syncSelectAll();
  }

  function renderAssets() {
    const search = searchField.value.toLowerCase().trim();
    const filter = filterField.value;
    assetGrid.innerHTML = '';
    visibleAssetIds = [];

    const filtered = mediaAssets.filter(a =>
      (a.name.toLowerCase().includes(search) || a.type.toLowerCase().includes(search)) &&
      (filter === 'all' || a.project === filter)
    );

    if (!filtered.length) {
      assetGrid.innerHTML = '<div class="media-no-results">No broker assets found matching criteria.</div>';
      selectAll.checked = false; return;
    }

    filtered.forEach(asset => {
      visibleAssetIds.push(asset.id);
      const card = document.createElement('div');
      card.className = 'media-card';
      card.innerHTML = `
        <div class="media-card-checkbox"><input type="checkbox" class="partner-checkbox" data-id="${asset.id}" ${selectedAssetIds.has(asset.id) ? 'checked' : ''}></div>
        <div class="media-card-icon">${getIcon(asset.type)}</div>
        <h4 class="media-card-title">${asset.name}</h4>
        <div class="media-card-meta"><span>${asset.type}</span><span>${asset.size}</span></div>
      `;
      card.addEventListener('click', (e) => {
        const cb = card.querySelector('input');
        if (e.target !== cb) cb.checked = !cb.checked;
        toggleSelection(asset.id);
      });
      assetGrid.appendChild(card);
    });
    syncSelectAll();
  }

  selectAll.addEventListener('change', () => {
    visibleAssetIds.forEach(id => selectAll.checked ? selectedAssetIds.add(id) : selectedAssetIds.delete(id));
    assetGrid.querySelectorAll('.partner-checkbox').forEach(cb => { cb.checked = selectAll.checked; });
    updateSelectedCount();
  });

  searchField.addEventListener('input', renderAssets);
  filterField.addEventListener('change', renderAssets);

  downloadBtn.addEventListener('click', () => {
    if (!selectedAssetIds.size) { alert("Please select at least one asset."); return; }
    downloadBtn.disabled = true; downloadBtn.style.opacity = '0.5';
    progressWrapper.style.display = 'block';
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.floor(Math.random() * 8) + 4;
      if (pct >= 100) {
        pct = 100; clearInterval(interval);
        progressBar.style.width = '100%'; progressPct.textContent = '100%';
        setTimeout(() => {
          const el = document.createElement('a');
          const content = `Urban Lease - Asset Package\nFiles:\n` +
            Array.from(selectedAssetIds).map(id => {
              const a = mediaAssets.find(x => x.id === id);
              return `- ${a.name} (${a.type}, ${a.size})`;
            }).join('\n') + `\n\nGenerated: ${new Date().toLocaleString()}`;
          el.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
          el.download = `UrbanLease-Kit-${Date.now()}.txt`;
          el.style.display = 'none';
          document.body.appendChild(el); el.click(); document.body.removeChild(el);
          progressWrapper.style.display = 'none';
          downloadBtn.disabled = false; downloadBtn.style.opacity = '1';
          alert("Asset package ready! Download started.");
        }, 700);
      } else {
        progressBar.style.width = pct + '%';
        progressPct.textContent = pct + '%';
      }
    }, 80);
  });

  renderAssets();
}