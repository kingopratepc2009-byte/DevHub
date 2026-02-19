(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  function getNavbarHeight() {
    const nav = $(".navbar");
    return nav ? nav.getBoundingClientRect().height : 0;
  }

  // ----------------------------
  // Smooth scrolling with offset
  // ----------------------------
  function setupSmoothAnchors() {
    const links = $$('a[href^="#"]')
      .filter(a => a.getAttribute("href") && a.getAttribute("href") !== "#");

    links.forEach(link => {
      link.addEventListener("click", (e) => {
        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return;

        const target = document.getElementById(hash.slice(1));
        if (!target) return;

        e.preventDefault();

        const navOffset = getNavbarHeight();
        const top = target.getBoundingClientRect().top + window.pageYOffset - navOffset;

        window.scrollTo({
          top: Math.max(0, top),
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });

        // Keep URL in sync
        history.pushState(null, "", hash);
      });
    });
  }

  // ----------------------------------------
  // Close mobile navbar after clicking links
  // ----------------------------------------
  function setupNavbarAutoClose() {
    const collapseEl = $("#navbarNavDropdown");
    if (!collapseEl) return;

    // Works with Bootstrap if available; otherwise falls back gracefully.
    const bsCollapse =
      window.bootstrap?.Collapse?.getOrCreateInstance?.(collapseEl, { toggle: false }) ?? null;

    const closeIfOpen = () => {
      if (collapseEl.classList.contains("show")) {
        bsCollapse?.hide?.();
        // fallback
        collapseEl.classList.remove("show");
      }
    };

    $$('a.nav-link, .navbar .btn', collapseEl).forEach(el => {
      el.addEventListener("click", closeIfOpen);
    });
  }

  // ----------------------------
  // ScrollSpy (active nav link)
  // ----------------------------
  function setupScrollSpy() {
    const navLinks = $$('a.nav-link[href^="#"]')
      .filter(a => a.getAttribute("href")?.length > 1);

    if (!navLinks.length) return;

    const map = new Map(); // sectionId -> link
    navLinks.forEach(link => {
      const id = link.getAttribute("href").slice(1);
      const section = document.getElementById(id);
      if (section) map.set(id, link);
    });

    const sections = Array.from(map.keys()).map(id => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    // Ensure visible styling even if you didn't define .active in CSS
    // (Bootstrap usually styles .active, but your custom .nav-link color overrides it.)
    const ensureActiveStyle = (() => {
      const style = document.createElement("style");
      style.textContent = `
        .navbar .nav-link.active { color: #4f6ef7 !important; }
      `;
      document.head.appendChild(style);
      return true;
    })();

    const setActive = (id) => {
      navLinks.forEach(a => a.classList.remove("active"));
      const link = map.get(id);
      if (link) link.classList.add("active");
    };

    if (!("IntersectionObserver" in window)) {
      // Fallback: basic scroll handler
      const onScroll = () => {
        const navOffset = getNavbarHeight() + 10;
        let current = sections[0]?.id;

        for (const sec of sections) {
          const top = sec.getBoundingClientRect().top;
          if (top - navOffset <= 0) current = sec.id;
        }
        if (current) setActive(current);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return;
    }

    let bestId = null;
    let bestRatio = 0;

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestId = entry.target.id;
          }
        }
      }
      if (bestId) setActive(bestId);
      // reset for next batch
      bestRatio = 0;
    }, {
      root: null,
      threshold: [0.25, 0.4, 0.6, 0.8],
      rootMargin: `-${Math.round(getNavbarHeight())}px 0px -55% 0px`
    });

    sections.forEach(sec => io.observe(sec));
  }

  // ----------------------------
  // Reveal-on-scroll animations
  // ----------------------------
  function setupRevealOnScroll() {
    if (prefersReducedMotion) return;

    const revealEls = [
      ...$$('#features .col-md-4'),
      ...$$('#testimonials .col-md-4'),
      ...$$('#pricing .pricing-card'),
      ...$$('#faq .faq-item'),
      ...$$('#contact .grid-container6'),
      ...$$('footer .col-md-3'),
    ];

    if (!revealEls.length) return;

    // Initial state (inline styles so you don't need extra CSS)
    revealEls.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity 500ms ease, transform 500ms ease";
      el.style.willChange = "opacity, transform";
    });

    const reveal = (el, delayMs = 0) => {
      el.style.transitionDelay = `${delayMs}ms`;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    };

    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el, i) => reveal(el, Math.min(i * 60, 300)));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const siblings = Array.from(el.parentElement?.children ?? []);
        const idx = siblings.indexOf(el);
        const delay = idx >= 0 ? Math.min(idx * 80, 240) : 0;

        reveal(el, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => io.observe(el));
  }

  // ----------------------------
  // Stats count-up animation
  // ----------------------------
  function setupStatsCounter() {
    const statsSection = $("#stats-bar");
    if (!statsSection) return;

    const statEls = $$(".stat-number", statsSection);
    if (!statEls.length) return;

    const parsed = statEls.map(el => {
      const raw = el.textContent.trim();

      // supports: "500+", "50+", "10+", "123"
      const m1 = raw.match(/^(\d+)(\+?)$/);
      if (m1) return { el, type: "count", target: parseInt(m1[1], 10), suffix: m1[2] || "" };

      // leave as-is for strings like "24/7"
      return { el, type: "static", raw };
    });

    const animateNumber = (el, to, suffix = "", duration = 1200) => {
      const from = 0;
      const start = performance.now();

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const value = Math.floor(from + (to - from) * easeOutCubic(t));
        el.textContent = `${value.toLocaleString()}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    let ran = false;
    const run = () => {
      if (ran) return;
      ran = true;

      parsed.forEach((s, i) => {
        if (s.type !== "count") return;
        const delay = prefersReducedMotion ? 0 : i * 120;
        setTimeout(() => animateNumber(s.el, s.target, s.suffix, 1100), delay);
      });
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }

    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        run();
        io.disconnect();
      }
    }, { threshold: 0.35 });

    io.observe(statsSection);
  }

  // ----------------------------
  // FAQ accordion (accessible)
  // ----------------------------
  function setupFAQAccordion() {
    const items = $$("#faq .faq-item");
    if (!items.length) return;

    const closeAll = (exceptItem = null) => {
      items.forEach(item => {
        if (item === exceptItem) return;
        setOpen(item, false);
      });
    };

    const setOpen = (item, open) => {
      const q = $("h4", item);
      const p = $("p", item);
      const arrow = $(".faq-arrow", item);
      if (!q || !p) return;

      item.dataset.open = open ? "true" : "false";
      q.setAttribute("aria-expanded", open ? "true" : "false");

      // Keep your hover translateX; we only rotate by applying rotate via inline style
      if (arrow) arrow.style.transform = open ? "rotate(90deg)" : "rotate(0deg)";

      // Use the hidden attribute for accessibility
      if (prefersReducedMotion) {
        p.hidden = !open;
        return;
      }

      p.style.overflow = "hidden";

      if (open) {
        p.hidden = false;
        const h = p.scrollHeight;
        p.animate(
          [{ height: "0px", opacity: 0 }, { height: `${h}px`, opacity: 1 }],
          { duration: 220, easing: "ease-out" }
        ).onfinish = () => {
          p.style.height = "";
          p.style.opacity = "";
          p.style.overflow = "";
        };
      } else {
        if (p.hidden) return;
        const h = p.scrollHeight;
        p.animate(
          [{ height: `${h}px`, opacity: 1 }, { height: "0px", opacity: 0 }],
          { duration: 200, easing: "ease-in" }
        ).onfinish = () => {
          p.hidden = true;
          p.style.height = "";
          p.style.opacity = "";
          p.style.overflow = "";
        };
      }
    };

    // Initialize: close all
    items.forEach((item, idx) => {
      const q = $("h4", item);
      const p = $("p", item);
      if (!q || !p) return;

      q.style.cursor = "pointer";
      q.setAttribute("role", "button");
      q.setAttribute("tabindex", "0");
      q.setAttribute("aria-expanded", "false");

      p.hidden = true;
      item.dataset.open = "false";

      const toggle = () => {
        const isOpen = item.dataset.open === "true";
        closeAll(item);
        setOpen(item, !isOpen);
      };

      q.addEventListener("click", toggle);
      q.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setOpen(item, false);
        }
      });

      // Optional: open the first item by default
      // if (idx === 0) setOpen(item, true);
    });
  }

  // ----------------------------
  // Form validation + toast
  // ----------------------------
  function setupContactForm() {
    const form = $("#contact form");
    if (!form) return;

    const name = $("#nameInput", form);
    const email = $("#exampleInputEmail1", form);
    const inquiry = $("#inquiryType", form);
    const message = $("#message", form);
    const submitBtn = $('button[type="submit"]', form);

    if (!name || !email || !message || !submitBtn) return;

    // Add basic constraints without changing HTML
    name.required = true;
    email.required = true;
    message.required = true;
    message.minLength = 10;

    const ensureFeedbackEl = (field) => {
      let fb = field.parentElement?.querySelector(".invalid-feedback");
      if (!fb) {
        fb = document.createElement("div");
        fb.className = "invalid-feedback";
        field.parentElement?.appendChild(fb);
      }
      return fb;
    };

    const setInvalid = (field, msg) => {
      field.classList.add("is-invalid");
      field.classList.remove("is-valid");
      ensureFeedbackEl(field).textContent = msg;
    };

    const setValid = (field) => {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
    };

    const validate = () => {
      let ok = true;

      const nm = name.value.trim();
      if (nm.length < 2) {
        setInvalid(name, "Please enter your name (at least 2 characters).");
        ok = false;
      } else {
        setValid(name);
      }

      if (!email.checkValidity()) {
        setInvalid(email, "Please enter a valid email address.");
        ok = false;
      } else {
        setValid(email);
      }

      const msg = message.value.trim();
      if (msg.length < 10) {
        setInvalid(message, "Message should be at least 10 characters.");
        ok = false;
      } else {
        setValid(message);
      }

      return ok;
    };

    const showToast = (title, text) => {
      // Use Bootstrap toast if available; fallback to alert
      if (!window.bootstrap?.Toast) {
        alert(`${title}\n\n${text}`);
        return;
      }

      let container = $(".toast-container");
      if (!container) {
        container = document.createElement("div");
        container.className = "toast-container position-fixed bottom-0 end-0 p-3";
        container.style.zIndex = "2000";
        document.body.appendChild(container);
      }

      const toastEl = document.createElement("div");
      toastEl.className = "toast text-bg-dark border-0";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      toastEl.setAttribute("aria-atomic", "true");
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">
            <strong style="display:block; margin-bottom:4px;">${title}</strong>
            <div style="opacity:.9;">${text}</div>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `;

      container.appendChild(toastEl);
      const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3500 });
      toast.show();

      toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
    };

    // Validate on input
    [name, email, message].forEach(field => {
      field.addEventListener("input", () => {
        // Only validate if user already tried or field had an error
        if (field.classList.contains("is-invalid")) validate();
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) return;

      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";

      // If you later add a real endpoint, set: <form data-endpoint="https://...">
      const endpoint = form.dataset.endpoint;

      try {
        if (endpoint) {
          const payload = {
            name: name.value.trim(),
            email: email.value.trim(),
            inquiryType: inquiry?.value ?? "General Inquiry",
            message: message.value.trim(),
          };

          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) throw new Error("Request failed");
        } else {
          // Demo mode
          await new Promise(r => setTimeout(r, 650));
        }

        showToast("Submitted", "Thanks! We’ll get back to you shortly.");
        form.reset();
        [name, email, message].forEach(f => f.classList.remove("is-valid", "is-invalid"));
      } catch {
        showToast("Error", "Could not send your message. Please try again.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // ----------------------------
  // Back-to-top button
  // ----------------------------
  function setupBackToTop() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-primary";
    btn.setAttribute("aria-label", "Back to top");
    btn.textContent = "Top";

    // Inline styles so you don't need extra CSS
    Object.assign(btn.style, {
      position: "fixed",
      right: "18px",
      bottom: "18px",
      zIndex: "1500",
      borderRadius: "999px",
      padding: "10px 14px",
      display: "none",
      boxShadow: "0 10px 30px rgba(0,0,0,.35)",
    });

    document.body.appendChild(btn);

    const toggle = () => {
      btn.style.display = window.scrollY > 700 ? "inline-flex" : "none";
    };

    window.addEventListener("scroll", toggle, { passive: true });
    toggle();

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  // ----------------------------
  // Init
  // ----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    setupSmoothAnchors();
    setupNavbarAutoClose();
    setupScrollSpy();
    setupRevealOnScroll();
    setupStatsCounter();
    setupFAQAccordion();
    setupContactForm();
    setupBackToTop();
  });
})();