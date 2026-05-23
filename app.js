/* ============================================================
   SKY HIGH FPV — app.js
   Interactivity: Nav, Particles, Filters, Form, Scroll Reveals
   ============================================================ */

/* ---- NAVBAR scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- Hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---- Particle System ---- */
(function createParticles() {
  const container = document.getElementById('particles');
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 1;
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 8 + 6;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      opacity:0;
    `;
    container.appendChild(p);
  }
})();

/* ---- Hero Drone 3D parallax tilt ---- */
const heroDroneWrap = document.querySelector('.hero-drone-wrap');
const heroDrone = document.getElementById('hero-drone');
if (heroDroneWrap && heroDrone) {
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    heroDrone.style.transform = `
      translateY(${Math.sin(Date.now() / 1000) * 10}px)
      rotateY(${dx * 15}deg)
      rotateX(${-dy * 10}deg)
      rotate(${dx * 2}deg)
    `;
  });
}

/* ---- Project Filter ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const tag = card.dataset.tag;
      if (filter === 'all' || tag === filter) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 350);
      }
    });
  });
});

/* ---- Estimate Form Live Summary Preview ---- */
const catEl = document.getElementById('category');
const ucEl = document.getElementById('use-case');
const budgetEl = document.getElementById('budget');
const timelineEl = document.getElementById('timeline');

function updateSummary() {
  const getLabel = (el) => el.options[el.selectedIndex]?.text || '—';
  document.getElementById('s-category').textContent = catEl.value ? getLabel(catEl) : '—';
  document.getElementById('s-usecase').textContent = ucEl.value ? getLabel(ucEl) : '—';
  document.getElementById('s-budget').textContent = budgetEl.value ? getLabel(budgetEl) : '—';
  document.getElementById('s-timeline').textContent = timelineEl.value ? getLabel(timelineEl) : '—';
}

[catEl, ucEl, budgetEl, timelineEl].forEach(el => {
  if (el) el.addEventListener('change', updateSummary);
});

/* ---- Form submission ---- */
const estimateForm = document.getElementById('estimate-form');
const successMsg = document.getElementById('success-msg');
const btnSubmit = document.getElementById('btn-submit');

if (estimateForm) {
  estimateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation highlight
    let valid = true;
    const required = estimateForm.querySelectorAll('[required]');
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
        valid = false;
        field.addEventListener('input', () => {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }, { once: true });
      }
    });

    if (!valid) {
      const firstInvalid = estimateForm.querySelector('[required]:not([value]):invalid, [required][value=""]:invalid');
      return;
    }

    // Simulate sending
    btnSubmit.disabled = true;
    btnSubmit.querySelector('.btn-text').textContent = '⏳ Sending...';
    setTimeout(() => {
      btnSubmit.disabled = false;
      btnSubmit.querySelector('.btn-text').textContent = '🚁 Send My Request';
      estimateForm.reset();
      updateSummary();
      successMsg.style.display = 'flex';
    }, 1800);
  });
}

/* ---- Close success message ---- */
if (successMsg) {
  successMsg.addEventListener('click', (e) => {
    if (e.target === successMsg) successMsg.style.display = 'none';
  });
}

/* ---- Scroll Reveal Animation ---- */
const revealEls = document.querySelectorAll(
  '.service-card, .project-card, .step, .testi-card, .sidebar-card'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---- Service card click → go to estimate ---- */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') return;
    const cat = card.dataset.category;
    if (cat && catEl) {
      catEl.value = cat;
      updateSummary();
      document.getElementById('estimate').scrollIntoView({ behavior: 'smooth' });
    }
  });
  card.style.cursor = 'pointer';
});

/* ---- Animated counter for hero stats ---- */
function animateCount(el, target, prefix = '', suffix = '') {
  const duration = 1500;
  const start = Date.now();
  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(ease * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target + suffix;
  };
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = document.querySelectorAll('.stat-num');
      animateCount(statNums[0], 120, '', '+');
      animateCount(statNums[1], 50, '', '+');
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ---- Smooth active nav link highlight on scroll ---- */
const sections = document.querySelectorAll('section[id], footer[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
        a.style.background = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--cyan)';
          a.style.background = 'rgba(0,212,255,0.1)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

/* ---- Drone hover tilt reset on mobile ---- */
if (window.matchMedia('(max-width: 768px)').matches && heroDrone) {
  heroDrone.style.transform = '';
}

/* ---- Fetch dynamic content from CMS ---- */
fetch('/api/content')
  .then(res => res.json())
  .then(data => {
    if (data.general) {
      document.getElementById('h-logo-text').textContent = data.general.logo_text || '';
      document.getElementById('h-logo-accent').textContent = data.general.logo_accent || '';
      
      if (data.general.contact_phone) {
        const phone = data.general.contact_phone;
        const footerPhone = document.getElementById('footer-phone');
        if (footerPhone) footerPhone.textContent = '📱 ' + phone;
        
        const waLink = document.getElementById('wa-link');
        if (waLink) waLink.href = 'https://wa.me/' + phone.replace(/\D/g, '');
      }
      
      if (data.general.contact_email) {
        const email = data.general.contact_email;
        const footerEmail = document.getElementById('footer-email');
        if (footerEmail) footerEmail.textContent = '📧 ' + email;
        
        const emailLink = document.getElementById('email-link');
        if (emailLink) emailLink.href = 'mailto:' + email;
      }
    }
    if (data.hero) {
      document.getElementById('h-badge').textContent = data.hero.badge || '';
      document.getElementById('h-line1').textContent = data.hero.title_line1 || '';
      document.getElementById('h-line2').textContent = data.hero.title_line2 || '';
      document.getElementById('h-glow').textContent = data.hero.title_glow || '';
      document.getElementById('h-sub').innerHTML = data.hero.subtitle || '';
      if (data.hero.image) {
        document.getElementById('hero-drone').src = data.hero.image;
      }
    }
    if (data.services) {
      const sGrid = document.getElementById('dynamic-services-grid');
      let html = '';
      data.services.forEach(s => {
        const badgeHtml = s.badge ? `<div class="service-badge">${s.badge}</div>` : '';
        const featHtml = s.features.map(f => `<li>${f}</li>`).join('');
        html += `
          <div class="service-card" data-category="${s.id}" id="service-${s.id}">
            <div class="service-icon">${s.icon}</div>
            ${badgeHtml}
            <h3>${s.title}</h3>
            <p>${s.description}</p>
            <ul class="service-list">${featHtml}</ul>
            <a href="#estimate" class="service-cta">Order Now →</a>
          </div>
        `;
      });
      sGrid.innerHTML = html;
      
      // Re-bind service card click events
      document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.tagName === 'A') return;
          const cat = card.dataset.category;
          if (cat && catEl) {
            catEl.value = cat;
            updateSummary();
            document.getElementById('estimate').scrollIntoView({ behavior: 'smooth' });
          }
        });
        card.style.cursor = 'pointer';
        revealObserver.observe(card);
      });
    }
    
    if (data.projects) {
      const pGrid = document.getElementById('dynamic-projects-grid');
      let html = '';
      data.projects.forEach(p => {
        const imgStyle = p.image ? `background: url('${p.image}') center/cover;` : `background: ${p.gradient};`;
        const specsHtml = p.specs.map(sp => `<span>${sp}</span>`).join('');
        
        let overlayText = "";
        if (p.tag === "custom") overlayText = "Custom Build";
        if (p.tag === "event") overlayText = "Event Shoot";
        if (p.tag === "race") overlayText = "Race Build";
        if (p.tag === "pnp") overlayText = "PNP Build";

        html += `
          <div class="project-card" data-tag="${p.tag}" id="${p.id}">
            <div class="project-img" style="${imgStyle}">
              ${p.image ? '' : `<div class="proj-drone-art">${p.art_icon}<br/><small>${p.art_text}</small></div>`}
              <div class="project-overlay">
                <span class="proj-tag">${overlayText}</span>
              </div>
            </div>
            <div class="project-info">
              <h4>${p.title}</h4>
              <p>${p.description}</p>
              <div class="proj-specs">${specsHtml}</div>
            </div>
          </div>
        `;
      });
      pGrid.innerHTML = html;
      
      // Re-bind filter Logic?
      // Re-observe for reveal
      document.querySelectorAll('.project-card').forEach(c => revealObserver.observe(c));
    }
  })
  .catch(err => console.error("Error fetching content", err));

console.log('%c🚁 Sky High FPV', 'font-size:24px;color:#00d4ff;font-weight:bold;');
console.log('%cBuilt with passion for the FPV community.', 'color:#94a3b8;font-size:13px;');
