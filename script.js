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


/* ── 1b. ACTIVE NAV LINK — highlight current page ── */
(function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('#nav-list a');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    // Match exact page — also treat '' or '/' as index.html
    const isHome = (currentPage === '' || currentPage === 'index.html') && (linkPage === 'index.html');
    const isMatch = linkPage === currentPage;

    if (isHome || isMatch) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();


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


/* ── 5. CONTACT FORM (contact.html via Formspree AJAX) ── */
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

    // UI Loading State UI feedback
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Send data to Formspree using Fetch API
    const formData = new FormData(contactForm);
    
    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Show success message, hide form
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
        contactForm.reset();
        
        // Form states automation rollback after 5 seconds
        setTimeout(() => {
          contactForm.style.display = ''; 
          if (formSuccess) formSuccess.style.display = 'none';
        }, 5000);

      } else {
        alert('Oops! Something went wrong on Formspree. Please try again.');
      }
    })
    .catch(error => {
      alert('Network error! Please check your internet connection.');
    })
    .then(() => {
      // Reset button state regardless of success/error response
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    });
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
    bar.style.transition = 'width 1s cubic-bezier(0.1, 1, 0.1, 1)';
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
  }, { threshold: 0.2 });

  const skillsSection = document.querySelector('.skills-full');
  if (skillsSection) observer.observe(skillsSection);
}

/* ── 7. DARK/LIGHT THEME CONTROLLER ── */
const themeToggleBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

// Check browser local storage logic on initialization
if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
  if (themeToggleBtn) themeToggleBtn.innerHTML = '🌙';
} else {
  document.body.classList.remove('light-mode');
  if (themeToggleBtn) themeToggleBtn.innerHTML = '☀️';
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    let activeTheme = 'dark';
    if (document.body.classList.contains('light-mode')) {
      activeTheme = 'light';
      themeToggleBtn.innerHTML = '🌙'; // Switch icon to moon for light mode
    } else {
      themeToggleBtn.innerHTML = '☀️'; // Switch icon to sun for dark mode
    }
    
    // Save state to avoid reset on refresh
    localStorage.setItem('portfolio-theme', activeTheme);
  });
}


/* ── 7. SCROLL FADE-IN ANIMATION ── */
const fadeEls = document.querySelectorAll(
  '.project-card, .skill-category, .timeline-item, .about-preview-inner, .contact-info-col, .contact-form-col'
);

fadeEls.forEach(el => el.classList.add('fade-in-up'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));
