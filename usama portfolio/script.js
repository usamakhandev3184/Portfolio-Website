/* ================================================
   script.js — Usama Khan Portfolio
   Works across: index.html, about.html,
                 projects.html, contact.html
   ================================================ */


/* ── 1. MOBILE NAV TOGGLE ── */
const mobileToggle = document.getElementById('mobile-toggle');
const navList      = document.getElementById('nav-list');

if (mobileToggle && navList) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('show');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when any nav link is clicked
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('show');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ── 2. HEADER SHADOW ON SCROLL ── */
const header = document.getElementById('header');

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
}


/* ── 3. SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ── 4. PROJECT FILTER (projects.html) ── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#project-grid .project-card');

if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const show = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
}


/* ── 5. CONTACT FORM (contact.html) ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    // Validate required fields — highlight empty ones in red
    const required = contactForm.querySelectorAll('input[required], textarea[required]');
    let valid = true;

    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e53935';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Show success message, hide form
    contactForm.style.display = 'none';
    if (formSuccess) formSuccess.style.display = 'block';

    // Reset after 5 seconds
    setTimeout(() => {
      contactForm.reset();
      contactForm.style.display = 'flex';
      if (formSuccess) formSuccess.style.display = 'none';
    }, 5000);
  });

  // Clear red border when user starts typing
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}


/* ── 6. SKILL BAR ANIMATION (about.html) ── */
const skillBars = document.querySelectorAll('.skill-bar-fill');

if (skillBars.length > 0) {
  // Store target widths then reset to 0
  const targets = [];
  skillBars.forEach(bar => {
    targets.push(bar.style.width);
    bar.style.width = '0%';
    bar.style.transition = 'width 1s ease';
  });

  // Animate when bars scroll into view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = targets[i];
          }, i * 100);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const skillsSection = document.querySelector('.skills-full');
  if (skillsSection) observer.observe(skillsSection);
}
