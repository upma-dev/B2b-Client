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

  for (const section of sections) {
    try {
      const response = await fetch(`./${section.file}`);

      if (!response.ok) {
        console.warn(`Failed to load ${section.file}`);
        continue;
      }

      const html = await response.text();

      const container = document.getElementById(section.id);

      if (container) {
        container.innerHTML = html;
      }

    } catch (error) {
      console.error(`Error loading ${section.file}:`, error);
    }
  }

  // ALWAYS remove preloader
  const preloader = document.getElementById('preloader');

  if (preloader) {
    preloader.classList.add('fade-out');

    setTimeout(() => {
      preloader.remove();``
    }, 600);
  }
}

document.addEventListener('DOMContentLoaded', loadSections);