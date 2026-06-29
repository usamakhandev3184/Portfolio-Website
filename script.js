/* =============================================
   USAMA KHAN PORTFOLIO — script.js
   ============================================= */

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
  }
}

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
function handleNavScroll() {
  if (navbar) {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ===== ACTIVE NAV LINK =====
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });
}
setActiveNavLink();

// ===== TYPING ANIMATION =====
const roles = [
  'MERN Stack Apps',
  'Laravel & PHP Backends',
  'WordPress Sites',
  'SEO Strategies',
];
const typedTextEl = document.getElementById('typedText');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function typeRole() {
  if (!typedTextEl) return;
  const current = roles[roleIndex];

  if (!isDeleting) {
    typedTextEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      typingTimeout = setTimeout(typeRole, 1800);
      return;
    }
  } else {
    typedTextEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  const speed = isDeleting ? 50 : 80;
  typingTimeout = setTimeout(typeRole, speed);
}

if (typedTextEl) {
  typeRole();
}

// ===== INTERSECTION OBSERVER — FADE IN UP =====
const fadeEls = document.querySelectorAll('.fade-in-up');
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach(el => fadeObserver.observe(el));

// ===== SKILL BAR ANIMATION =====
const skillBars = document.querySelectorAll('.skill-bar-fill');
if (skillBars.length > 0) {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const target = fill.getAttribute('data-width') || '0';
          fill.style.width = target + '%';
          skillObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );
  skillBars.forEach(bar => skillObserver.observe(bar));
}

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('[data-category]');

if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ===== CONTACT FORM (EmailJS) =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // reCAPTCHA check
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      if (formStatus) {
        formStatus.textContent = '✗ Please complete the "I\'m not a robot" check first.';
        formStatus.className = 'form-status error';
      }
      return;
    }

    if (formStatus) {
      formStatus.textContent = 'Sending...';
      formStatus.className = 'form-status';
    }

    // emailjs must be loaded on the contact page
    if (typeof emailjs === 'undefined') {
      if (formStatus) {
        formStatus.textContent = 'EmailJS not loaded. Please check setup.';
        formStatus.className = 'form-status error';
      }
      return;
    }

    const serviceID  = 'service_rzd5wyc';
    const templateID = 'template_91mqxg1';

    emailjs.sendForm(serviceID, templateID, this)
      .then(() => {
        if (formStatus) {
          formStatus.textContent = '✓ Message sent! I\'ll reply within 24 hours.';
          formStatus.className = 'form-status';
        }
        contactForm.reset();
        grecaptcha.reset();
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        if (formStatus) {
          formStatus.textContent = '✗ Something went wrong. Try WhatsApp or email directly.';
          formStatus.className = 'form-status error';
        }
        grecaptcha.reset();
      });
  });
}
