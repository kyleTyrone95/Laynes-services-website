/* ==========================================================================
   LAYNE'S SERVICES — V5 FINAL JS
   Combined: Enhanced loader/nav/cursor + Base hero/statement + Enhanced services + V3 cases

   1.  initLenis         — Smooth scroll via CDN
   2.  initNav           — Fullscreen overlay, clip-path circle, link stagger
   3.  initHeroTypewriter— Typewriter verb cycling (base style)
   4.  initHeroScale     — Scale + fade hero content on scroll
   5.  initStatementReveal— Scroll-driven character opacity (base)
   6.  initTextReveals   — Split [data-text-reveal] headings
   7.  initServiceRows   — Service row + divider reveals
   8.  initImageReveals  — Case card clip-path reveals (v3) + lightbox
   9.  initWatermark     — Cases watermark sticky scroll behavior
   10. initScrollReveal  — General .reveal IntersectionObserver
   11. initQuoteWizard   — 3-step form + Formspree
   ========================================================================== */


/* ==========================================================================
   2. LENIS — Smooth scroll
   ========================================================================== */

(function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    touchMultiplier: 2,
    infinite: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  /* Expose lenis for external use */
  window.__lenis = lenis;

  /* Handle anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.5 });
      }
    });
  });
})();



/* ==========================================================================
   4. NAVIGATION — Fullscreen overlay, clip-path circle, link stagger
   ========================================================================== */

(function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  if (!nav || !toggle) return;

  /* Wrap each overlay link text in a span for stagger animation */
  document.querySelectorAll('.nav-ol-link').forEach(link => {
    const text = link.textContent;
    link.innerHTML = `<span>${text}</span>`;
  });

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('overlay-open');

    if (isOpen) {
      nav.classList.remove('overlay-open');
      document.body.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
    } else {
      nav.classList.add('overlay-open');
      document.body.style.overflow = 'hidden';
      if (window.__lenis) window.__lenis.stop();
    }
  });

  /* Close on link click */
  document.querySelectorAll('.nav-ol-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('overlay-open');
      document.body.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
    });
  });
})();


/* ==========================================================================
   5. HERO TYPEWRITER — Base style (delete + type cycling)
   ========================================================================== */

(function initHeroTypewriter() {
  const VERBS            = ['install', 'remove', 'store', 'relocate'];
  const TYPE_SPEED       = 85;
  const DELETE_SPEED     = 50;
  const PAUSE_AFTER_TYPE = 4000;
  const PAUSE_AFTER_DEL  = 350;

  const verbEl = document.getElementById('hero-verb');
  const wrapEl = document.getElementById('verb-wrap');

  if (!verbEl || !wrapEl) return;

  /* Lock width to longest verb */
  let maxWidth = 0;
  VERBS.forEach(v => {
    verbEl.textContent = v;
    const w = verbEl.getBoundingClientRect().width;
    if (w > maxWidth) maxWidth = w;
  });
  wrapEl.style.minWidth = maxWidth + 'px';

  let verbIndex  = 0;
  let charIndex  = VERBS[0].length;
  let isDeleting = false;
  verbEl.textContent = VERBS[0];

  function tick() {
    const currentVerb = VERBS[verbIndex];

    if (isDeleting) {
      charIndex--;
      verbEl.textContent = currentVerb.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        verbIndex  = (verbIndex + 1) % VERBS.length;
        setTimeout(tick, PAUSE_AFTER_DEL);
        return;
      }
      setTimeout(tick, DELETE_SPEED);

    } else {
      charIndex++;
      verbEl.textContent = currentVerb.slice(0, charIndex);

      if (charIndex === currentVerb.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    }
  }

  setTimeout(() => {
    isDeleting = true;
    tick();
  }, PAUSE_AFTER_TYPE);
})();


/* ==========================================================================
   6. HERO SCALE + FADE + SCROLL INDICATOR
   ========================================================================== */

(function initHeroScale() {
  const content         = document.querySelector('.hero-content');
  const hero            = document.querySelector('.hero');
  const scrollIndicator = document.querySelector('.hero-scroll');
  if (!content || !hero) return;

  const SHRINK_AMOUNT = 0.14;
  const FADE_SPEED    = 1.5;

  function update() {
    const heroH    = hero.offsetHeight;
    const progress = Math.min(1, window.scrollY / heroH);

    const scale   = 1 - progress * SHRINK_AMOUNT;
    const opacity = 1 - progress * FADE_SPEED;

    content.style.transform = `scale(${Math.max(1 - SHRINK_AMOUNT, scale)})`;
    content.style.opacity   = String(Math.max(0, opacity));

    if (scrollIndicator) {
      scrollIndicator.style.opacity = String(Math.max(0, 1 - progress * 4));
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ==========================================================================
   7. STATEMENT REVEAL — Scroll-driven character opacity (base)
   ========================================================================== */

(function initStatementReveal() {
  const el = document.getElementById('statement-text');
  if (!el) return;

  const rawText = el.textContent.trim();
  el.innerHTML = rawText.split('').map(ch =>
    ch === ' ' ? ' ' : `<span class="char">${ch}</span>`
  ).join('');

  const chars = el.querySelectorAll('.char');
  const total = chars.length;

  function update() {
    const rect  = el.getBoundingClientRect();
    const viewH = window.innerHeight;

    const start    = viewH * 0.9;
    const end      = viewH * 0.15 - rect.height;
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));

    const litCount = Math.round(progress * total);

    chars.forEach((char, i) => {
      char.style.color = i < litCount ? 'var(--text)' : '';
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ==========================================================================
   8. TEXT REVEALS — Split [data-text-reveal] headings into word spans
   ========================================================================== */

(function initTextReveals() {
  const headings = document.querySelectorAll('[data-text-reveal]');
  if (!headings.length) return;

  headings.forEach(heading => {
    const text = heading.textContent;
    heading.innerHTML = '';

    const words = text.split(/\s+/);
    words.forEach((word, i) => {
      if (i > 0) {
        heading.appendChild(document.createTextNode(' '));
      }

      const outer = document.createElement('span');
      outer.className = 'word-outer';

      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.textContent = word;
      inner.style.transitionDelay = `${i * 80}ms`;

      outer.appendChild(inner);
      heading.appendChild(outer);
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const outers = entry.target.querySelectorAll('.word-outer');
        outers.forEach(o => o.classList.add('revealed'));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -60px 0px'
  });

  headings.forEach(h => observer.observe(h));
})();


/* ==========================================================================
   9. SERVICE ROWS — Scroll reveal for rows + dividers
   ========================================================================== */

(function initServiceRows() {
  const rows = document.querySelectorAll('.service-row');
  const dividers = document.querySelectorAll('.service-divider');
  const logos = document.querySelectorAll('.service-logos');
  if (!rows.length && !dividers.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  rows.forEach(row => observer.observe(row));
  dividers.forEach(d => observer.observe(d));
  logos.forEach(logo => observer.observe(logo));
})();


/* ==========================================================================
   9b. PILL WHEEL — Rotating steps animation
   ========================================================================== */

(function initPillWheel() {
  const wheel = document.querySelector('.pill-wheel');
  if (!wheel) return;

  const pills = wheel.querySelectorAll('.pill');
  const total = pills.length;
  let current = 0;
  const SPACING = 64;

  function layout() {
    pills.forEach((pill, i) => {
      let offset = i - current;

      /* Wrap around */
      if (offset > Math.floor(total / 2)) offset -= total;
      if (offset < -Math.floor(total / 2)) offset += total;

      const y = offset * SPACING;
      const dist = Math.abs(offset);
      const scale = dist === 0 ? 1.15 : Math.max(0.65, 0.82 - dist * 0.12);
      const opacity = dist === 0 ? 1 : Math.max(0.15, 0.5 - dist * 0.15);

      pill.style.transform = `translateY(${y}px) scale(${scale})`;
      pill.style.opacity = opacity;
      pill.classList.toggle('active', dist === 0);
    });
  }

  layout();
  setInterval(() => {
    current = (current + 1) % total;
    layout();
  }, 1800);
})();


/* ==========================================================================
   10. IMAGE REVEALS + LIGHTBOX — Case card clip-path reveal (v3) + lightbox
   ========================================================================== */

(function initImageReveals() {
  const cards = document.querySelectorAll('[data-reveal-img]');
  if (!cards.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  });

  cards.forEach(card => observer.observe(card));

  /* Lightbox */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  if (!lightbox || !lightboxImg) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.__lenis) window.__lenis.stop();
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (window.__lenis) window.__lenis.start();
  }

  lightboxClose.addEventListener('click', e => { e.stopPropagation(); closeLightbox(); });
  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();


/* ==========================================================================
   10b. CASES WATERMARK — Sticky scroll behavior
   ========================================================================== */

(function initWatermark() {
  const wm = document.getElementById('cases-watermark');
  const section = document.querySelector('.section-cases');
  if (!wm || !section) return;

  function update() {
    const sRect = section.getBoundingClientRect();
    const viewH = window.innerHeight;
    const wmH = wm.offsetHeight;

    /* Center position for the watermark in viewport */
    const centerY = (viewH - wmH) / 2;

    /* Section top relative to viewport */
    const sTop = sRect.top;
    const sBottom = sRect.bottom;
    const sHeight = sRect.height;

    /* Is section in view at all? */
    if (sBottom < 0 || sTop > viewH) {
      wm.classList.remove('visible', 'wm-fixed', 'wm-bottom');
      wm.style.top = '0px';
      return;
    }

    wm.classList.add('visible');

    /* How far down the section top is from causing the wm to be centered */
    const fixStart = sTop - centerY; /* when sTop <= centerY, watermark should fix */
    /* When section bottom would push watermark up */
    const fixEnd = sBottom - centerY - wmH;

    if (fixStart > 0) {
      /* Section hasn't scrolled enough — watermark at top of section */
      wm.classList.remove('wm-fixed', 'wm-bottom');
      wm.style.top = '0px';
    } else if (fixEnd > 0) {
      /* Watermark is fixed in center of viewport */
      wm.classList.add('wm-fixed');
      wm.classList.remove('wm-bottom');
      wm.style.top = '';
    } else {
      /* Section scrolling past — pin watermark to bottom */
      wm.classList.remove('wm-fixed');
      wm.classList.add('wm-bottom');
      wm.style.top = '';
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();


/* ==========================================================================
   11. SCROLL REVEAL — General .reveal IntersectionObserver
   ========================================================================== */

(function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ==========================================================================
   12. QUOTE WIZARD — 3-step form + Formspree submission
   ========================================================================== */

(function initQuoteWizard() {
  const wizard = document.getElementById('quote-wizard');
  if (!wizard) return;

  const steps = wizard.querySelectorAll('.qw-step');
  const dots = wizard.querySelectorAll('.qw-dot');
  const backBtn = document.getElementById('qw-back');
  const nextBtn = document.getElementById('qw-next');
  const form = document.getElementById('quote-form');

  let current = 0;
  const totalSteps = steps.length;

  function updateUI() {
    steps.forEach(s => s.classList.remove('active'));
    steps[current].classList.add('active');

    dots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i < current) dot.classList.add('done');
      else if (i === current) dot.classList.add('active');
    });

    backBtn.classList.toggle('hidden', current === 0);

    if (current === totalSteps - 1) {
      nextBtn.classList.add('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      nextBtn.disabled = false;
    }

    validateStep();
  }

  function isValidEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }

  function validateStep() {
    if (current === 1) {
      const name = form.querySelector('input[name="name"]');
      const email = form.querySelector('input[name="email"]');
      nextBtn.disabled = !(name.value.trim() && email.value.trim() && isValidEmail(email.value.trim()));
    }
  }

  nextBtn.addEventListener('click', () => {
    if (current < totalSteps - 1) {
      current++;
      updateUI();
    }
  });

  backBtn.addEventListener('click', () => {
    if (current > 0) {
      current--;
      updateUI();
    }
  });

  /* Service toggles */
  wizard.querySelectorAll('.qw-svc').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
    });
  });

  /* Live validation */
  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  if (nameInput) nameInput.addEventListener('input', validateStep);
  if (emailInput) emailInput.addEventListener('input', validateStep);

  /* Form submission */
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('.qw-submit');
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();

    if (!name || !email) {
      submitBtn.textContent = 'Name and email are required';
      setTimeout(() => { submitBtn.textContent = 'Send Enquiry'; }, 2500);
      return;
    }

    if (!isValidEmail(email)) {
      submitBtn.textContent = 'Please enter a valid email';
      setTimeout(() => { submitBtn.textContent = 'Send Enquiry'; }, 2500);
      return;
    }

    const services = Array.from(wizard.querySelectorAll('.qw-svc.selected'))
      .map(btn => btn.dataset.value)
      .join(', ');

    const data = new FormData(form);
    data.append('services', services);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    /*
     * Web3Forms — replace YOUR_WEB3FORMS_KEY in index.html
     * Get your free key at https://web3forms.com
     */
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    })
    .then(response => {
      if (response.ok) {
        submitBtn.textContent = "Sent! We'll be in touch.";

        setTimeout(() => {
          submitBtn.textContent = 'Send Enquiry';
          submitBtn.disabled = false;
          form.reset();
          resetWizard();
        }, 3000);
      } else {
        submitBtn.textContent = 'Something went wrong — try again';
        submitBtn.disabled = false;
      }
    })
    .catch(() => {
      submitBtn.textContent = 'Network error — try again';
      submitBtn.disabled = false;
    });
  });

  function resetWizard() {
    current = 0;
    wizard.querySelectorAll('.qw-svc').forEach(s => s.classList.remove('selected'));
    if (typeof hcaptcha !== 'undefined') hcaptcha.reset();
    updateUI();
  }

  updateUI();
})();
