// Section Loader - Dynamically load HTML sections
async function loadSections() {
  const sections = [
    { id: 'header-container', file: 'sections/header.html' },
    { id: 'hero-container', file: 'sections/hero.html' },
    { id: 'stats-container', file: 'sections/stats.html' },
    { id: 'projects-container', file: 'sections/projects.html' },
    { id: 'calculator-container', file: 'sections/calculator.html' },
    { id: 'rental-container', file: 'sections/rental-hub.html' },
    { id: 'progress-container', file: 'sections/progress.html' },
    { id: 'media-container', file: 'sections/media-center.html' },
    { id: 'jv-container', file: 'sections/jv-partners.html' },
    { id: 'contact-container', file: 'sections/contact.html' }
  ];

  try {
    for (const section of sections) {
      const response = await fetch(section.file);
      if (!response.ok) throw new Error(`Failed to load ${section.file}`);
      const html = await response.text();
      const container = document.getElementById(section.id);
      if (container) {
        container.innerHTML = html;
      }
    }
  } catch (error) {
    console.error(`Error loading sections:`, error);
  } finally {
    // Hide preloader after all sections are loaded
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    }
  }
}

// Load sections when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadSections();
});
