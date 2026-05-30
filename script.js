/**
 * OMOWUMI Stephen — Portfolio Script
 * Handles: loader, custom cursor, scroll nav, mobile menu,
 *          scroll-reveal animations, active nav links, footer year
 */

/* ═══════════════════════════════════════════
   LOADER
═══════════════════════════════════════════ */
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  // Allow the loader fill animation (1.6s) to finish, then hide
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger initial visible reveals after loader disappears
    checkReveal();
  }, 1800);
});

// Prevent scroll flash during load
document.body.style.overflow = 'hidden';

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════ */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let rafId;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth-follow the follower dot with RAF
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  rafId = requestAnimationFrame(animateFollower);
}
animateFollower();

// Expand cursor on interactive elements
const hoverTargets = document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card, .contact-item');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('expanded');
    cursorFollower.classList.add('expanded');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('expanded');
    cursorFollower.classList.remove('expanded');
  });
});

/* ═══════════════════════════════════════════
   NAVIGATION — SCROLL BEHAVIOUR
═══════════════════════════════════════════ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  // Sticky nav glass effect
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active link highlight
  highlightActiveNav();

  // Reveal elements
  checkReveal();
}, { passive: true });

/* ═══════════════════════════════════════════
   ACTIVE NAV LINK
═══════════════════════════════════════════ */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function highlightActiveNav() {
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL HELPER (for buttons / CTA)
═══════════════════════════════════════════ */
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Smooth-scroll all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    // Close mobile menu if open
    closeMobileMenu();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

function openMobileMenu() {
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on backdrop click (outside the links)
mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) closeMobileMenu();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

function checkReveal() {
  const windowHeight = window.innerHeight;

  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    // Trigger when top of element is within 85% of viewport height
    if (rect.top < windowHeight * 0.88) {
      el.classList.add('visible');
    }
  });
}

// Initial check (after loader)
function initReveal() {
  checkReveal();
}

/* ═══════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = contactForm.querySelector('#name').value.trim();
    const email   = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      showFormFeedback('Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate submission (replace with real API endpoint / EmailJS / Formspree)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending… <i class="ri-loader-4-line ri-spin"></i>';

    setTimeout(() => {
      showFormFeedback('Message sent! I\'ll be in touch within 24 hours.', 'success');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message <i class="ri-send-plane-line"></i>';
    }, 1500);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormFeedback(msg, type) {
  // Remove any existing feedback
  const existing = document.querySelector('.form-feedback');
  if (existing) existing.remove();

  const el = document.createElement('p');
  el.className = `form-feedback mono ${type}`;
  el.textContent = msg;
  el.style.cssText = `
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    padding: 12px 16px;
    border-radius: 6px;
    text-align: center;
    margin-top: -8px;
    ${type === 'success'
      ? 'color: #00c48c; background: rgba(0,196,140,0.1); border: 1px solid rgba(0,196,140,0.2);'
      : 'color: #ff7a3d; background: rgba(255,122,61,0.1); border: 1px solid rgba(255,122,61,0.2);'
    }
  `;
  contactForm.appendChild(el);

  // Auto-remove after 5s
  setTimeout(() => el.remove(), 5000);
}

/* ═══════════════════════════════════════════
   FOOTER YEAR
═══════════════════════════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════
   HERO TEXT TYPING EFFECT (subtle)
   Animates the role line on page load
═══════════════════════════════════════════ */
(function initHeroTyping() {
  const roleEl = document.querySelector('.hero-role');
  if (!roleEl) return;

  const fullText = roleEl.textContent;
  roleEl.textContent = '';

  // Start after loader hides
  setTimeout(() => {
    let i = 0;
    const interval = setInterval(() => {
      roleEl.textContent += fullText[i];
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 28);
  }, 2000);
})();

/* ═══════════════════════════════════════════
   PARALLAX — subtle hero grid on mousemove
═══════════════════════════════════════════ */
const heroGrid = document.querySelector('.hero-grid');
const heroGlow = document.querySelector('.hero-glow');

if (heroGrid && heroGlow) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroGrid.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
    heroGlow.style.transform = `translateY(-50%) translate(${x * 0.6}px, ${y * 0.6}px)`;
  });
}

/* ═══════════════════════════════════════════
   INTERSECTION OBSERVER (backup for reveal)
═══════════════════════════════════════════ */
if ('IntersectionObserver' in window) {
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}
