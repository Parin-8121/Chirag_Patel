// Utility selectors
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

// PRELOADER
window.addEventListener("load", () => {
  setTimeout(() => {
    const preloader = $("#preloader");
    if (preloader) preloader.classList.add("hidden");
  }, 600);
});

// THEME (Dark / Light)
(function initTheme() {
  const body = document.body;
  const toggle = $(".mode-toggle");
  const icon = $(".mode-icon");
  if (!toggle || !icon) return;

  const stored = localStorage.getItem("theme");
  if (stored === "light") {
    body.classList.add("light");
    icon.textContent = "☀";
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("light");
    const isLight = body.classList.contains("light");
    icon.textContent = isLight ? "☀" : "☾";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
})();

// NAV (Mobile)
(function initNav() {
  const navToggle = $(".nav-toggle");
  const navLinks = $(".nav-links");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  // Close menu on link click (mobile)
  $$(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });
})();

// SCROLL PROGRESS + BACK TO TOP
(function initScrollStuff() {
  const progressBar = $("#scroll-progress");
  const backToTop = $(".back-to-top");

  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${percent}%`;

    if (backToTop) {
      if (scrollTop > 400) backToTop.classList.add("show");
      else backToTop.classList.remove("show");
    }
  };

  window.addEventListener("scroll", onScroll);
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();

// REVEAL ON SCROLL
(function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  $$(".reveal").forEach(el => observer.observe(el));
})();

// COUNTERS (Home page)
(function initCounters() {
  const counters = $$(".counter");
  if (!counters.length) return;

  const animateCounter = el => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.max(1, Math.round(target / 60));

    const tick = () => {
      current += step;
      if (current >= target) {
        el.textContent = target;
      } else {
        el.textContent = current;
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
})();

// FAQ ACCORDION
(function initFAQ() {
  $$(".faq-item").forEach(item => {
    const btn = $(".faq-question", item);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // Close others
      $$(".faq-item.open").forEach(openItem => {
        if (openItem !== item) openItem.classList.remove("open");
      });
      item.classList.toggle("open", !isOpen);
    });
  });
})();

// CONTACT FORM VALIDATION + FORMSPREE
(function initForm() {
  const form = $("#contact-form");
  if (!form) return;

  const status = $("#form-status");
  const showError = (id, msg) => {
    const el = $(`.error-message[data-for="${id}"]`);
    if (el) el.textContent = msg || "";
  };

  form.addEventListener("submit", e => {
    if (status) {
      status.textContent = "";
      status.className = "form-status";
    }

    const name = $("#name")?.value.trim() || "";
    const email = $("#email")?.value.trim() || "";
    const message = $("#message")?.value.trim() || "";

    let valid = true;

    if (!name) {
      showError("name", "Please enter your name.");
      valid = false;
    } else showError("name", "");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showError("email", "Please enter a valid email.");
      valid = false;
    } else showError("email", "");

    if (!message) {
      showError("message", "Please enter a message.");
      valid = false;
    } else showError("message", "");

    if (!valid) {
      e.preventDefault();
      if (status) {
        status.textContent = "Please fix the highlighted fields.";
        status.classList.add("error");
      }
      return;
    }

    if (status) {
      status.textContent = "Sending...";
      status.classList.remove("error");
    }
    // Let the browser submit to Formspree
  });
})();
