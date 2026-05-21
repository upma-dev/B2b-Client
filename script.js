/* AURA Palmier Developments - JavaScript Logic */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initAnchorScrollOffset();
  initHeroSlider();
  initCounters();
  initProjectsSlider();
  initFloorPlans();
  initTestimonials();
  initVideoModal();
  initScrollReveal();
  initB2BCalculator();
  initB2BProgressTimeline();
  initB2BMediaCenter();
});

// 1. Preloader Handling
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 600); // Elegant luxury delay
  });
}

// 2. Sticky Navbar & Mobile Drawer
function initNavbar() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  if (!header) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('mobile-open');
    });

    // Close mobile drawer when clicking a link
    navLinks.querySelectorAll('.nav-link:not(.dropdown > a), .btn, .dropdown-item a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('mobile-open');
      });
    });
  }
}

// 3. Hero Slider (Horizontal and Vertical Transitions)
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (slides.length === 0) return;

  let currentSlideIndex = 0;
  let slideInterval;
  const slideDuration = 6000; // 6 seconds per slide

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    if (dots[index]) {
      dots[index].classList.add('active');
    }
    currentSlideIndex = index;
  }

  function nextSlide() {
    let nextIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function startSlideTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  // Dots click events
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startSlideTimer();
    });
  });

  startSlideTimer();
}

// 4. Numerical Counters with Scroll Trigger
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.1
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetNumber = parseInt(target.getAttribute('data-target'), 10);
        animateCounter(target, targetNumber);
        observer.unobserve(target); // Animate once only
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => counterObserver.observe(num));
}

function animateCounter(element, target) {
  let start = 0;
  const duration = 2000; // 2 seconds animation
  const stepTime = Math.abs(Math.floor(duration / target));
  
  // Easing step calculation for larger numbers
  let increment = 1;
  if (target > 500) increment = 10;
  else if (target > 100) increment = 5;

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target + (element.getAttribute('data-target') === '99' ? '%' : '+');
      clearInterval(timer);
    } else {
      element.textContent = start;
    }
  }, Math.max(stepTime, 10));
}

// 5. Featured Projects Slider Logic
let currentProjectOffset = 0;
function initProjectsSlider() {
  const track = document.getElementById('projects-track');
  const prevBtn = document.getElementById('project-prev');
  const nextBtn = document.getElementById('project-next');
  if (!track || !prevBtn || !nextBtn) return;

  const getCardWidth = () => {
    const card = track.querySelector('.project-card');
    return card ? card.offsetWidth + 30 : 400; // width + gap
  };

  const getMaxOffset = () => {
    const totalCards = track.querySelectorAll('.project-card').length;
    const containerWidth = track.parentElement.offsetWidth;
    const totalWidth = totalCards * getCardWidth() - 30; // subtract last gap
    return Math.max(0, totalWidth - containerWidth);
  };

  const updateSliderPosition = () => {
    track.style.transform = `translateX(-${currentProjectOffset}px)`;
  };

  nextBtn.addEventListener('click', () => {
    const maxOffset = getMaxOffset();
    const cardWidth = getCardWidth();
    currentProjectOffset += cardWidth;
    if (currentProjectOffset > maxOffset) {
      currentProjectOffset = maxOffset;
    }
    updateSliderPosition();
  });

  prevBtn.addEventListener('click', () => {
    const cardWidth = getCardWidth();
    currentProjectOffset -= cardWidth;
    if (currentProjectOffset < 0) {
      currentProjectOffset = 0;
    }
    updateSliderPosition();
  });

  // Handle window resize dynamically
  window.addEventListener('resize', () => {
    const maxOffset = getMaxOffset();
    if (currentProjectOffset > maxOffset) {
      currentProjectOffset = maxOffset;
      updateSliderPosition();
    }
  });
}

// Triggered when dropdown or slider item specifies details
function showProjectDetails(index) {
  const track = document.getElementById('projects-track');
  if (!track) return;
  const cardWidth = track.querySelector('.project-card').offsetWidth + 30;
  currentProjectOffset = index * cardWidth;
  
  const totalCards = track.querySelectorAll('.project-card').length;
  const containerWidth = track.parentElement.offsetWidth;
  const totalWidth = totalCards * cardWidth - 30;
  const maxOffset = Math.max(0, totalWidth - containerWidth);
  
  if (currentProjectOffset > maxOffset) {
    currentProjectOffset = maxOffset;
  }
  track.style.transform = `translateX(-${currentProjectOffset}px)`;

  if (typeof window.hideHomeOnlySections === 'function') {
    window.hideHomeOnlySections();
  }

  // Scroll to projects section smoothly with header offset
  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    const header = document.getElementById('header');
    const headerHeight = header ? header.offsetHeight : 80;
    const top = projectsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// 6. Virtual Floor Plan Switching
function initFloorPlans() {
  const tabs = document.querySelectorAll('.floorplan-tab');
  const displays = document.querySelectorAll('.floorplan-display');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active states
      tabs.forEach(t => t.classList.remove('active'));
      displays.forEach(d => d.classList.remove('active'));

      // Add active state to clicked tab
      tab.classList.add('active');
      const targetDisplay = document.getElementById(tab.getAttribute('data-tab'));
      if (targetDisplay) {
        targetDisplay.classList.add('active');
      }
    });
  });
}

// 7. Testimonials Rotator
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonials-dot');
  if (slides.length === 0) return;

  let currentIndex = 0;
  let interval;

  function showTestimonial(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    if (dots[index]) {
      dots[index].classList.add('active');
    }
    currentIndex = index;
  }

  function startRotation() {
    clearInterval(interval);
    interval = setInterval(() => {
      let nextIdx = (currentIndex + 1) % slides.length;
      showTestimonial(nextIdx);
    }, 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showTestimonial(idx);
      startRotation();
    });
  });

  startRotation();
}

// 8. Video Modal Handler
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');
  
  // Select all play buttons
  const openButtons = [
    document.getElementById('open-video-btn'),
    document.getElementById('open-video-btn-2'),
    document.getElementById('open-video-btn-3')
  ];
  const closeButton = document.querySelector('.video-modal-close');

  // Premium cinematic walk-through video placeholder
  const youtubeVideoEmbed = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'; // Replace with luxury walkthrough if needed

  openButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal && iframe) {
          iframe.src = youtubeVideoEmbed;
          modal.classList.add('active');
        }
      });
    }
  });

  if (closeButton && modal && iframe) {
    closeButton.addEventListener('click', () => {
      modal.classList.remove('active');
      iframe.src = ''; // Stop video playback
    });

    // Close when clicking overlay backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        iframe.src = '';
      }
    });
  }
}

// 9. Scroll Reveal Animations (Scroll Observer)
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-item, .stat-card, .value-card, .section-title');
  if (items.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before scrolling in fully
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  items.forEach(item => {
    revealObserver.observe(item);
  });
}

// 10. Inquiry Lead Form Submission Simulation
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = document.getElementById('leadForm');
  const successMsg = document.getElementById('form-msg');
  if (!form || !successMsg) return;

  // Perform basic UI styling switch for form submission success animation
  form.style.opacity = '0.3';
  form.style.pointerEvents = 'none';

  setTimeout(() => {
    form.style.display = 'none';
    successMsg.classList.add('success');
  }, 1000);
}

// 11. B2B Broker Commission & Yield Calculator
function initB2BCalculator() {
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

    // Update range labels
    volumeVal.textContent = 'EGP ' + volume.toLocaleString('en-US');
    commissionVal.textContent = commission.toFixed(1) + '%';

    // Format shorthand payout
    let formattedPayout = '';
    if (payout >= 1000000) {
      formattedPayout = 'EGP ' + (payout / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
    } else {
      formattedPayout = 'EGP ' + (payout / 1000).toFixed(0) + 'K';
    }
    payoutVal.textContent = formattedPayout;

    // Determine Commission Tier & Marketing Rebate percentage
    let tier = 'Bronze Partner';
    let rebatePct = 0.05; // 5% rebate

    if (volume >= 50000000) {
      tier = 'Gold Partner';
      rebatePct = 0.12;
      bracketVal.style.color = '#E5C158'; // Gold accent
    } else if (volume >= 20000000) {
      tier = 'Silver Partner';
      rebatePct = 0.08;
      bracketVal.style.color = '#C0C0C0'; // Silver gray
    } else {
      tier = 'Bronze Partner';
      rebatePct = 0.05;
      bracketVal.style.color = '#CD7F32'; // Bronze color
    }

    bracketVal.textContent = tier;

    // Calculate marketing rebate EGP
    const rebate = payout * rebatePct;
    rebateVal.textContent = 'EGP ' + rebate.toLocaleString('en-US', { maximumFractionDigits: 0 });

    // Update radial progress bar (circumference = 440)
    // Max possible payout is EGP 5,000,000 (100M * 5%)
    const maxPayout = 5000000;
    const progressPct = Math.min(payout / maxPayout, 1);
    const offset = 440 * (1 - progressPct);
    radialBar.style.strokeDashoffset = offset;
  }

  // Listeners
  volumeRange.addEventListener('input', updateCalculator);
  commissionRange.addEventListener('input', updateCalculator);

  // Initial call
  updateCalculator();
}

// 12. B2B Construction Milestones Timeline
function initB2BProgressTimeline() {
  const tabs = document.querySelectorAll('.progress-tab');
  const nameEl = document.getElementById('progress-project-name');
  const descEl = document.getElementById('progress-project-desc');
  const pctEl = document.getElementById('overall-percentage');
  const fillEl = document.getElementById('overall-bar-fill');
  const listEl = document.getElementById('timeline-nodes-list');
  const photoEl = document.getElementById('progress-photo');
  const captionEl = document.getElementById('progress-photo-caption');

  if (tabs.length === 0 || !listEl) return;

  const progressData = [
    {
      name: "Vert Zayed Construction Milestones",
      desc: "Premium boutique residential community in New Zayed. Concrete structural frame works are in their final stage, paving the way for brick masonry and facade installations.",
      percentage: 72,
      photo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
      caption: "Concrete structural skeleton pouring in zone B (Vert Zayed)",
      milestones: [
        { title: "Excavation & Shoring", status: "completed", date: "Q3 2025", desc: "100% finished. Earthworks completed, retainment structures fully anchored.", pct: 100 },
        { title: "Foundation Concrete Pouring", status: "completed", date: "Q4 2025", desc: "100% finished. Raft foundations poured, waterproof membrane audited.", pct: 100 },
        { title: "Concrete Skeleton Frame", status: "active", date: "Q1 2026", desc: "90% finished. Columns and ceiling slabs on top residential levels in final casting phase.", pct: 90 },
        { title: "Masonry, Partitioning & Facades", status: "pending", date: "Q2-Q3 2026", desc: "40% finished. Interior brick divider walls commenced on lower levels.", pct: 40 },
        { title: "Interior Utilities & Finishing", status: "pending", date: "Q4 2026", desc: "10% finished. Conduits for electrical grids and HVAC systems are being laid.", pct: 10 }
      ]
    },
    {
      name: "Zayard Villa Construction Milestones",
      desc: "Luxury standalone smart homes in New Zayed. Raft foundation concrete systems are completely cured, and structural columns are currently being raised.",
      percentage: 45,
      photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      caption: "Tower crane assembly and primary foundation reinforcement (Zayard Villa)",
      milestones: [
        { title: "Excavation & Shoring", status: "completed", date: "Q4 2025", desc: "100% finished. Perimeter shoring completed, basement level cleared.", pct: 100 },
        { title: "Foundation Concrete Pouring", status: "active", date: "Q1 2026", desc: "80% finished. Main structural foundation slabs poured for Cluster A & B.", pct: 80 },
        { title: "Concrete Skeleton Frame", status: "pending", date: "Q2 2026", desc: "30% finished. Structural pillar reinforcement works commenced.", pct: 30 },
        { title: "Masonry, Partitioning & Facades", status: "pending", date: "Q3-Q4 2026", desc: "Scheduled to start following skeleton curing.", pct: 0 },
        { title: "Interior Utilities & Finishing", status: "pending", date: "Q1 2027", desc: "Scheduled for subsequent fiscal phase.", pct: 0 }
      ]
    },
    {
      name: "Zayard Residence Construction Milestones",
      desc: "Low-rise elegant apartments. Structural concrete frame is fully finished, interior masonry partitions are complete, and exterior facade detailing is wrapping up.",
      percentage: 88,
      photo: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
      caption: "Exterior facade painting and window glazing installation (Zayard Residence)",
      milestones: [
        { title: "Excavation & Shoring", status: "completed", date: "Q1 2025", desc: "100% finished. Base preparation and site drainage lines finalized.", pct: 100 },
        { title: "Foundation Concrete Pouring", status: "completed", date: "Q2 2025", desc: "100% finished. Foundation systems approved by third-party auditors.", pct: 100 },
        { title: "Concrete Skeleton Frame", status: "completed", date: "Q3 2025", desc: "100% finished. All residential building blocks fully capped.", pct: 100 },
        { title: "Masonry, Partitioning & Facades", status: "active", date: "Q4 2025", desc: "90% finished. External stucco application and aluminum window glazing underway.", pct: 90 },
        { title: "Interior Utilities & Finishing", status: "pending", date: "Q1-Q2 2026", desc: "70% finished. Fine plaster works and plumbing pipes in progress.", pct: 70 }
      ]
    }
  ];

  function showTimelineForProject(index) {
    const proj = progressData[index];
    if (!proj) return;

    // Update metadata fields
    nameEl.textContent = proj.name;
    descEl.textContent = proj.desc;
    pctEl.textContent = proj.percentage + '%';
    fillEl.style.width = proj.percentage + '%';

    // Clear and build milestones nodes list
    listEl.innerHTML = '';
    
    let completedCount = 0;
    let activeCount = 0;

    proj.milestones.forEach((m) => {
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

    // Update vertical line progress indicator height
    const totalMilestones = proj.milestones.length;
    const progressFactor = (completedCount + activeCount * 0.5) / totalMilestones;
    listEl.style.setProperty('--timeline-progress-height', (progressFactor * 100) + '%');

    // Smoothly swap photos using css opacity transition
    if (photoEl) {
      photoEl.classList.add('updating');
      setTimeout(() => {
        photoEl.src = proj.photo;
        if (captionEl) captionEl.textContent = proj.caption;
        photoEl.classList.remove('updating');
      }, 300);
    }
  }

  // Bind clicks
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const idx = parseInt(tab.getAttribute('data-proj'), 10);
      showTimelineForProject(idx);
    });
  });

  // Load first project by default
  showTimelineForProject(0);
}

// 13. B2B Broker Media Kit Download Center Dashboard
function initB2BMediaCenter() {
  const assetGrid = document.getElementById('media-asset-grid');
  const searchField = document.getElementById('asset-search');
  const filterField = document.getElementById('asset-filter');
  const selectAllCheckbox = document.getElementById('select-all-assets');
  const countLabel = document.getElementById('selected-count-label');
  const downloadBtn = document.getElementById('download-selected-btn');
  const progressWrapper = document.getElementById('download-progress-wrapper');
  const progressBar = document.getElementById('download-bar-fill');
  const progressPct = document.getElementById('download-progress-pct');

  if (!assetGrid || !searchField || !filterField || !downloadBtn) return;

  // Mock Asset Database
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

  function getIconForType(type) {
    if (type.includes("PDF")) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
    } else if (type.includes("CAD")) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`;
    } else {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;
    }
  }

  function updateSelectedCount() {
    countLabel.textContent = `${selectedAssetIds.size} files selected`;
  }

  function renderAssets() {
    const searchVal = searchField.value.toLowerCase().trim();
    const filterVal = filterField.value;

    assetGrid.innerHTML = '';
    visibleAssetIds = [];

    const filtered = mediaAssets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchVal) || asset.type.toLowerCase().includes(searchVal);
      const matchesFilter = filterVal === 'all' || asset.project === filterVal;
      return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
      assetGrid.innerHTML = '<div class="media-no-results">No broker assets found matching criteria.</div>';
      selectAllCheckbox.checked = false;
      return;
    }

    filtered.forEach(asset => {
      visibleAssetIds.push(asset.id);
      
      const card = document.createElement('div');
      card.className = 'media-card';
      card.setAttribute('data-id', asset.id);
      
      const isChecked = selectedAssetIds.has(asset.id);
      
      card.innerHTML = `
        <div class="media-card-checkbox">
          <input type="checkbox" class="asset-select-checkbox b2b-checkbox" data-id="${asset.id}" ${isChecked ? 'checked' : ''}>
        </div>
        <div class="media-card-icon">
          ${getIconForType(asset.type)}
        </div>
        <h4 class="media-card-title">${asset.name}</h4>
        <div class="media-card-meta">
          <span>${asset.type}</span>
          <span>${asset.size}</span>
        </div>
      `;

      // Handle card click (or checkbox click)
      card.addEventListener('click', (e) => {
        // Prevent doubling events if checkbox is clicked directly
        if (e.target.tagName === 'INPUT') {
          toggleAssetSelection(asset.id);
          return;
        }
        
        const checkbox = card.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        toggleAssetSelection(asset.id);
      });

      assetGrid.appendChild(card);
    });

    // Check if all visible assets are checked to sync the Select All checkbox
    syncSelectAllState();
  }

  function toggleAssetSelection(id) {
    if (selectedAssetIds.has(id)) {
      selectedAssetIds.delete(id);
    } else {
      selectedAssetIds.add(id);
    }
    updateSelectedCount();
    syncSelectAllState();
  }

  function syncSelectAllState() {
    if (visibleAssetIds.length === 0) {
      selectAllCheckbox.checked = false;
      return;
    }
    const allVisibleSelected = visibleAssetIds.every(id => selectedAssetIds.has(id));
    selectAllCheckbox.checked = allVisibleSelected;
  }

  // Select all visible files
  selectAllCheckbox.addEventListener('change', () => {
    const checkState = selectAllCheckbox.checked;
    
    visibleAssetIds.forEach(id => {
      if (checkState) {
        selectedAssetIds.add(id);
      } else {
        selectedAssetIds.delete(id);
      }
    });

    // Update checkboxes UI
    const checkboxes = assetGrid.querySelectorAll('.asset-select-checkbox');
    checkboxes.forEach(cb => {
      cb.checked = checkState;
    });

    updateSelectedCount();
  });

  // Search & Filter listeners
  searchField.addEventListener('input', renderAssets);
  filterField.addEventListener('change', renderAssets);

  // Compile batch files ZIP animation
  downloadBtn.addEventListener('click', () => {
    if (selectedAssetIds.size === 0) {
      alert("Please select at least one media asset to download.");
      return;
    }

    // Disable triggers during simulation
    downloadBtn.disabled = true;
    downloadBtn.style.opacity = '0.5';
    progressWrapper.style.display = 'block';
    
    let currentPct = 0;
    progressBar.style.width = '0%';
    progressPct.textContent = '0%';

    const downloadInterval = setInterval(() => {
      currentPct += Math.floor(Math.random() * 8) + 4; // increment randomly between 4% and 11%
      if (currentPct >= 100) {
        currentPct = 100;
        clearInterval(downloadInterval);

        // Finished compiling simulation
        progressBar.style.width = '100%';
        progressPct.textContent = '100%';

        setTimeout(() => {
          // Trigger actual file download simulation (generates a mock txt file)
          const element = document.createElement('a');
          const fileContent = `AURA Palmier Developments - White-label Marketing Media Kit\n` + 
                              `Compiled Assets Count: ${selectedAssetIds.size}\n` +
                              `Files:\n` +
                              Array.from(selectedAssetIds).map(id => {
                                const asset = mediaAssets.find(a => a.id === id);
                                return `- ${asset.name} (${asset.type}, ${asset.size})`;
                              }).join('\n') + 
                              `\n\nGenerated dynamically on ${new Date().toLocaleString()}`;

          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
          element.setAttribute('download', `AURA-Broker-Kit-${Date.now()}.txt`);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);

          // Reset UI
          progressWrapper.style.display = 'none';
          downloadBtn.disabled = false;
          downloadBtn.style.opacity = '1';
          
          alert("White-label asset package compiled successfully! Your download has started.");
        }, 800);

      } else {
        progressBar.style.width = currentPct + '%';
        progressPct.textContent = currentPct + '%';
      }
    }, 80);
  });

  // Initial render
  renderAssets();
}

