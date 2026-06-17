/* ============================================================
   GROVA — Premium Landing Page Template
   File    : script.js
   
   FEATURES:
   1. Backdrop scroll-shift animation
   2. Navbar scroll state + mobile menu
   3. Particle embers system
   4. Hero image float + fade on scroll
   5. Fixed cards reveal
   6. Section blur reveal
   7. Stats counter animation
   8. Menu filter tabs
   9. Scroll reveal animations
   10. Gallery marquee pause on hover
   11. Newsletter form handler
   12. Scroll to top button
   13. Toast notifications (add to cart)

   CUSTOMIZATION:
   - Particle colors configurable via COLORS array
   - Toast duration via TOAST_DURATION
   - Stats animation speed via STATS_DURATION
============================================================ */
(function () {

  /* ==========================================================
     CONFIGURATION
  ========================================================== */
  const TOAST_DURATION = 3000;           // Toast display time (ms)
  const STATS_DURATION = 2000;           // Stats counter animation (ms)
  const PARTICLE_DENSITY = 18000;        // Lower = more particles
  const COLORS = ['255,61,0', '255,109,0', '216,67,21']; // Fiery premium colors

  /* ==========================================================
     1. BACKDROP SCROLL SHIFT (Removed for performance)
     The continuous background-position update was causing heavy repaints and lag.
  ========================================================== */
  const backdrop = document.getElementById('backdrop');

  /* ==========================================================
     2. NAVBAR + MOBILE MENU
  ========================================================== */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  let mobileMenuOpen = false;

  // Navbar scroll state
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenuOpen = !mobileMenuOpen;
      mobileMenu.classList.toggle('open', mobileMenuOpen);
      document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuOpen = false;
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ==========================================================
     3. PARTICLES (embers)
  ========================================================== */
  const pCanvas = document.getElementById('particles-canvas');
  const pCtx = pCanvas.getContext('2d');
  let particles = [];

  function resizeParticles() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((pCanvas.width * pCanvas.height) / PARTICLE_DENSITY);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * pCanvas.width,
        y: Math.random() * pCanvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.5 + 0.15),
        size: Math.random() * 2 + 0.6,
        opacity: Math.random() * 0.5 + 0.15,
        opDir: Math.random() > 0.5 ? 1 : -1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
  }

  function animateParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      p.opacity += p.opDir * 0.003;
      if (p.opacity >= 0.55) { p.opacity = 0.55; p.opDir = -1; }
      if (p.opacity <= 0.05) { p.opacity = 0.05; p.opDir = 1; }

      if (p.y < -10) p.y = pCanvas.height + 10;
      if (p.x < -10) p.x = pCanvas.width + 10;
      if (p.x > pCanvas.width + 10) p.x = -10;

      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(${p.color},${p.opacity})`;
      pCtx.shadowBlur = p.size * 4;
      pCtx.shadowColor = `rgba(${p.color},0.8)`;
      pCtx.fill();
      pCtx.shadowBlur = 0;
    }
    requestAnimationFrame(animateParticles);
  }

  resizeParticles();
  window.addEventListener('resize', resizeParticles);
  animateParticles();

  /* ==========================================================
     4. HERO FADE ON SCROLL
  ========================================================== */
  const heroEl = document.getElementById('hero');
  function updateHeroOpacity() {
    if (!heroEl) return;
    const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.3));
    heroEl.style.opacity = fade;
  }
  window.addEventListener('scroll', updateHeroOpacity, { passive: true });

  /* ==========================================================
     5. FIXED CARDS REVEAL (Removed in favor of standard scroll flow)
  ========================================================== */
  // The massive fixed cards scroll animation has been removed to fix the empty space issue.
  // The features are now handled seamlessly by the IntersectionObserver reveal logic below.

  /* ==========================================================
     6. SECTION 3 BLUR REVEAL
  ========================================================== */
  const sectionThreeInner = document.getElementById('section-three-inner');
  if (sectionThreeInner) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        sectionThreeInner.classList.add('visible');
        observer.unobserve(sectionThreeInner);
      }
    }, { threshold: 0.15 });
    observer.observe(sectionThreeInner);
  }

  /* ==========================================================
     7. STATS COUNTER ANIMATION
  ========================================================== */
  const statsSection = document.getElementById('stats');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
      const target = parseFloat(item.dataset.target);
      const suffix = item.dataset.suffix || '';
      const isDecimal = item.dataset.decimal === 'true';
      const numberEl = item.querySelector('.stat-number');
      const startTime = performance.now();

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / STATS_DURATION);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;

        if (isDecimal) {
          numberEl.textContent = current.toFixed(1) + suffix;
        } else if (target >= 1000) {
          numberEl.textContent = Math.floor(current).toLocaleString() + suffix;
        } else {
          numberEl.textContent = Math.floor(current) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      }
      requestAnimationFrame(updateNumber);
    });
    statsAnimated = true;
  }

  if (statsSection) {
    const statsObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animateStats();
        statsObserver.unobserve(statsSection);
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  /* ==========================================================
     8. MENU FILTER TABS
  ========================================================== */
  const menuTabs = document.getElementById('menu-tabs');
  const menuGrid = document.getElementById('menu-grid');

  if (menuTabs && menuGrid) {
    menuTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab) return;

      // Update active tab
      menuTabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      const cards = menuGrid.querySelectorAll('.menu-card');

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

  /* ==========================================================
     9. SCROLL REVEAL ANIMATIONS
     Adds .reveal class elements appear with stagger on scroll.
  ========================================================== */
  const revealElements = document.querySelectorAll(
    '.feature-card, .hiw-step, .testimonial-card, .showcase-left, .showcase-right, .newsletter-content'
  );

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger the reveal slightly
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 100);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  /* ==========================================================
     10. GALLERY MARQUEE — Pause on hover
  ========================================================== */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* ==========================================================
     11. NEWSLETTER FORM
  ========================================================== */
  window.handleNewsletter = function (e) {
    e.preventDefault();
    const email = document.getElementById('newsletter-email');
    if (email && email.value) {
      showToast('Subscribed!', `We'll send updates to ${email.value}`);
      email.value = '';
    }
  };

  /* ==========================================================
     12. SCROLL TO TOP
  ========================================================== */
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================
     13. ADD TO CART + TOAST NOTIFICATIONS
  ========================================================== */
  let toastTimer = null;

  window.addToCart = function (e, name) {
    e.stopPropagation();
    showToast(name + ' added to cart!', 'Tap to review your order →');

    // Animate the button
    const btn = e.currentTarget;
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  };

  window.showToast = function (title, sub) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastSub').textContent = sub || "We'll have it ready soon 🔥";
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), TOAST_DURATION);
  };

})();
