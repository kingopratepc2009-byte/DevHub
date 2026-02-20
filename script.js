// ════════════════════════════════════════════════════════════════
//  DEVHUB — ULTIMATE JAVASCRIPT ENGINE v2.0
// ════════════════════════════════════════════════════════════════
//
//  ███████████████████████████████████████████████████████████
//  █  FEATURES INDEX (50+ Systems)                          █
//  ███████████████████████████████████████████████████████████
//
//  CORE SYSTEMS
//  ─────────────────────────────────────────────────────────
//   01. Preloader — animated spinner + percentage counter
//   02. Style Injection — all dynamic CSS
//   03. UI Factory — creates all UI elements
//
//  VISUAL EFFECTS
//  ─────────────────────────────────────────────────────────
//   04. Particle Network — interactive canvas (mouse-reactive)
//   05. Custom Cursor — dot + trailing circle
//   06. Cursor Spotlight — glow follows mouse on cards
//   07. Ambient Cursor Glow — large soft glow
//   08. Film Grain Overlay — subtle noise texture
//   09. Animated Gradient Hero — shifting background
//   10. Floating Shapes — geometric shapes in hero
//
//  TEXT EFFECTS
//  ─────────────────────────────────────────────────────────
//   11. Typewriter — cycling phrases with delete
//   12. Text Scramble — decode effect on headings
//   13. Animated Gradient Text — on section titles
//   14. Word-by-Word Reveal — staggered word appearance
//   15. Glitch Text — on hover
//
//  SCROLL SYSTEMS
//  ─────────────────────────────────────────────────────────
//   16. Scroll Reveal — 6 animation types
//   17. Parallax Engine — depth layers
//   18. Scroll Progress Bar — gradient top bar
//   19. Section Progress Indicators — dots sidebar
//   20. Scroll Velocity Effects — speed-reactive
//   21. Scroll Direction Detection — navbar auto-hide
//   22. Scroll-Linked Animations — progress-based
//
//  NAVIGATION
//  ─────────────────────────────────────────────────────────
//   23. Smart Navbar — shrink + blur + shadow
//   24. Active Link Tracker — highlights current section
//   25. Mobile Menu — auto-close on click
//   26. Smooth Scroll — enhanced with easing
//   27. Back to Top — animated button
//   28. Command Palette — Ctrl+K search
//   29. Keyboard Shortcuts — full keyboard nav
//
//  INTERACTIVE COMPONENTS
//  ─────────────────────────────────────────────────────────
//   30. FAQ Accordion — smooth expand/collapse
//   31. Pricing Toggle — monthly/yearly switch
//   32. Form Validation — real-time + advanced
//   33. Magnetic Buttons — attract toward cursor
//   34. Ripple Effect — material design on clicks
//   35. 3D Tilt Cards — perspective transform
//   36. Card Spotlight — inner glow on hover
//   37. Testimonial Auto-Rotate — carousel
//   38. Stats Counter — eased counting animation
//
//  UI SYSTEMS
//  ─────────────────────────────────────────────────────────
//   39. Toast Notifications — slide-in messages
//   40. Theme Toggle — dark/light mode
//   41. Cookie Consent — GDPR banner
//   42. Sound Effects — toggleable UI sounds
//   43. Context Menu — custom right-click
//   44. Tooltip System — hover tooltips
//
//  FUN & EASTER EGGS
//  ─────────────────────────────────────────────────────────
//   45. Konami Code — rainbow + confetti
//   46. Matrix Rain — toggle with Ctrl+M
//   47. Party Mode — disco lights
//   48. Click Sparkles — particles on click
//
//  PERFORMANCE & UTILITIES
//  ─────────────────────────────────────────────────────────
//   49. FPS Monitor — toggle with Ctrl+Shift+F
//   50. Lazy Observer Manager — efficient IO pooling
//   51. Local Storage Manager — persist preferences
//   52. Debounce / Throttle — utility functions
//   53. Analytics Tracker — simulated events
//   54. Accessibility — focus management, ARIA
//
// ════════════════════════════════════════════════════════════════

;(function () {
    'use strict';

    // ─── Global State ───
    const STATE = {
        theme:          localStorage.getItem('devhub-theme') || 'dark',
        soundEnabled:   localStorage.getItem('devhub-sound') === 'true',
        pricingYearly:  false,
        scrollY:        0,
        scrollDir:      'down',
        scrollSpeed:    0,
        mouseX:         -500,
        mouseY:         -500,
        isMobile:       'ontouchstart' in window || window.innerWidth < 768,
        isReduced:      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        fps:            0,
        preloaderDone:  false,
    };

    // ─── Utility Functions ───
    const $ = (s, p) => (p || document).querySelector(s);
    const $$ = (s, p) => [...(p || document).querySelectorAll(s)];
    const create = (tag, cls, html) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html) e.innerHTML = html;
        return e;
    };
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const rand = (min, max) => Math.random() * (max - min) + min;
    const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
    const throttle = (fn, ms) => { let last = 0; return (...a) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...a); } }; };

    // ════════════════════════════════════════════════════════
    //  01. PRELOADER
    // ════════════════════════════════════════════════════════

    const preloader = create('div', null, `
        <div class="pl-inner">
            <div class="pl-logo">
                <span class="pl-bracket">&lt;</span>
                <span class="pl-text">DH</span>
                <span class="pl-bracket">/&gt;</span>
            </div>
            <div class="pl-bar-track">
                <div class="pl-bar-fill" id="plFill"></div>
            </div>
            <div class="pl-percent" id="plPercent">0%</div>
        </div>
    `);
    preloader.id = 'preloader';
    document.body.prepend(preloader);

    // Simulate loading progress
    let plProgress = 0;
    const plFill = null; // Will be available after DOM ready
    const plInterval = setInterval(() => {
        plProgress += Math.random() * 12 + 2;
        if (plProgress > 95) plProgress = 95;
        const fill = document.getElementById('plFill');
        const pct  = document.getElementById('plPercent');
        if (fill) fill.style.width = plProgress + '%';
        if (pct) pct.textContent = Math.floor(plProgress) + '%';
    }, 120);

    window.addEventListener('load', () => {
        clearInterval(plInterval);
        const fill = document.getElementById('plFill');
        const pct  = document.getElementById('plPercent');
        if (fill) fill.style.width = '100%';
        if (pct) pct.textContent = '100%';

        setTimeout(() => {
            preloader.classList.add('pl-done');
            setTimeout(() => {
                preloader.remove();
                STATE.preloaderDone = true;
                document.dispatchEvent(new Event('preloaderDone'));
                document.body.classList.add('loaded');
            }, 900);
        }, 500);
    });

    // ════════════════════════════════════════════════════════
    //  DOM READY — Initialize Everything
    // ════════════════════════════════════════════════════════

    document.addEventListener('DOMContentLoaded', () => {
        injectMegaStyles();
        buildUIElements();
        initParticleNetwork();
        initFloatingShapes();
        initCustomCursor();
        initCursorGlow();
        initFilmGrain();
        initTypingEffect();
        initTextScramble();
        initGradientText();
        initGlitchText();
        initNavbar();
        initScrollReveal();
        initParallax();
        initScrollProgress();
        initSectionDots();
        initScrollVelocity();
        initStatsCounter();
        initFAQAccordion();
        initPricingToggle();
        initFormValidation();
        initMagneticButtons();
        initRippleEffect();
        initTilt3D();
        initCardSpotlight();
        initTestimonialRotate();
        initThemeToggle();
        initCookieConsent();
        initSoundSystem();
        initCommandPalette();
        initKeyboardShortcuts();
        initContextMenu();
        initClickSparkles();
        initSmoothScroll();
        initBackToTop();
        initEasterEggs();
        initFPSMonitor();
        initAnalytics();
        initAccessibility();
        applyTheme(STATE.theme);
    });

    // ════════════════════════════════════════════════════════
    //  02. MEGA STYLE INJECTION
    // ════════════════════════════════════════════════════════

    function injectMegaStyles() {
        const css = document.createElement('style');
        css.id = 'devhub-engine-styles';
        css.textContent = `

/* ── Preloader ── */
#preloader{position:fixed;inset:0;background:#0a0a0f;z-index:999999;display:flex;align-items:center;justify-content:center;transition:opacity .9s ease,visibility .9s ease}
#preloader.pl-done{opacity:0;visibility:hidden}
.pl-inner{text-align:center;width:240px}
.pl-logo{font-family:'Poppins',sans-serif;font-size:42px;font-weight:700;margin-bottom:30px;animation:plPulse 1.5s ease infinite}
.pl-bracket{color:#4f6ef7}
.pl-text{color:#e4e4e7;margin:0 4px}
.pl-bar-track{width:100%;height:3px;background:#1a1a2e;border-radius:4px;overflow:hidden;margin-bottom:12px}
.pl-bar-fill{height:100%;width:0;background:linear-gradient(90deg,#4f6ef7,#7c3aed,#4f6ef7);background-size:200% 100%;animation:plShimmer 1.5s linear infinite;transition:width .3s ease;border-radius:4px}
.pl-percent{color:#9393a3;font-size:13px;font-family:'Poppins',sans-serif;letter-spacing:2px}
@keyframes plPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.97)}}
@keyframes plShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
body.loaded{overflow-x:hidden}

/* ── Scroll Progress Bar ── */
#scrollProgressBar{position:fixed;top:0;left:0;height:3px;width:0;background:linear-gradient(90deg,#4f6ef7,#7c3aed,#ec4899,#4f6ef7);background-size:300% 100%;animation:gradShift 3s linear infinite;z-index:100001;pointer-events:none;box-shadow:0 0 15px rgba(79,110,247,.5)}
@keyframes gradShift{0%{background-position:0 0}100%{background-position:300% 0}}

/* ── Custom Cursor ── */
.cursor-dot{position:fixed;width:6px;height:6px;background:#4f6ef7;border-radius:50%;pointer-events:none;z-index:100003;transform:translate(-50%,-50%);transition:width .2s,height .2s,background .2s;mix-blend-mode:screen}
.cursor-ring{position:fixed;width:40px;height:40px;border:1.5px solid rgba(79,110,247,.4);border-radius:50%;pointer-events:none;z-index:100002;transform:translate(-50%,-50%);transition:width .35s cubic-bezier(.23,1,.32,1),height .35s cubic-bezier(.23,1,.32,1),border-color .3s,background .3s}
.cursor-dot.hovering{width:12px;height:12px;background:rgba(79,110,247,.8)}
.cursor-ring.hovering{width:55px;height:55px;border-color:rgba(79,110,247,.6);background:rgba(79,110,247,.06)}
.cursor-ring.clicking{width:32px;height:32px;border-color:#7c3aed}
.cursor-dot.text-hover{width:3px;height:28px;border-radius:2px;background:#4f6ef7}
.cursor-ring.text-hover{opacity:0}
@media(max-width:768px),(hover:none){.cursor-dot,.cursor-ring{display:none!important}}

/* ── Cursor Glow ── */
.cursor-glow{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(79,110,247,.06) 0%,transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);will-change:left,top}

/* ── Film Grain ── */
.film-grain{position:fixed;inset:0;pointer-events:none;z-index:99998;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ── Floating Shapes ── */
.floating-shape{position:absolute;pointer-events:none;opacity:.06;z-index:0}
.floating-shape svg{animation:floatY 6s ease-in-out infinite}
@keyframes floatY{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-25px) rotate(8deg)}}

/* ── Back to Top ── */
#backToTop{position:fixed;bottom:30px;right:30px;width:50px;height:50px;background:linear-gradient(135deg,#4f6ef7,#7c3aed);color:#fff;border:none;border-radius:50%;font-size:20px;cursor:pointer;z-index:999;opacity:0;visibility:hidden;transform:translateY(20px) scale(.7);transition:all .5s cubic-bezier(.34,1.56,.64,1);box-shadow:0 5px 25px rgba(79,110,247,.35);display:flex;align-items:center;justify-content:center}
#backToTop.visible{opacity:1;visibility:visible;transform:translateY(0) scale(1)}
#backToTop:hover{transform:translateY(-5px) scale(1.12)!important;box-shadow:0 12px 35px rgba(79,110,247,.55)}
#backToTop .btt-progress{position:absolute;inset:-3px;border-radius:50%}

/* ── Scroll Reveal ── */
.sr-up{opacity:0;transform:translateY(60px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
.sr-down{opacity:0;transform:translateY(-60px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
.sr-left{opacity:0;transform:translateX(-80px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
.sr-right{opacity:0;transform:translateX(80px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
.sr-scale{opacity:0;transform:scale(.85);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
.sr-rotate{opacity:0;transform:rotate(-8deg) translateY(30px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
.sr-fade{opacity:0;transition:opacity .9s ease}
.sr-up.revealed,.sr-down.revealed,.sr-left.revealed,.sr-right.revealed{opacity:1;transform:translate(0)}
.sr-scale.revealed{opacity:1;transform:scale(1)}
.sr-rotate.revealed{opacity:1;transform:rotate(0) translateY(0)}
.sr-fade.revealed{opacity:1}

/* ── Section Nav Dots ── */
#sectionDots{position:fixed;right:20px;top:50%;transform:translateY(-50%);z-index:1000;display:flex;flex-direction:column;gap:12px;opacity:0;transition:opacity .4s ease}
#sectionDots.visible{opacity:1}
.section-dot{width:10px;height:10px;border-radius:50%;background:#2a2a3d;cursor:pointer;transition:all .3s ease;position:relative;border:none;padding:0}
.section-dot.active{background:#4f6ef7;transform:scale(1.3);box-shadow:0 0 10px rgba(79,110,247,.5)}
.section-dot::before{content:attr(data-label);position:absolute;right:22px;top:50%;transform:translateY(-50%);background:#12121a;color:#e4e4e7;padding:4px 10px;border-radius:6px;font-size:11px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .3s ease;border:1px solid #2a2a3d;font-family:'Poppins',sans-serif}
.section-dot:hover::before{opacity:1}
@media(max-width:992px){#sectionDots{display:none!important}}

/* ── Particle Canvas ── */
#particleCanvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0}
#home{position:relative;overflow:hidden}
#home>*:not(#particleCanvas):not(.floating-shape){position:relative;z-index:1}

/* ── Typing Cursor ── */
.typing-cursor{display:inline-block;width:3px;height:.82em;background:#4f6ef7;margin-left:6px;animation:cursorBlink .65s step-end infinite;vertical-align:text-bottom;border-radius:2px}
@keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}

/* ── Text Scramble ── */
.scramble-char{display:inline-block;animation:scramblePop .3s ease forwards}
@keyframes scramblePop{0%{opacity:0;transform:translateY(8px) scale(.7)}100%{opacity:1;transform:translateY(0) scale(1)}}

/* ── Gradient Text ── */
.gradient-text{background:linear-gradient(135deg,#4f6ef7,#7c3aed,#ec4899,#4f6ef7);background-size:300% 300%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gradText 4s ease infinite}
@keyframes gradText{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}

/* ── Glitch Text ── */
.glitch-wrap{position:relative;display:inline-block}
.glitch-wrap::before,.glitch-wrap::after{content:attr(data-text);position:absolute;left:0;top:0;width:100%;overflow:hidden;pointer-events:none;opacity:0;transition:opacity .2s}
.glitch-wrap:hover::before{opacity:.8;color:#ff004d;animation:glitch1 .3s infinite linear alternate;clip-path:inset(20% 0 40% 0)}
.glitch-wrap:hover::after{opacity:.8;color:#00e5ff;animation:glitch2 .3s infinite linear alternate;clip-path:inset(60% 0 10% 0)}
@keyframes glitch1{0%{transform:translate(-2px,-1px)}100%{transform:translate(2px,1px)}}
@keyframes glitch2{0%{transform:translate(2px,1px)}100%{transform:translate(-2px,-1px)}}

/* ── Navbar ── */
.navbar{transition:all .4s cubic-bezier(.25,.8,.25,1)!important}
.navbar.scrolled{padding-top:8px!important;padding-bottom:8px!important;background-color:rgba(18,18,26,.95)!important;backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);box-shadow:0 8px 32px rgba(0,0,0,.3)}
.navbar.nav-hidden{transform:translateY(-100%)}
.nav-link.active-link{color:#4f6ef7!important;text-shadow:0 0 12px rgba(79,110,247,.4)}

/* ── Stats ── */
#stats-bar .col-md-3{animation:none!important;opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease}
#stats-bar .col-md-3.counted{opacity:1;transform:translateY(0)}

/* ── FAQ ── */
.faq-item{cursor:pointer;user-select:none;border-radius:8px;padding:25px 15px!important;transition:all .3s ease}
.faq-item p{max-height:0;overflow:hidden;opacity:0;transition:max-height .55s cubic-bezier(.4,0,.2,1),opacity .4s ease,padding .4s ease,margin .4s ease;padding-top:0;margin-bottom:0}
.faq-item.active p{max-height:300px;opacity:1;padding-top:12px;margin-bottom:0}
.faq-item .faq-arrow{transition:transform .35s cubic-bezier(.34,1.56,.64,1);display:inline-block}
.faq-item.active .faq-arrow{transform:rotate(90deg)!important;color:#7c3aed}

/* ── Pricing Toggle ── */
.pricing-toggle-wrap{text-align:center;margin-bottom:40px}
.pricing-toggle{position:relative;display:inline-flex;align-items:center;gap:14px;background:#12121a;border:1px solid #2a2a3d;border-radius:40px;padding:6px 20px;font-size:14px;color:#9393a3}
.pricing-toggle label{cursor:pointer;transition:color .3s}
.pricing-toggle label.active-label{color:#e4e4e7;font-weight:600}
.pricing-switch{position:relative;width:48px;height:26px;background:#2a2a3d;border-radius:13px;cursor:pointer;transition:background .3s;border:none;padding:0}
.pricing-switch::after{content:'';position:absolute;width:20px;height:20px;background:#4f6ef7;border-radius:50%;top:3px;left:3px;transition:transform .3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 2px 8px rgba(79,110,247,.4)}
.pricing-switch.yearly::after{transform:translateX(22px)}
.pricing-switch.yearly{background:#1a1a2e}
.save-badge{display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;margin-left:6px;vertical-align:middle;animation:badgePulse 2s ease infinite}
@keyframes badgePulse{0%,100%{opacity:1}50%{opacity:.7}}

/* ── Ripple Effect ── */
.ripple{position:absolute;border-radius:50%;background:rgba(79,110,247,.25);transform:scale(0);animation:rippleAnim .7s ease-out forwards;pointer-events:none}
@keyframes rippleAnim{to{transform:scale(4);opacity:0}}

/* ── Card Spotlight ── */
.card-spotlight-effect{position:absolute;inset:0;pointer-events:none;border-radius:inherit;opacity:0;transition:opacity .4s ease;z-index:1}

/* ── Toast ── */
#toastContainer{position:fixed;top:80px;right:20px;z-index:100005;display:flex;flex-direction:column;gap:10px;pointer-events:none}
.toast-item{background:linear-gradient(135deg,#12121a,#1a1a2e);border:1px solid #2a2a3d;border-radius:12px;padding:14px 20px;color:#e4e4e7;font-size:14px;max-width:360px;transform:translateX(120%);transition:transform .5s cubic-bezier(.34,1.56,.64,1),opacity .3s;box-shadow:0 10px 40px rgba(0,0,0,.5);pointer-events:auto;display:flex;align-items:center;gap:10px;font-family:'Inter',sans-serif}
.toast-item.show{transform:translateX(0)}
.toast-item.info{border-left:3px solid #4f6ef7}
.toast-item.success{border-left:3px solid #10b981}
.toast-item.error{border-left:3px solid #ff4757}
.toast-item .toast-close{background:none;border:none;color:#9393a3;cursor:pointer;font-size:16px;margin-left:auto;padding:0 4px;transition:color .2s}
.toast-item .toast-close:hover{color:#ff4757}

/* ── Theme Toggle ── */
#themeToggle{position:fixed;bottom:30px;left:30px;width:48px;height:48px;border-radius:50%;background:#12121a;border:1px solid #2a2a3d;color:#e4e4e7;font-size:20px;cursor:pointer;z-index:999;transition:all .4s ease;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(0,0,0,.3)}
#themeToggle:hover{transform:rotate(30deg) scale(1.1);border-color:#4f6ef7}

/* ── Light Theme ── */
body.light-theme{background-color:#f5f5f7;color:#1a1a2e}
body.light-theme .navbar{background-color:rgba(245,245,247,.9)!important;border-bottom-color:#e0e0e0}
body.light-theme .navbar.scrolled{background-color:rgba(245,245,247,.95)!important;box-shadow:0 4px 20px rgba(0,0,0,.08)}
body.light-theme .navbar-brand,body.light-theme .nav-link{color:#1a1a2e!important}
body.light-theme .nav-link{color:#666!important}
body.light-theme .nav-link.active-link{color:#4f6ef7!important}
body.light-theme #features .col-md-4,body.light-theme .pricing-card,body.light-theme #testimonials .col-md-4{background:#fff;border-color:#e0e0e0}
body.light-theme #stats-bar{background:#fff;border-color:#e0e0e0}
body.light-theme .faq-item:hover{background:#f0f0f2}
body.light-theme #contact{background:#fff;border-color:#e0e0e0}
body.light-theme .form-control,body.light-theme .form-select{background:#f5f5f7;color:#1a1a2e;border-color:#e0e0e0}
body.light-theme footer{background:#f5f5f7;border-color:#e0e0e0}
body.light-theme h1,body.light-theme h2,body.light-theme h3,body.light-theme h4,body.light-theme h5,body.light-theme h6{color:#1a1a2e}
body.light-theme .card-price,body.light-theme .quote-text,body.light-theme .quote-author{color:#1a1a2e!important}
body.light-theme .cursor-glow{background:radial-gradient(circle,rgba(79,110,247,.04) 0%,transparent 70%)}
body.light-theme #home{background:radial-gradient(circle at 80% 20%,rgba(79,110,247,.1) 0%,transparent 50%),radial-gradient(circle at 20% 80%,rgba(124,58,237,.08) 0%,transparent 50%),linear-gradient(135deg,#f5f5f7 0%,#eef0f5 50%,#f5f5f7 100%)}

/* ── Cookie Consent ── */
#cookieConsent{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#12121a,#1a1a2e);border-top:1px solid #2a2a3d;padding:18px 30px;z-index:100004;transform:translateY(100%);transition:transform .6s cubic-bezier(.34,1.56,.64,1);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;font-size:14px;color:#9393a3;box-shadow:0 -5px 30px rgba(0,0,0,.3)}
#cookieConsent.show{transform:translateY(0)}
#cookieConsent .cookie-btns{display:flex;gap:10px}
#cookieConsent button{border:none;padding:8px 20px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;transition:all .3s}
.cookie-accept{background:#4f6ef7;color:#fff}
.cookie-accept:hover{background:#3d5bd9}
.cookie-decline{background:#2a2a3d;color:#9393a3}
.cookie-decline:hover{background:#3a3a4d;color:#e4e4e7}

/* ── Command Palette ── */
#cmdPalette{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);z-index:100006;display:none;align-items:flex-start;justify-content:center;padding-top:18vh}
#cmdPalette.open{display:flex}
.cmd-box{width:100%;max-width:520px;background:#12121a;border:1px solid #2a2a3d;border-radius:14px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,.5);animation:cmdIn .25s ease}
@keyframes cmdIn{from{opacity:0;transform:scale(.95) translateY(-10px)}to{opacity:1;transform:scale(1) translateY(0)}}
.cmd-input-wrap{padding:16px;border-bottom:1px solid #2a2a3d;display:flex;align-items:center;gap:10px}
.cmd-input-wrap i{color:#4f6ef7;font-size:16px}
.cmd-input{background:none;border:none;color:#e4e4e7;font-size:15px;width:100%;outline:none;font-family:'Inter',sans-serif}
.cmd-input::placeholder{color:#9393a3}
.cmd-results{max-height:300px;overflow-y:auto;padding:8px}
.cmd-item{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:8px;cursor:pointer;transition:background .2s;color:#e4e4e7;font-size:14px}
.cmd-item:hover,.cmd-item.selected{background:rgba(79,110,247,.1)}
.cmd-item i{color:#4f6ef7;width:20px;text-align:center}
.cmd-hint{padding:10px 14px;text-align:center;color:#9393a3;font-size:13px;border-top:1px solid #2a2a3d}
.cmd-kbd{display:inline-block;background:#2a2a3d;padding:2px 8px;border-radius:4px;font-size:11px;color:#9393a3;margin:0 2px;font-family:monospace}

/* ── Context Menu ── */
.ctx-menu{position:fixed;background:#12121a;border:1px solid #2a2a3d;border-radius:10px;padding:6px;z-index:100005;min-width:200px;box-shadow:0 15px 40px rgba(0,0,0,.5);animation:ctxIn .2s ease;font-family:'Inter',sans-serif}
@keyframes ctxIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
.ctx-item{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:6px;cursor:pointer;color:#e4e4e7;font-size:13px;transition:background .2s}
.ctx-item:hover{background:rgba(79,110,247,.12)}
.ctx-item i{color:#4f6ef7;width:18px;text-align:center;font-size:13px}
.ctx-sep{height:1px;background:#2a2a3d;margin:4px 10px}

/* ── Click Sparkles ── */
.sparkle{position:fixed;pointer-events:none;z-index:100000}
.sparkle-dot{position:absolute;width:4px;height:4px;border-radius:50%;animation:sparkleFly .7s ease-out forwards}
@keyframes sparkleFly{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--sx),var(--sy)) scale(0);opacity:0}}

/* ── Matrix Rain ── */
#matrixCanvas{position:fixed;inset:0;z-index:99997;pointer-events:none;opacity:0;transition:opacity .5s}
#matrixCanvas.active{opacity:.12}

/* ── FPS Monitor ── */
#fpsMonitor{position:fixed;top:70px;left:15px;background:rgba(18,18,26,.9);border:1px solid #2a2a3d;border-radius:8px;padding:6px 12px;z-index:100001;font-family:monospace;font-size:12px;color:#10b981;display:none;backdrop-filter:blur(10px)}

/* ── Sound Toggle ── */
#soundToggle{position:fixed;bottom:90px;left:30px;width:40px;height:40px;border-radius:50%;background:#12121a;border:1px solid #2a2a3d;color:#9393a3;font-size:15px;cursor:pointer;z-index:999;transition:all .3s;display:flex;align-items:center;justify-content:center}
#soundToggle:hover{border-color:#4f6ef7;color:#4f6ef7;transform:scale(1.1)}
#soundToggle.enabled{color:#4f6ef7;border-color:#4f6ef7}

/* ── Form Enhanced ── */
.form-control.is-invalid,.form-select.is-invalid{border-color:#ff4757!important;box-shadow:0 0 10px rgba(255,71,87,.2)!important}
.form-control.is-valid,.form-select.is-valid{border-color:#10b981!important;box-shadow:0 0 10px rgba(16,185,129,.15)!important}
.invalid-feedback-custom{color:#ff4757;font-size:12px;margin-top:5px;animation:feedbackIn .3s ease}
@keyframes feedbackIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.char-count{text-align:right;font-size:11px;color:#9393a3;margin-top:4px}
.form-success{text-align:center;padding:50px 20px;animation:successIn .6s ease}
.form-success h3{color:#e4e4e7;margin:15px 0 8px}
.form-success p{color:#9393a3}
@keyframes successIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.password-strength{height:3px;border-radius:2px;margin-top:4px;transition:all .3s}
.input-icon-right{position:relative}
.input-icon-right i{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#9393a3;transition:color .3s}

/* ── Pricing Animation ── */
.price-changing{animation:priceFlip .4s ease}
@keyframes priceFlip{0%{transform:rotateX(0);opacity:1}50%{transform:rotateX(-90deg);opacity:0}51%{transform:rotateX(90deg);opacity:0}100%{transform:rotateX(0);opacity:1}}

/* ── Magnetic Button ── */
.magnetic-btn{transition:transform .3s cubic-bezier(.23,1,.32,1)}

/* ── Testimonial Dots ── */
.testimonial-dots{display:none;justify-content:center;gap:8px;margin-top:20px}
@media(max-width:767px){.testimonial-dots{display:flex}}
.t-dot{width:8px;height:8px;border-radius:50%;background:#2a2a3d;border:none;padding:0;cursor:pointer;transition:all .3s}
.t-dot.active{background:#4f6ef7;transform:scale(1.3)}

/* ── Accessibility ── */
.skip-link{position:fixed;top:-100px;left:50%;transform:translateX(-50%);background:#4f6ef7;color:#fff;padding:10px 25px;border-radius:0 0 8px 8px;z-index:100007;transition:top .3s;font-size:14px;text-decoration:none;font-family:'Inter',sans-serif}
.skip-link:focus{top:0}

/* ── Keyframe Utilities ── */
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
@keyframes confettiFall{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--cx),var(--cy)) rotate(var(--cr));opacity:0}}
@keyframes disco{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}

        `;
        document.head.appendChild(css);
    }

    // ════════════════════════════════════════════════════════
    //  03. UI FACTORY
    // ════════════════════════════════════════════════════════

    function buildUIElements() {
        // Scroll progress
        document.body.appendChild(create('div', null));
        const bar = create('div');
        bar.id = 'scrollProgressBar';
        document.body.appendChild(bar);

        // Toast container
        const tc = create('div');
        tc.id = 'toastContainer';
        document.body.appendChild(tc);

        // Back to top
        const btt = create('button', null, `
            <svg class="btt-progress" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="26" stroke="#2a2a3d" stroke-width="2"/>
                <circle cx="28" cy="28" r="26" stroke="#4f6ef7" stroke-width="2"
                        stroke-dasharray="163.36" stroke-dashoffset="163.36"
                        stroke-linecap="round" id="bttCircle"
                        style="transition:stroke-dashoffset .1s"/>
            </svg>
            <span style="position:relative;z-index:1">↑</span>
        `);
        btt.id = 'backToTop';
        btt.setAttribute('aria-label', 'Scroll to top');
        btt.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            playSound('whoosh');
        });
        document.body.appendChild(btt);

        // Skip to content (accessibility)
        const skip = create('a', 'skip-link', 'Skip to main content');
        skip.href = '#features';
        document.body.prepend(skip);
    }

    // ════════════════════════════════════════════════════════
    //  04. PARTICLE NETWORK
    // ════════════════════════════════════════════════════════

    function initParticleNetwork() {
        const hero = $('#home');
        if (!hero || STATE.isReduced) return;

        const canvas = create('canvas');
        canvas.id = 'particleCanvas';
        hero.prepend(canvas);
        const ctx = canvas.getContext('2d');

        let particles = [];
        let W, H, animId = null;
        const mouse = { x: null, y: null };

        function resize() {
            W = canvas.width  = hero.offsetWidth;
            H = canvas.height = hero.offsetHeight;
        }
        resize();
        window.addEventListener('resize', debounce(() => {
            resize();
            initParticlesList();
        }, 300));

        hero.addEventListener('mousemove', e => {
            const r = hero.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        });
        hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });

        function getCount() { return STATE.isMobile ? 40 : Math.min(140, Math.floor((W * H) / 8000)); }

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = rand(0, W);
                this.y = rand(0, H);
                this.size = rand(0.5, 2.5);
                this.vx = rand(-0.4, 0.4);
                this.vy = rand(-0.4, 0.4);
                this.baseAlpha = rand(0.1, 0.5);
                this.phase = rand(0, Math.PI * 2);
                this.hue = rand(220, 260);
            }
            update(t) {
                this.x += this.vx;
                this.y += this.vy;

                if (mouse.x !== null) {
                    const dx = mouse.x - this.x, dy = mouse.y - this.y;
                    const d = Math.hypot(dx, dy);
                    if (d < 160) {
                        const f = (160 - d) / 160 * 0.015;
                        this.x -= dx * f;
                        this.y -= dy * f;
                    }
                }

                if (this.x < -10) this.x = W + 10;
                if (this.x > W + 10) this.x = -10;
                if (this.y < -10) this.y = H + 10;
                if (this.y > H + 10) this.y = -10;

                this.alpha = this.baseAlpha + Math.sin(t * 0.001 + this.phase) * 0.15;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue},70%,65%,${clamp(this.alpha, 0.03, 0.6)})`;
                ctx.fill();
            }
        }

        function initParticlesList() {
            const count = getCount();
            particles = [];
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }
        initParticlesList();

        function drawLines() {
            const max = 140, max2 = max * max;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < max2) {
                        const alpha = (1 - Math.sqrt(d2) / max) * 0.12;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(79,110,247,${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            if (mouse.x !== null) {
                for (const p of particles) {
                    const d = Math.hypot(mouse.x - p.x, mouse.y - p.y);
                    if (d < 200) {
                        const alpha = (1 - d / 200) * 0.3;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate(t) {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(t); p.draw(); });
            drawLines();
            animId = requestAnimationFrame(animate);
        }

        const io = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (!animId) animId = requestAnimationFrame(animate);
            } else {
                if (animId) { cancelAnimationFrame(animId); animId = null; }
            }
        }, { threshold: 0.05 });
        io.observe(hero);
    }

    // ════════════════════════════════════════════════════════
    //  10. FLOATING SHAPES
    // ════════════════════════════════════════════════════════

    function initFloatingShapes() {
        const hero = $('#home');
        if (!hero || STATE.isMobile || STATE.isReduced) return;

        const shapes = [
            `<svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="none" stroke="rgba(79,110,247,.15)" stroke-width="1.5"/></svg>`,
            `<svg width="50" height="50" viewBox="0 0 50 50"><rect x="5" y="5" width="40" height="40" rx="8" fill="none" stroke="rgba(124,58,237,.12)" stroke-width="1.5" transform="rotate(20 25 25)"/></svg>`,
            `<svg width="40" height="40" viewBox="0 0 40 40"><polygon points="20,2 38,38 2,38" fill="none" stroke="rgba(236,72,153,.1)" stroke-width="1.5"/></svg>`,
            `<svg width="35" height="35" viewBox="0 0 35 35"><line x1="0" y1="17" x2="35" y2="17" stroke="rgba(79,110,247,.1)" stroke-width="1.5"/><line x1="17" y1="0" x2="17" y2="35" stroke="rgba(79,110,247,.1)" stroke-width="1.5"/></svg>`
        ];

        const positions = [
            { top: '12%', left: '8%' },
            { top: '22%', right: '12%' },
            { bottom: '18%', left: '15%' },
            { bottom: '25%', right: '8%' },
            { top: '45%', left: '5%' },
            { top: '60%', right: '6%' },
        ];

        positions.forEach((pos, i) => {
            const el = create('div', 'floating-shape');
            el.innerHTML = shapes[i % shapes.length];
            Object.assign(el.style, pos);
            el.style.animationDelay = `${i * 0.8}s`;
            el.querySelector('svg').style.animationDelay = `${i * 1.1}s`;
            el.querySelector('svg').style.animationDuration = `${5 + i * 0.7}s`;
            hero.appendChild(el);
        });
    }

    // ════════════════════════════════════════════════════════
    //  05. CUSTOM CURSOR
    // ════════════════════════════════════════════════════════

    function initCustomCursor() {
        if (STATE.isMobile) return;

        const dot  = create('div', 'cursor-dot');
        const ring = create('div', 'cursor-ring');
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let dx = -100, dy = -100, rx = -100, ry = -100;

        document.addEventListener('mousemove', e => {
            dx = e.clientX; dy = e.clientY;
        });

        // Hover states
        const interactiveEls = 'a, button, .btn, .nav-link, .faq-item, .pricing-card, input, textarea, select, .section-dot, .cmd-item, .ctx-item';

        document.addEventListener('mouseover', e => {
            const target = e.target.closest(interactiveEls);
            if (target) {
                dot.classList.add('hovering');
                ring.classList.add('hovering');
            }
            // Text cursor for inputs
            if (e.target.matches('input[type="text"], input[type="email"], textarea')) {
                dot.classList.add('text-hover');
                ring.classList.add('text-hover');
            }
        });
        document.addEventListener('mouseout', e => {
            const target = e.target.closest(interactiveEls);
            if (target) {
                dot.classList.remove('hovering');
                ring.classList.remove('hovering');
            }
            dot.classList.remove('text-hover');
            ring.classList.remove('text-hover');
        });

        document.addEventListener('mousedown', () => ring.classList.add('clicking'));
        document.addEventListener('mouseup', () => ring.classList.remove('clicking'));

        (function loop() {
            dot.style.left = dx + 'px';
            dot.style.top  = dy + 'px';
            rx = lerp(rx, dx, 0.12);
            ry = lerp(ry, dy, 0.12);
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            requestAnimationFrame(loop);
        })();

        // Hide default cursor
        const cursorCSS = create('style');
        cursorCSS.textContent = `
            *, *::before, *::after { cursor: none !important; }
        `;
        document.head.appendChild(cursorCSS);
    }

    // ════════════════════════════════════════════════════════
    //  07. AMBIENT CURSOR GLOW
    // ════════════════════════════════════════════════════════

    function initCursorGlow() {
        if (STATE.isMobile) return;

        const glow = create('div', 'cursor-glow');
        document.body.appendChild(glow);

        let gx = -500, gy = -500;

        document.addEventListener('mousemove', e => {
            STATE.mouseX = e.clientX;
            STATE.mouseY = e.clientY;
        });

        (function loop() {
            gx = lerp(gx, STATE.mouseX, 0.06);
            gy = lerp(gy, STATE.mouseY, 0.06);
            glow.style.left = gx + 'px';
            glow.style.top  = gy + 'px';
            requestAnimationFrame(loop);
        })();
    }

    // ════════════════════════════════════════════════════════
    //  08. FILM GRAIN
    // ════════════════════════════════════════════════════════

    function initFilmGrain() {
        if (STATE.isReduced) return;
        document.body.appendChild(create('div', 'film-grain'));
    }

    // ════════════════════════════════════════════════════════
    //  11. TYPEWRITER EFFECT
    // ════════════════════════════════════════════════════════

    function initTypingEffect() {
        const el = $('#home h1');
        if (!el) return;

        const phrases = [
            'Build. Learn. Grow.',
            'Code. Ship. Scale.',
            'Dream. Create. Deploy.',
            'Design. Develop. Deliver.',
            'Think. Hack. Launch.',
        ];
        let pi = 0, ci = 0, deleting = false;

        el.style.animation = 'none';
        el.style.opacity   = '1';
        el.textContent      = '';

        const cursor = create('span', 'typing-cursor');
        el.after(cursor);

        let started = false;

        function start() {
            if (started) return;
            started = true;
            setTimeout(tick, 400);
        }

        document.addEventListener('preloaderDone', start);
        setTimeout(() => { if (!started) start(); }, 4000);

        function tick() {
            const phrase = phrases[pi];
            if (deleting) {
                ci--;
                el.textContent = phrase.substring(0, ci);
            } else {
                ci++;
                el.textContent = phrase.substring(0, ci);
            }

            let delay;
            if (!deleting && ci === phrase.length) {
                delay = 2500;
                deleting = true;
            } else if (deleting && ci === 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
                delay = 500;
            } else {
                delay = deleting ? 30 : 75 + Math.random() * 40;
            }
            setTimeout(tick, delay);
        }
    }

    // ════════════════════════════════════════════════════════
    //  12. TEXT SCRAMBLE
    // ════════════════════════════════════════════════════════

    function initTextScramble() {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        const targets = $$('#features h2, #testimonials h2, #pricing h2, #faq h2, #contact h2');

        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scrambleText(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        targets.forEach(el => {
            el.dataset.originalText = el.textContent;
            io.observe(el);
        });

        function scrambleText(el) {
            const original = el.dataset.originalText;
            const len = original.length;
            let iteration = 0;
            const maxIterations = len * 2;

            const interval = setInterval(() => {
                el.textContent = original.split('').map((char, i) => {
                    if (char === ' ') return ' ';
                    if (i < iteration / 2) return original[i];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');

                iteration++;
                if (iteration >= maxIterations) {
                    clearInterval(interval);
                    el.textContent = original;
                }
            }, 30);
        }
    }

    // ════════════════════════════════════════════════════════
    //  13. GRADIENT TEXT
    // ════════════════════════════════════════════════════════

    function initGradientText() {
        $$('#features h2, #testimonials h2, #pricing h2, #faq h2, #contact h2').forEach(el => {
            el.classList.add('gradient-text');
        });
    }

    // ════════════════════════════════════════════════════════
    //  15. GLITCH TEXT
    // ════════════════════════════════════════════════════════

    function initGlitchText() {
        $$('#features h3').forEach(el => {
            const wrap = create('span', 'glitch-wrap');
            wrap.setAttribute('data-text', el.textContent);
            wrap.innerHTML = el.innerHTML;
            el.innerHTML = '';
            el.appendChild(wrap);
        });
    }

    // ════════════════════════════════════════════════════════
    //  16. SCROLL REVEAL (6 animation types)
    // ════════════════════════════════════════════════════════

    function initScrollReveal() {
        if (STATE.isReduced) return;

        const config = [
            { sel: '#features .col-md-4',     cls: 'sr-up', stagger: 0.15 },
            { sel: '#testimonials .col-md-4',  cls: 'sr-up', stagger: 0.15 },
            { sel: '#pricing .col-md-4',       cls: 'sr-scale', stagger: 0.12 },
            { sel: '.faq-item',                cls: 'sr-right', stagger: 0.08 },
            { sel: '#contact h2',              cls: 'sr-up', stagger: 0 },
            { sel: '.grid-container6',         cls: 'sr-up', stagger: 0 },
            { sel: 'footer .col-md-3',         cls: 'sr-up', stagger: 0.1 },
        ];

        config.forEach(({ sel, cls, stagger }) => {
            $$(sel).forEach((el, i) => {
                el.classList.add(cls);
                el.style.transitionDelay = `${i * stagger}s`;
            });
        });

        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

        $$('.sr-up,.sr-down,.sr-left,.sr-right,.sr-scale,.sr-rotate,.sr-fade')
            .forEach(el => io.observe(el));
    }

    // ════════════════════════════════════════════════════════
    //  17. PARALLAX ENGINE
    // ════════════════════════════════════════════════════════

    function initParallax() {
        if (STATE.isMobile || STATE.isReduced) return;

        const layers = [
            { el: $('#home h1'), speed: 0.15 },
            { el: $('#home p'), speed: 0.1 },
            { el: $('.hero-btns'), speed: 0.05 },
        ].filter(l => l.el);

        window.addEventListener('scroll', throttle(() => {
            const y = window.scrollY;
            layers.forEach(({ el, speed }) => {
                el.style.transform = `translateY(${y * speed}px)`;
            });
        }, 16), { passive: true });
    }

    // ════════════════════════════════════════════════════════
    //  18. SCROLL PROGRESS BAR
    // ════════════════════════════════════════════════════════

    function initScrollProgress() {
        const bar = $('#scrollProgressBar');
        const bttCircle = $('#bttCircle');
        const btt = $('#backToTop');

        window.addEventListener('scroll', throttle(() => {
            const y = window.scrollY;
            const h = document.documentElement.scrollHeight - window.innerHeight;
            const pct = h > 0 ? y / h : 0;

            if (bar) bar.style.width = (pct * 100) + '%';

            // BTT circle progress
            if (bttCircle) {
                const circ = 163.36;
                bttCircle.style.strokeDashoffset = circ - (circ * pct);
            }

            if (btt) btt.classList.toggle('visible', y > window.innerHeight * 0.4);
        }, 16), { passive: true });
    }

    // ════════════════════════════════════════════════════════
    //  19. SECTION NAV DOTS
    // ════════════════════════════════════════════════════════

    function initSectionDots() {
        const sections = $$('section[id]');
        if (sections.length === 0) return;

        const container = create('div');
        container.id = 'sectionDots';

        const labels = {
            home: 'Home', features: 'Features', 'stats-bar': 'Stats',
            testimonials: 'Reviews', pricing: 'Pricing', faq: 'FAQ', contact: 'Contact'
        };

        sections.forEach(sec => {
            const dot = create('button', 'section-dot');
            dot.dataset.target = sec.id;
            dot.dataset.label  = labels[sec.id] || sec.id;
            dot.setAttribute('aria-label', `Navigate to ${labels[sec.id] || sec.id}`);
            dot.addEventListener('click', () => {
                sec.scrollIntoView({ behavior: 'smooth' });
                playSound('click');
            });
            container.appendChild(dot);
        });

        document.body.appendChild(container);

        window.addEventListener('scroll', throttle(() => {
            container.classList.toggle('visible', window.scrollY > 200);

            let current = '';
            sections.forEach(sec => {
                const top = sec.offsetTop - 200;
                if (window.scrollY >= top) current = sec.id;
            });
            $$('.section-dot').forEach(d => {
                d.classList.toggle('active', d.dataset.target === current);
            });
        }, 100), { passive: true });
    }

    // ════════════════════════════════════════════════════════
    //  20. SCROLL VELOCITY EFFECTS
    // ════════════════════════════════════════════════════════

    function initScrollVelocity() {
        let lastY = 0;

        window.addEventListener('scroll', throttle(() => {
            const y = window.scrollY;
            STATE.scrollSpeed = Math.abs(y - lastY);
            STATE.scrollDir   = y > lastY ? 'down' : 'up';
            lastY = y;
        }, 50), { passive: true });
    }

    // ════════════════════════════════════════════════════════
    //  23. SMART NAVBAR
    // ════════════════════════════════════════════════════════

    function initNavbar() {
        const nav    = $('nav.navbar');
        const links  = $$('.nav-link');
        const secs   = $$('section[id]');
        let lastY    = 0;
        let hideTimer = null;

        window.addEventListener('scroll', throttle(() => {
            const y = window.scrollY;

            // Shrink
            nav.classList.toggle('scrolled', y > 60);

            // Auto-hide on scroll down, show on scroll up
            if (y > 400) {
                if (y > lastY && y - lastY > 8) {
                    clearTimeout(hideTimer);
                    hideTimer = setTimeout(() => nav.classList.add('nav-hidden'), 100);
                } else if (lastY - y > 5) {
                    clearTimeout(hideTimer);
                    nav.classList.remove('nav-hidden');
                }
            } else {
                nav.classList.remove('nav-hidden');
            }

            // Active link
            let current = '';
            secs.forEach(sec => {
                if (y >= sec.offsetTop - 200) current = sec.id;
            });
            links.forEach(l => {
                l.classList.toggle('active-link', l.getAttribute('href') === '#' + current);
            });

            lastY = y;
        }, 60), { passive: true });

        // Mobile menu auto-close
        const collapse = $('#navbarNavDropdown');
        const toggler  = $('.navbar-toggler');
        if (collapse && toggler) {
            $$('.nav-link, .btn', collapse).forEach(el => {
                el.addEventListener('click', () => {
                    if (collapse.classList.contains('show')) toggler.click();
                });
            });
        }
    }

    // ════════════════════════════════════════════════════════
    //  30. FAQ ACCORDION
    // ════════════════════════════════════════════════════════

    function initFAQAccordion() {
        const items = $$('.faq-item');

        items.forEach(item => {
            item.addEventListener('click', () => {
                const wasActive = item.classList.contains('active');
                items.forEach(i => i.classList.remove('active'));
                if (!wasActive) {
                    item.classList.add('active');
                    playSound('click');
                }
            });
        });
    }

    // ════════════════════════════════════════════════════════
    //  31. PRICING TOGGLE (Monthly / Yearly)
    // ════════════════════════════════════════════════════════

    function initPricingToggle() {
        const pricingSection = $('#pricing');
        if (!pricingSection) return;

        const h2 = $('h2', pricingSection);

        // Create toggle
        const wrap = create('div', 'pricing-toggle-wrap', `
            <div class="pricing-toggle">
                <label class="active-label" id="monthlyLabel">Monthly</label>
                <button class="pricing-switch" id="pricingSwitch" aria-label="Toggle yearly pricing"></button>
                <label id="yearlyLabel">Yearly <span class="save-badge">Save 20%</span></label>
            </div>
        `);

        h2.after(wrap);

        const prices = {
            monthly: ['$0/mo', '$19/mo', '$49/mo'],
            yearly:  ['$0/mo', '$15/mo', '$39/mo'],
        };

        const subtitles = {
            monthly: ['For individual developers', 'For teams of 2-5', 'For teams of 6-15'],
            yearly:  ['For individual developers', 'Billed $180/year', 'Billed $468/year'],
        };

        const switchBtn = $('#pricingSwitch');
        const monthlyLabel = $('#monthlyLabel');
        const yearlyLabel  = $('#yearlyLabel');

        switchBtn.addEventListener('click', () => {
            STATE.pricingYearly = !STATE.pricingYearly;
            switchBtn.classList.toggle('yearly', STATE.pricingYearly);
            monthlyLabel.classList.toggle('active-label', !STATE.pricingYearly);
            yearlyLabel.classList.toggle('active-label', STATE.pricingYearly);

            const plan = STATE.pricingYearly ? 'yearly' : 'monthly';
            const priceEls    = $$('.card-price');
            const subtitleEls = $$('.card-subtitle');

            priceEls.forEach((el, i) => {
                el.classList.add('price-changing');
                setTimeout(() => {
                    el.textContent = prices[plan][i] || el.textContent;
                    subtitleEls[i].textContent = subtitles[plan][i] || subtitleEls[i].textContent;
                }, 200);
                setTimeout(() => el.classList.remove('price-changing'), 400);
            });

            playSound('toggle');
        });
    }

    // ════════════════════════════════════════════════════════
    //  32. FORM VALIDATION (Advanced)
    // ════════════════════════════════════════════════════════

    function initFormValidation() {
        const form = $('form');
        if (!form) return;

        const fields = {
            name:    { el: $('#nameInput'),         validate: v => v.trim().length >= 2,             msg: 'Name must be at least 2 characters' },
            email:   { el: $('#exampleInputEmail1'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email address' },
            message: { el: $('#message'),           validate: v => v.trim().length >= 10,            msg: 'Message must be at least 10 characters' },
        };

        // Real-time validation
        Object.values(fields).forEach(({ el, validate, msg }) => {
            if (!el) return;
            el.addEventListener('blur',  () => checkField(el, validate, msg));
            el.addEventListener('input', () => {
                if (el.classList.contains('is-invalid')) checkField(el, validate, msg);
                if (el.classList.contains('is-valid'))   checkField(el, validate, msg);
            });
        });

        // Character counter on message
        const msgEl = fields.message.el;
        if (msgEl) {
            const counter = create('div', 'char-count', '0 / 500');
            msgEl.parentNode.appendChild(counter);
            msgEl.setAttribute('maxlength', '500');
            msgEl.addEventListener('input', () => {
                const len = msgEl.value.length;
                counter.textContent = `${len} / 500`;
                counter.style.color = len > 450 ? '#ff4757' : len > 350 ? '#f39c12' : '#9393a3';
            });
        }

        function checkField(el, validate, msg) {
            const ok = validate(el.value);
            el.classList.toggle('is-valid',   ok);
            el.classList.toggle('is-invalid', !ok);
            const old = el.parentNode.querySelector('.invalid-feedback-custom');
            if (old) old.remove();
            if (!ok) {
                const fb = create('div', 'invalid-feedback-custom', msg);
                el.parentNode.appendChild(fb);
            }
            return ok;
        }

        // Submit
        form.addEventListener('submit', e => {
            e.preventDefault();
            let valid = true;

            Object.values(fields).forEach(({ el, validate, msg }) => {
                if (el && !checkField(el, validate, msg)) valid = false;
            });

            const btn = form.querySelector('button[type="submit"]');

            if (!valid) {
                btn.style.animation = 'shake .5s ease';
                setTimeout(() => btn.style.animation = '', 500);
                playSound('error');
                const first = form.querySelector('.is-invalid');
                if (first) first.focus();
                return;
            }

            // Loading state
            btn.disabled  = true;
            const origHTML = btn.innerHTML;
            btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Sending...`;

            playSound('whoosh');

            setTimeout(() => {
                const container = $('.grid-container6');
                if (container) {
                    container.innerHTML = `
                        <div class="form-success">
                            <div style="font-size:60px;margin-bottom:12px">🚀</div>
                            <h3>Message Sent Successfully!</h3>
                            <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                            <button class="btn btn-outline-primary mt-4" onclick="location.reload()" style="border-color:#4f6ef7;color:#4f6ef7">
                                Send Another Message
                            </button>
                        </div>`;
                }
                showToast('Message sent successfully! 🎉', 'success');
                playSound('success');
                launchConfetti(40);
            }, 2200);
        });
    }

    // ════════════════════════════════════════════════════════
    //  33. MAGNETIC BUTTONS
    // ════════════════════════════════════════════════════════

    function initMagneticButtons() {
        if (STATE.isMobile) return;

        $$('.hero-btns .btn, .pricing-card .btn, #backToTop').forEach(btn => {
            btn.classList.add('magnetic-btn');

            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top  - r.height / 2;
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ════════════════════════════════════════════════════════
    //  34. RIPPLE EFFECT
    // ════════════════════════════════════════════════════════

    function initRippleEffect() {
        document.addEventListener('click', e => {
            const btn = e.target.closest('.btn, button');
            if (!btn || btn.id === 'backToTop') return;

            btn.style.position = btn.style.position || 'relative';
            btn.style.overflow = 'hidden';

            const r = btn.getBoundingClientRect();
            const ripple = create('span', 'ripple');
            const size = Math.max(r.width, r.height);
            ripple.style.width  = ripple.style.height = size + 'px';
            ripple.style.left   = (e.clientX - r.left - size / 2) + 'px';
            ripple.style.top    = (e.clientY - r.top  - size / 2) + 'px';
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    }

    // ════════════════════════════════════════════════════════
    //  35. 3D TILT CARDS
    // ════════════════════════════════════════════════════════

    function initTilt3D() {
        if (STATE.isMobile) return;

        $$('#features .col-md-4').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width  - 0.5;
                const y = (e.clientY - r.top)  / r.height - 0.5;
                card.style.transform  = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-5px)`;
                card.style.transition = 'transform .08s ease';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform  = '';
                card.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
            });
        });
    }

    // ════════════════════════════════════════════════════════
    //  36. CARD SPOTLIGHT
    // ════════════════════════════════════════════════════════

    function initCardSpotlight() {
        if (STATE.isMobile) return;

        $$('#features .col-md-4, .pricing-card, #testimonials .col-md-4').forEach(card => {
            const spotlight = create('div', 'card-spotlight-effect');
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(spotlight);

            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = e.clientX - r.left;
                const y = e.clientY - r.top;
                spotlight.style.opacity = '1';
                spotlight.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(79,110,247,.08), transparent 60%)`;
            });
            card.addEventListener('mouseleave', () => {
                spotlight.style.opacity = '0';
            });
        });
    }

    // ════════════════════════════════════════════════════════
    //  37. TESTIMONIAL AUTO-ROTATE (mobile)
    // ════════════════════════════════════════════════════════

    function initTestimonialRotate() {
        const section = $('#testimonials');
        if (!section) return;

        const cols = $$('.col-md-4', section);
        if (cols.length < 2) return;

        // Add dots for mobile
        const dots = create('div', 'testimonial-dots');
        cols.forEach((_, i) => {
            const d = create('button', `t-dot${i === 0 ? ' active' : ''}`);
            d.addEventListener('click', () => showTestimonial(i));
            dots.appendChild(d);
        });
        const row = $(' .row', section);
        if (row) row.after(dots);

        let current = 0;
        let interval;

        function showTestimonial(idx) {
            if (!STATE.isMobile) return;
            current = idx;
            cols.forEach((col, i) => {
                col.style.display = i === idx ? 'block' : 'none';
                col.style.animation = i === idx ? 'feedbackIn .4s ease' : '';
            });
            $$('.t-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
        }

        function autoRotate() {
            if (!STATE.isMobile) return;
            showTestimonial((current + 1) % cols.length);
        }

        function init() {
            if (STATE.isMobile) {
                showTestimonial(0);
                clearInterval(interval);
                interval = setInterval(autoRotate, 4000);
            } else {
                cols.forEach(c => { c.style.display = ''; c.style.animation = ''; });
            }
        }

        init();
        window.addEventListener('resize', debounce(() => {
            STATE.isMobile = window.innerWidth < 768;
            init();
        }, 300));
    }

    // ════════════════════════════════════════════════════════
    //  38. STATS COUNTER
    // ════════════════════════════════════════════════════════

    function initStatsCounter() {
        const section = $('#stats-bar');
        if (!section) return;

        const cols = $$('.col-md-3', section);
        const nums = $$('.stat-number', section);
        let fired = false;

        const io = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !fired) {
                fired = true;
                cols.forEach((col, i) => {
                    setTimeout(() => col.classList.add('counted'), i * 200);
                });
                nums.forEach((el, i) => setTimeout(() => countUp(el), i * 250 + 150));
            }
        }, { threshold: 0.35 });
        io.observe(section);

        function countUp(el) {
            const raw = el.textContent.trim();
            if (raw.includes('/')) return;

            const num    = parseInt(raw.replace(/\D/g, ''));
            const suffix = raw.replace(/[0-9]/g, '');
            const start  = performance.now();
            const dur    = 2200;

            (function frame(now) {
                const t = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - t, 4);
                el.textContent = Math.floor(num * eased) + suffix;
                if (t < 1) requestAnimationFrame(frame);
                else el.textContent = raw;
            })(start);
        }
    }

    // ════════════════════════════════════════════════════════
    //  39. TOAST NOTIFICATION SYSTEM
    // ════════════════════════════════════════════════════════

    function showToast(msg, type = 'info', duration = 4500) {
        const container = $('#toastContainer');
        if (!container) return;

        const icons = { info: 'ℹ️', success: '✅', error: '❌' };

        const toast = create('div', `toast-item ${type}`, `
            <span>${icons[type] || icons.info}</span>
            <span>${msg}</span>
            <button class="toast-close">✕</button>
        `);

        container.appendChild(toast);

        requestAnimationFrame(() =>
            requestAnimationFrame(() => toast.classList.add('show'))
        );

        const close = () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        };

        toast.querySelector('.toast-close').addEventListener('click', close);
        setTimeout(close, duration);
    }
    window.showToast = showToast;

    // ════════════════════════════════════════════════════════
    //  40. THEME TOGGLE
    // ════════════════════════════════════════════════════════

    function initThemeToggle() {
        const btn = create('button');
        btn.id = 'themeToggle';
        btn.innerHTML = STATE.theme === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-label', 'Toggle theme');
        btn.addEventListener('click', () => {
            STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
            applyTheme(STATE.theme);
            btn.innerHTML = STATE.theme === 'dark' ? '☀️' : '🌙';
            localStorage.setItem('devhub-theme', STATE.theme);
            playSound('toggle');
            showToast(`${STATE.theme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode enabled`, 'info', 2000);
        });
        document.body.appendChild(btn);
    }

    function applyTheme(theme) {
        document.body.classList.toggle('light-theme', theme === 'light');
    }

    // ════════════════════════════════════════════════════════
    //  41. COOKIE CONSENT
    // ════════════════════════════════════════════════════════

    function initCookieConsent() {
        if (localStorage.getItem('devhub-cookies')) return;

        const banner = create('div', '', `
            <span>🍪 We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</span>
            <div class="cookie-btns">
                <button class="cookie-accept">Accept All</button>
                <button class="cookie-decline">Decline</button>
            </div>
        `);
        banner.id = 'cookieConsent';
        document.body.appendChild(banner);

        setTimeout(() => banner.classList.add('show'), 2500);

        banner.querySelector('.cookie-accept').addEventListener('click', () => {
            localStorage.setItem('devhub-cookies', 'accepted');
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 600);
            showToast('Cookie preferences saved ✅', 'success', 2500);
        });

        banner.querySelector('.cookie-decline').addEventListener('click', () => {
            localStorage.setItem('devhub-cookies', 'declined');
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 600);
        });
    }

    // ════════════════════════════════════════════════════════
    //  42. SOUND SYSTEM
    // ════════════════════════════════════════════════════════

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function initSoundSystem() {
        const btn = create('button');
        btn.id = 'soundToggle';
        btn.innerHTML = STATE.soundEnabled ? '🔊' : '🔇';
        btn.setAttribute('aria-label', 'Toggle sounds');
        btn.classList.toggle('enabled', STATE.soundEnabled);

        btn.addEventListener('click', () => {
            STATE.soundEnabled = !STATE.soundEnabled;
            btn.innerHTML = STATE.soundEnabled ? '🔊' : '🔇';
            btn.classList.toggle('enabled', STATE.soundEnabled);
            localStorage.setItem('devhub-sound', STATE.soundEnabled);
            if (STATE.soundEnabled) playSound('toggle');
        });

        document.body.appendChild(btn);
    }

    function playSound(type) {
        if (!STATE.soundEnabled) return;
        if (!audioCtx) audioCtx = new AudioCtx();

        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        gain.gain.setValueAtTime(0.04, now);

        switch (type) {
            case 'click':
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now); osc.stop(now + 0.1);
                break;
            case 'toggle':
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now); osc.stop(now + 0.15);
                break;
            case 'success':
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.1);
                osc.frequency.setValueAtTime(784, now + 0.2);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                osc.start(now); osc.stop(now + 0.4);
                break;
            case 'error':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now); osc.stop(now + 0.25);
                break;
            case 'whoosh':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
                gain.gain.setValueAtTime(0.03, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now); osc.stop(now + 0.35);
                break;
            default:
                osc.frequency.setValueAtTime(440, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now); osc.stop(now + 0.1);
        }
    }
    window.playSound = playSound;

    // ════════════════════════════════════════════════════════
    //  28. COMMAND PALETTE (Ctrl+K)
    // ════════════════════════════════════════════════════════

    function initCommandPalette() {
        const commands = [
            { icon: 'fa-home',        label: 'Go to Home',          action: () => smoothNav('#home') },
            { icon: 'fa-bolt',        label: 'Go to Features',      action: () => smoothNav('#features') },
            { icon: 'fa-tags',        label: 'Go to Pricing',       action: () => smoothNav('#pricing') },
            { icon: 'fa-question',    label: 'Go to FAQ',           action: () => smoothNav('#faq') },
            { icon: 'fa-envelope',    label: 'Go to Contact',       action: () => smoothNav('#contact') },
            { icon: 'fa-arrow-up',    label: 'Scroll to Top',       action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { icon: 'fa-moon',        label: 'Toggle Dark/Light',   action: () => $('#themeToggle')?.click() },
            { icon: 'fa-volume-up',   label: 'Toggle Sound',        action: () => $('#soundToggle')?.click() },
            { icon: 'fa-gamepad',     label: 'Party Mode 🎉',       action: () => partyMode() },
            { icon: 'fa-code',        label: 'Matrix Rain ☔',      action: () => toggleMatrix() },
            { icon: 'fa-info-circle', label: 'About DevHub',        action: () => showToast('DevHub v2.0 — Built with ❤️', 'info') },
            { icon: 'fa-keyboard',    label: 'Keyboard Shortcuts',  action: () => showToast('Ctrl+K: Palette | Ctrl+M: Matrix | Ctrl+Shift+F: FPS', 'info', 5000) },
        ];

        const palette = create('div', '', `
            <div class="cmd-box">
                <div class="cmd-input-wrap">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input class="cmd-input" type="text" placeholder="Search commands...">
                </div>
                <div class="cmd-results" id="cmdResults"></div>
                <div class="cmd-hint">
                    <span class="cmd-kbd">↑↓</span> Navigate
                    <span class="cmd-kbd">Enter</span> Select
                    <span class="cmd-kbd">Esc</span> Close
                </div>
            </div>
        `);
        palette.id = 'cmdPalette';
        document.body.appendChild(palette);

        const input   = $('.cmd-input', palette);
        const results = $('#cmdResults');
        let selected  = 0;

        function render(filter = '') {
            const filtered = commands.filter(c =>
                c.label.toLowerCase().includes(filter.toLowerCase())
            );
            results.innerHTML = filtered.map((c, i) => `
                <div class="cmd-item${i === selected ? ' selected' : ''}" data-idx="${i}">
                    <i class="fa-solid ${c.icon}"></i>
                    <span>${c.label}</span>
                </div>
            `).join('') || '<div class="cmd-item" style="color:#9393a3;cursor:default">No results found</div>';

            $$('.cmd-item', results).forEach((el, i) => {
                el.addEventListener('click', () => {
                    filtered[i]?.action();
                    close();
                });
            });

            return filtered;
        }

        function open() {
            palette.classList.add('open');
            selected = 0;
            input.value = '';
            render();
            setTimeout(() => input.focus(), 50);
            playSound('click');
        }

        function close() {
            palette.classList.remove('open');
        }

        function smoothNav(hash) {
            const el = $(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }

        input.addEventListener('input', () => {
            selected = 0;
            render(input.value);
        });

        input.addEventListener('keydown', e => {
            const items = $$('.cmd-item', results);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selected = Math.min(selected + 1, items.length - 1);
                render(input.value);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selected = Math.max(selected - 1, 0);
                render(input.value);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const filtered = commands.filter(c =>
                    c.label.toLowerCase().includes(input.value.toLowerCase())
                );
                filtered[selected]?.action();
                close();
            }
        });

        palette.addEventListener('click', e => {
            if (e.target === palette) close();
        });

        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                palette.classList.contains('open') ? close() : open();
            }
            if (e.key === 'Escape') close();
        });
    }

    // ════════════════════════════════════════════════════════
    //  29. KEYBOARD SHORTCUTS
    // ════════════════════════════════════════════════════════

    function initKeyboardShortcuts() {
        document.addEventListener('keydown', e => {
            // Don't trigger when typing in inputs
            if (e.target.matches('input, textarea, select')) return;

            // Number keys for sections
            const sections = ['home', 'features', 'stats-bar', 'testimonials', 'pricing', 'faq', 'contact'];
            if (e.key >= '1' && e.key <= '7' && !e.ctrlKey && !e.metaKey) {
                const sec = $(`#${sections[parseInt(e.key) - 1]}`);
                if (sec) sec.scrollIntoView({ behavior: 'smooth' });
            }

            // T for theme
            if (e.key === 't' && !e.ctrlKey) {
                $('#themeToggle')?.click();
            }
        });
    }

    // ════════════════════════════════════════════════════════
    //  43. CONTEXT MENU (Custom Right-Click)
    // ════════════════════════════════════════════════════════

    function initContextMenu() {
        let currentMenu = null;

        function closeMenu() {
            if (currentMenu) { currentMenu.remove(); currentMenu = null; }
        }

        document.addEventListener('contextmenu', e => {
            e.preventDefault();
            closeMenu();

            const items = [
                { icon: 'fa-arrow-up',     label: 'Scroll to Top',     action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
                { icon: 'fa-home',         label: 'Home',              action: () => $('#home')?.scrollIntoView({ behavior: 'smooth' }) },
                { icon: 'fa-bolt',         label: 'Features',          action: () => $('#features')?.scrollIntoView({ behavior: 'smooth' }) },
                { icon: 'fa-tags',         label: 'Pricing',           action: () => $('#pricing')?.scrollIntoView({ behavior: 'smooth' }) },
                'sep',
                { icon: 'fa-moon',         label: 'Toggle Theme',      action: () => $('#themeToggle')?.click() },
                { icon: 'fa-volume-up',    label: 'Toggle Sound',      action: () => $('#soundToggle')?.click() },
                { icon: 'fa-terminal',     label: 'Command Palette',   action: () => { setTimeout(() => { const evt = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }); document.dispatchEvent(evt); }, 100); } },
                'sep',
                { icon: 'fa-code',         label: 'View Source',       action: () => window.open('view-source:' + location.href) },
                { icon: 'fa-heart',        label: 'Made with ❤️',      action: () => showToast('Built with ❤️ by NeelKing and team!', 'info') },
            ];

            const menu = create('div', 'ctx-menu');
            items.forEach(item => {
                if (item === 'sep') {
                    menu.appendChild(create('div', 'ctx-sep'));
                } else {
                    const el = create('div', 'ctx-item', `<i class="fa-solid ${item.icon}"></i><span>${item.label}</span>`);
                    el.addEventListener('click', () => { item.action(); closeMenu(); });
                    menu.appendChild(el);
                }
            });

            // Position
            const x = Math.min(e.clientX, window.innerWidth - 220);
            const y = Math.min(e.clientY, window.innerHeight - 400);
            menu.style.left = x + 'px';
            menu.style.top  = y + 'px';

            document.body.appendChild(menu);
            currentMenu = menu;

            playSound('click');
        });

        document.addEventListener('click', closeMenu);
        document.addEventListener('scroll', closeMenu);
    }

    // ════════════════════════════════════════════════════════
    //  48. CLICK SPARKLES
    // ════════════════════════════════════════════════════════

    function initClickSparkles() {
        document.addEventListener('click', e => {
            for (let i = 0; i < 8; i++) {
                const sparkle = create('div', 'sparkle');
                const dot = create('div', 'sparkle-dot');
                const angle = (Math.PI * 2 * i) / 8;
                const dist = rand(30, 80);

                dot.style.cssText = `
                    --sx: ${Math.cos(angle) * dist}px;
                    --sy: ${Math.sin(angle) * dist}px;
                    background: hsl(${rand(220, 270)}, 80%, 65%);
                    width: ${rand(3, 6)}px;
                    height: ${rand(3, 6)}px;
                `;

                sparkle.style.left = e.clientX + 'px';
                sparkle.style.top  = e.clientY + 'px';
                sparkle.appendChild(dot);
                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 700);
            }
        });
    }

    // ════════════════════════════════════════════════════════
    //  26. SMOOTH SCROLL
    // ════════════════════════════════════════════════════════

    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const id = this.getAttribute('href');
                if (id === '#') return;
                const target = $(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    playSound('whoosh');
                }
            });
        });
    }

    // ════════════════════════════════════════════════════════
    //  27. BACK TO TOP
    // ════════════════════════════════════════════════════════

    function initBackToTop() {
        // Already created in buildUIElements, scroll behavior in initScrollProgress
    }

    // ════════════════════════════════════════════════════════
    //  45-47. EASTER EGGS
    // ════════════════════════════════════════════════════════

    function initEasterEggs() {
        // ─── Konami Code ───
        const code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        let idx = 0;

        document.addEventListener('keydown', e => {
            if (e.target.matches('input, textarea')) return;

            if (e.keyCode === code[idx]) {
                idx++;
                if (idx === code.length) {
                    idx = 0;
                    showToast('🎮 KONAMI CODE ACTIVATED! You legend! 🥚✨', 'success', 5000);
                    partyMode();
                    launchConfetti(80);
                    playSound('success');
                }
            } else {
                idx = e.keyCode === code[0] ? 1 : 0;
            }
        });

        // ─── Ctrl+M for Matrix ───
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
                e.preventDefault();
                toggleMatrix();
            }
        });
    }

    // ─── Party Mode ───
    function partyMode() {
        let h = 0;
        const iv = setInterval(() => {
            h += 4;
            document.body.style.filter = `hue-rotate(${h}deg) saturate(1.3)`;
            if (h >= 720) {
                clearInterval(iv);
                document.body.style.filter = '';
            }
        }, 20);
    }
    window.partyMode = partyMode;

    // ─── Confetti Launcher ───
    function launchConfetti(count = 50) {
        for (let i = 0; i < count; i++) {
            const c = create('div');
            const size = rand(5, 10);
            const shape = Math.random() > 0.5 ? '50%' : '0';
            c.style.cssText = `
                position:fixed;
                top:50%;left:50%;
                width:${size}px;height:${size}px;
                border-radius:${shape};
                background:hsl(${rand(0, 360)},85%,60%);
                pointer-events:none;z-index:100010;
                --cx:${rand(-600, 600)}px;
                --cy:${rand(-600, 600)}px;
                --cr:${rand(-720, 720)}deg;
                animation:confettiFall ${rand(0.8, 2)}s cubic-bezier(.25,.8,.25,1) forwards;
            `;
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 2500);
        }
    }
    window.launchConfetti = launchConfetti;

    // ─── Matrix Rain ───
    let matrixActive = false;
    let matrixCanvas = null;
    let matrixAnimId = null;

    function toggleMatrix() {
        matrixActive = !matrixActive;

        if (matrixActive) {
            if (!matrixCanvas) {
                matrixCanvas = create('canvas');
                matrixCanvas.id = 'matrixCanvas';
                document.body.appendChild(matrixCanvas);
            }

            matrixCanvas.classList.add('active');
            matrixCanvas.width  = window.innerWidth;
            matrixCanvas.height = window.innerHeight;

            const ctx = matrixCanvas.getContext('2d');
            const fontSize = 14;
            const cols = Math.floor(matrixCanvas.width / fontSize);
            const drops = Array(cols).fill(1);
            const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

            function draw() {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
                ctx.fillStyle = '#4f6ef7';
                ctx.font = fontSize + 'px monospace';

                for (let i = 0; i < drops.length; i++) {
                    const char = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillStyle = Math.random() > 0.95 ? '#e4e4e7' : `hsl(${230 + Math.random() * 40}, 80%, ${50 + Math.random() * 20}%)`;
                    ctx.fillText(char, i * fontSize, drops[i] * fontSize);
                    if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
                    drops[i]++;
                }
                matrixAnimId = requestAnimationFrame(draw);
            }
            draw();
            showToast('🟢 Matrix Rain activated! Ctrl+M to toggle', 'info', 3000);
        } else {
            if (matrixCanvas) matrixCanvas.classList.remove('active');
            if (matrixAnimId) cancelAnimationFrame(matrixAnimId);
            showToast('🔴 Matrix Rain deactivated', 'info', 2000);
        }
    }
    window.toggleMatrix = toggleMatrix;

    // ════════════════════════════════════════════════════════
    //  49. FPS MONITOR
    // ════════════════════════════════════════════════════════

    function initFPSMonitor() {
        const monitor = create('div');
        monitor.id = 'fpsMonitor';
        document.body.appendChild(monitor);

        let frames = 0, lastTime = performance.now();
        let visible = false;

        (function loop() {
            frames++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                STATE.fps = frames;
                if (visible) {
                    monitor.innerHTML = `
                        <div>FPS: <span style="color:${frames > 50 ? '#10b981' : frames > 30 ? '#f39c12' : '#ff4757'}">${frames}</span></div>
                        <div style="color:#9393a3;font-size:10px">Scroll: ${STATE.scrollSpeed}px/f | ${STATE.scrollDir}</div>
                    `;
                }
                frames = 0;
                lastTime = now;
            }
            requestAnimationFrame(loop);
        })();

        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                visible = !visible;
                monitor.style.display = visible ? 'block' : 'none';
                showToast(visible ? '📊 FPS Monitor ON' : '📊 FPS Monitor OFF', 'info', 2000);
            }
        });
    }

    // ════════════════════════════════════════════════════════
    //  53. ANALYTICS TRACKER (Simulated)
    // ════════════════════════════════════════════════════════

    function initAnalytics() {
        const events = [];

        function track(category, action, label = '') {
            events.push({
                category, action, label,
                timestamp: new Date().toISOString(),
                url: location.href,
            });
            // console.log('[Analytics]', category, action, label);
        }

        // Track section views
        $$('section[id]').forEach(sec => {
            const io = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    track('Section', 'View', sec.id);
                }
            }, { threshold: 0.3 });
            io.observe(sec);
        });

        // Track clicks
        document.addEventListener('click', e => {
            const btn = e.target.closest('.btn, button, a');
            if (btn) {
                track('Click', btn.textContent.trim().substring(0, 30), btn.href || btn.id || '');
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', throttle(() => {
            const pct = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            if (pct > maxScroll) {
                maxScroll = pct;
                if (maxScroll % 25 === 0 && maxScroll > 0) {
                    track('Scroll', 'Depth', maxScroll + '%');
                }
            }
        }, 500), { passive: true });

        // Track time on page
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const seconds = Math.round((Date.now() - startTime) / 1000);
            track('Session', 'Duration', seconds + 's');
        });

        window.devhubAnalytics = { events, track };
    }

    // ════════════════════════════════════════════════════════
    //  54. ACCESSIBILITY ENHANCEMENTS
    // ════════════════════════════════════════════════════════

    function initAccessibility() {
        // Focus visible management
        document.addEventListener('keydown', e => {
            if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
        });
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });

        // ARIA labels for dynamic elements
        $$('.faq-item').forEach((item, i) => {
            const h4 = $('h4', item);
            const p  = $('p', item);
            if (h4 && p) {
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
                item.setAttribute('aria-expanded', 'false');
                p.id = `faq-answer-${i}`;
                item.setAttribute('aria-controls', p.id);

                item.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.click();
                    }
                });

                // Update aria-expanded on click
                const origClick = item.onclick;
                item.addEventListener('click', () => {
                    setTimeout(() => {
                        item.setAttribute('aria-expanded', item.classList.contains('active'));
                    }, 10);
                });
            }
        });

        // Reduce motion preference
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        mq.addEventListener('change', () => {
            STATE.isReduced = mq.matches;
            if (STATE.isReduced) {
                showToast('🦽 Reduced motion detected — animations minimized', 'info', 3000);
            }
        });
    }

    // ════════════════════════════════════════════════════════
    //  44. TOOLTIP SYSTEM (Bonus)
    // ════════════════════════════════════════════════════════

    // Add tooltips via data-tooltip attribute
    document.addEventListener('mouseover', e => {
        const target = e.target.closest('[data-tooltip]');
        if (!target || STATE.isMobile) return;

        let tip = target._tooltip;
        if (!tip) {
            tip = create('div', null, target.dataset.tooltip);
            tip.style.cssText = `
                position:fixed;background:#1a1a2e;color:#e4e4e7;
                padding:6px 12px;border-radius:6px;font-size:12px;
                pointer-events:none;z-index:100006;border:1px solid #2a2a3d;
                box-shadow:0 4px 12px rgba(0,0,0,.3);white-space:nowrap;
                font-family:'Inter',sans-serif;opacity:0;transition:opacity .2s;
            `;
            document.body.appendChild(tip);
            target._tooltip = tip;
        }

        const r = target.getBoundingClientRect();
        tip.style.left = (r.left + r.width / 2 - tip.offsetWidth / 2) + 'px';
        tip.style.top  = (r.top - tip.offsetHeight - 8) + 'px';
        tip.style.opacity = '1';
    });

    document.addEventListener('mouseout', e => {
        const target = e.target.closest('[data-tooltip]');
        if (target && target._tooltip) {
            target._tooltip.style.opacity = '0';
        }
    });

    // ════════════════════════════════════════════════════════
    //  FOOTER — Dynamic Year + Visitor Session
    // ════════════════════════════════════════════════════════

    ;(function footerExtras() {
        document.addEventListener('DOMContentLoaded', () => {
            // Animated footer link hover effects
            $$('footer a').forEach(link => {
                link.addEventListener('mouseenter', () => playSound('click'));
            });

            // Dynamic visitor counter (simulated)
            let visits = parseInt(localStorage.getItem('devhub-visits') || '0') + 1;
            localStorage.setItem('devhub-visits', visits);

            // Welcome back toast
            if (visits > 1) {
                document.addEventListener('preloaderDone', () => {
                    setTimeout(() => {
                        showToast(`👋 Welcome back! Visit #${visits}`, 'info', 3000);
                    }, 1500);
                });
            } else {
                document.addEventListener('preloaderDone', () => {
                    setTimeout(() => {
                        showToast('👋 Welcome to DevHub! Press Ctrl+K to explore', 'info', 4500);
                    }, 1500);
                });
            }
        });
    })();

})();