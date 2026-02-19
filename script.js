// ============================================
// DEVHUB - POWERFUL JAVASCRIPT
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    DevHub.init();
});

// Main DevHub Object - Modular Architecture
const DevHub = {
    // ============================================
    // INITIALIZATION
    // ============================================
    init() {
        this.Loader.init();
        this.Navbar.init();
        this.ScrollAnimations.init();
        this.StatsCounter.init();
        this.FAQ.init();
        this.Form.init();
        this.TypeWriter.init();
        this.ParticleBackground.init();
        this.ScrollProgress.init();
        this.BackToTop.init();
        this.CursorEffect.init();
        this.Parallax.init();
        this.ThemeToggle.init();
        this.Toast.init();
        this.MobileMenu.init();
        this.SmoothScroll.init();
        this.LazyLoad.init();
        this.PricingToggle.init();
        this.Testimonials.init();
        this.EasterEggs.init();
        
        console.log('%c🚀 DevHub Initialized Successfully!', 'color: #4f6ef7; font-size: 16px; font-weight: bold;');
    },

    // ============================================
    // LOADER MODULE
    // ============================================
    Loader: {
        init() {
            this.createLoader();
            window.addEventListener('load', () => this.hideLoader());
        },

        createLoader() {
            const loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="loader-logo">DevHub</div>
                    <div class="loader-spinner"></div>
                    <div class="loader-text">Loading amazing things...</div>
                </div>
            `;
            document.body.prepend(loader);

            // Add loader styles
            const style = document.createElement('style');
            style.textContent = `
                #page-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #0a0a0f;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 99999;
                    transition: opacity 0.5s ease, visibility 0.5s ease;
                }
                #page-loader.hidden {
                    opacity: 0;
                    visibility: hidden;
                }
                .loader-content {
                    text-align: center;
                }
                .loader-logo {
                    font-family: 'Poppins', sans-serif;
                    font-size: 48px;
                    font-weight: 700;
                    color: #4f6ef7;
                    margin-bottom: 30px;
                    animation: pulse 1.5s ease-in-out infinite;
                }
                .loader-spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid #2a2a3d;
                    border-top-color: #4f6ef7;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    animation: spin 1s linear infinite;
                }
                .loader-text {
                    color: #9393a3;
                    font-size: 14px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(0.98); }
                }
            `;
            document.head.appendChild(style);
        },

        hideLoader() {
            const loader = document.getElementById('page-loader');
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            }, 800);
        }
    },

    // ============================================
    // NAVBAR MODULE
    // ============================================
    Navbar: {
        init() {
            this.navbar = document.querySelector('.navbar');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.sections = document.querySelectorAll('section');
            
            this.handleScroll();
            this.highlightActiveLink();
            
            window.addEventListener('scroll', () => {
                this.handleScroll();
                this.highlightActiveLink();
            });
        },

        handleScroll() {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(18, 18, 26, 0.95)';
                this.navbar.style.backdropFilter = 'blur(10px)';
                this.navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
                this.navbar.style.padding = '10px 30px';
            } else {
                this.navbar.style.background = '#12121a';
                this.navbar.style.backdropFilter = 'none';
                this.navbar.style.boxShadow = 'none';
                this.navbar.style.padding = '15px 30px';
            }
        },

        highlightActiveLink() {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                link.style.color = '#9393a3';
                
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    link.style.color = '#4f6ef7';
                }
            });
        }
    },

    // ============================================
    // SCROLL ANIMATIONS MODULE (Intersection Observer)
    // ============================================
    ScrollAnimations: {
        init() {
            this.addStyles();
            this.observeElements();
        },

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .reveal {
                    opacity: 0;
                    transform: translateY(50px);
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .reveal.active {
                    opacity: 1;
                    transform: translateY(0);
                }
                .reveal-left {
                    opacity: 0;
                    transform: translateX(-50px);
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .reveal-left.active {
                    opacity: 1;
                    transform: translateX(0);
                }
                .reveal-right {
                    opacity: 0;
                    transform: translateX(50px);
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .reveal-right.active {
                    opacity: 1;
                    transform: translateX(0);
                }
                .reveal-scale {
                    opacity: 0;
                    transform: scale(0.8);
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .reveal-scale.active {
                    opacity: 1;
                    transform: scale(1);
                }
            `;
            document.head.appendChild(style);
        },

        observeElements() {
            // Add reveal classes to elements
            const featureCards = document.querySelectorAll('#features .col-md-4');
            const testimonialCards = document.querySelectorAll('#testimonials .col-md-4');
            const pricingCards = document.querySelectorAll('.pricing-card');
            const faqItems = document.querySelectorAll('.faq-item');
            const sectionTitles = document.querySelectorAll('h2');

            featureCards.forEach((card, index) => {
                card.classList.add('reveal');
                card.style.transitionDelay = `${index * 0.1}s`;
            });

            testimonialCards.forEach((card, index) => {
                card.classList.add('reveal-scale');
                card.style.transitionDelay = `${index * 0.15}s`;
            });

            pricingCards.forEach((card, index) => {
                card.classList.add('reveal');
                card.style.transitionDelay = `${index * 0.1}s`;
            });

            faqItems.forEach((item, index) => {
                item.classList.add('reveal-left');
                item.style.transitionDelay = `${index * 0.08}s`;
            });

            sectionTitles.forEach(title => {
                title.classList.add('reveal');
            });

            // Create observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe all reveal elements
            document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
                observer.observe(el);
            });
        }
    },

    // ============================================
    // STATS COUNTER MODULE
    // ============================================
    StatsCounter: {
        init() {
            this.statsSection = document.getElementById('stats-bar');
            this.statNumbers = document.querySelectorAll('.stat-number');
            this.animated = false;
            
            this.observeStats();
        },

        observeStats() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated) {
                        this.animated = true;
                        this.animateCounters();
                    }
                });
            }, { threshold: 0.5 });

            if (this.statsSection) {
                observer.observe(this.statsSection);
            }
        },

        animateCounters() {
            this.statNumbers.forEach(stat => {
                const target = stat.innerText;
                const isNumber = /^\d+/.test(target);
                
                if (isNumber) {
                    const num = parseInt(target);
                    const suffix = target.replace(/\d+/, '');
                    this.countUp(stat, num, suffix);
                }
            });
        },

        countUp(element, target, suffix) {
            let current = 0;
            const increment = target / 60;
            const duration = 2000;
            const stepTime = duration / 60;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current) + suffix;
            }, stepTime);
        }
    },

    // ============================================
    // FAQ ACCORDION MODULE
    // ============================================
    FAQ: {
        init() {
            this.faqItems = document.querySelectorAll('.faq-item');
            this.addClickHandlers();
            this.addStyles();
        },

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .faq-item {
                    cursor: pointer;
                    overflow: hidden;
                }
                .faq-item p {
                    max-height: 0;
                    opacity: 0;
                    overflow: hidden;
                    transition: all 0.4s ease;
                    margin: 0;
                    padding: 0;
                }
                .faq-item.active p {
                    max-height: 200px;
                    opacity: 1;
                    margin-top: 15px;
                    padding-top: 0;
                }
                .faq-item.active .faq-arrow {
                    transform: rotate(90deg);
                }
                .faq-item h4 {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            `;
            document.head.appendChild(style);
        },

        addClickHandlers() {
            this.faqItems.forEach(item => {
                const heading = item.querySelector('h4');
                
                heading.addEventListener('click', () => {
                    // Close other items
                    this.faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item
                    item.classList.toggle('active');
                });
            });
        }
    },

    // ============================================
    // FORM VALIDATION & SUBMISSION MODULE
    // ============================================
    Form: {
        init() {
            this.form = document.querySelector('#contact form');
            this.nameInput = document.getElementById('nameInput');
            this.emailInput = document.getElementById('exampleInputEmail1');
            this.messageInput = document.getElementById('message');
            
            if (this.form) {
                this.addValidation();
                this.handleSubmit();
            }
        },

        addValidation() {
            // Real-time validation
            const inputs = [this.nameInput, this.emailInput, this.messageInput];
            
            inputs.forEach(input => {
                if (input) {
                    input.addEventListener('blur', () => this.validateField(input));
                    input.addEventListener('input', () => this.clearError(input));
                }
            });
        },

        validateField(input) {
            const value = input.value.trim();
            let isValid = true;
            let errorMessage = '';

            if (input.id === 'nameInput') {
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
            } else if (input.id === 'exampleInputEmail1') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
// sourcery skip: merge-nested-ifs
            } else if (input.id === 'message') {
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
            }

            if (!isValid) {
                this.showError(input, errorMessage);
            } else {
                this.showSuccess(input);
            }

            return isValid;
        },

        showError(input, message) {
            input.style.borderColor = '#ff4757';
            input.style.boxShadow = '0 0 10px rgba(255, 71, 87, 0.3)';
            
            // Remove existing error message
            const existingError = input.parentNode.querySelector('.error-message');
            if (existingError) existingError.remove();
            
            // Add new error message
            const error = document.createElement('div');
            error.className = 'error-message';
            error.style.cssText = 'color: #ff4757; font-size: 12px; margin-top: 5px;';
            error.textContent = message;
            input.parentNode.appendChild(error);
        },

        showSuccess(input) {
            input.style.borderColor = '#2ed573';
            input.style.boxShadow = '0 0 10px rgba(46, 213, 115, 0.3)';
            
            const existingError = input.parentNode.querySelector('.error-message');
            if (existingError) existingError.remove();
        },

        clearError(input) {
            input.style.borderColor = '#2a2a3d';
            input.style.boxShadow = 'none';
            
            const existingError = input.parentNode.querySelector('.error-message');
            if (existingError) existingError.remove();
        },

        handleSubmit() {
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Validate all fields
                const isNameValid = this.validateField(this.nameInput);
                const isEmailValid = this.validateField(this.emailInput);
                const isMessageValid = this.validateField(this.messageInput);

                if (isNameValid && isEmailValid && isMessageValid) {
                    // Show loading state
                    const submitBtn = this.form.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
                    submitBtn.disabled = true;
                    
                    // Add spinner style
                    const spinnerStyle = document.createElement('style');
                    spinnerStyle.textContent = `
                        .spinner {
                            display: inline-block;
                            width: 16px;
                            height: 16px;
                            border: 2px solid #ffffff;
                            border-top-color: transparent;
                            border-radius: 50%;
                            animation: spin 0.8s linear infinite;
                            margin-right: 8px;
                            vertical-align: middle;
                        }
                    `;
                    document.head.appendChild(spinnerStyle);

                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    DevHub.Toast.show('Message sent successfully! We\'ll get back to you soon.', 'success');
                    
                    // Reset form
                    this.form.reset();
                    [this.nameInput, this.emailInput, this.messageInput].forEach(input => {
                        if (input) this.clearError(input);
                    });
                } else {
                    DevHub.Toast.show('Please fix the errors in the form', 'error');
                }
            });
        }
    },

    // ============================================
    // TYPEWRITER EFFECT MODULE
    // ============================================
    TypeWriter: {
        init() {
            this.heroTitle = document.querySelector('#home h1');
            if (this.heroTitle) {
                this.startTypewriter();
            }
        },

        startTypewriter() {
            const words = ['Build.', 'Learn.', 'Grow.', 'Ship.', 'Scale.', 'Create.'];
            let wordIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            
            // Create a container for animated text
            this.heroTitle.innerHTML = `
                <span class="static-text"></span>
                <span class="typed-text"></span>
                <span class="cursor">|</span>
            `;
            
            const typedText = this.heroTitle.querySelector('.typed-text');
            
            // Add cursor blink animation
            const style = document.createElement('style');
            style.textContent = `
                #home h1 .cursor {
                    animation: blink 0.7s infinite;
                    color: #4f6ef7;
                }
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
                #home h1 .typed-text {
                    color: #4f6ef7;
                }
            `;
            document.head.appendChild(style);

            const type = () => {
                const currentWord = words[wordIndex];
                
                if (isDeleting) {
                    charIndex--;
                    typedText.textContent = currentWord.substring(0, charIndex);
                } else {
                    charIndex++;
                    typedText.textContent = currentWord.substring(0, charIndex);
                }

                let typeSpeed = isDeleting ? 50 : 100;

                if (!isDeleting && charIndex === currentWord.length) {
                    typeSpeed = 2000; // Pause at end
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    typeSpeed = 500;
                }

                setTimeout(type, typeSpeed);
            };

            // Start after initial animation
            setTimeout(type, 1500);
        }
    },

    // ============================================
    // PARTICLE BACKGROUND MODULE
    // ============================================
    ParticleBackground: {
        init() {
            this.createCanvas();
            this.particles = [];
            this.createParticles();
            this.animate();
        },

        createCanvas() {
            const canvas = document.createElement('canvas');
            canvas.id = 'particle-canvas';
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            `;
            document.body.prepend(canvas);
            
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.resize();
            
            window.addEventListener('resize', () => this.resize());
        },

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },

        createParticles() {
            const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
            
            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    radius: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    alpha: Math.random() * 0.5 + 0.2
                });
            }
        },

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                // Move particle
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around screen
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
                
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(79, 110, 247, ${particle.alpha})`;
                this.ctx.fill();
            });

            // Draw connections
            this.particles.forEach((p1, i) => {
                this.particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(79, 110, 247, ${0.1 * (1 - distance / 100)})`;
                        this.ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(() => this.animate());
        }
    },

    // ============================================
    // SCROLL PROGRESS MODULE
    // ============================================
    ScrollProgress: {
        init() {
            this.createProgressBar();
            window.addEventListener('scroll', () => this.updateProgress());
        },

        createProgressBar() {
            const progressBar = document.createElement('div');
            progressBar.id = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #4f6ef7, #6c63ff, #4f6ef7);
                background-size: 200% 100%;
                animation: gradient 2s ease infinite;
                z-index: 10001;
                transition: width 0.1s ease;
                border-radius: 0 2px 2px 0;
            `;
            document.body.appendChild(progressBar);
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);
            
            this.progressBar = progressBar;
        },

        updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    },

    // ============================================
    // BACK TO TOP MODULE
    // ============================================
    BackToTop: {
        init() {
            this.createButton();
            window.addEventListener('scroll', () => this.toggleVisibility());
        },

        createButton() {
            const button = document.createElement('button');
            button.id = 'back-to-top';
            button.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
            button.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: #4f6ef7;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                font-size: 18px;
                box-shadow: 0 4px 15px rgba(79, 110, 247, 0.4);
            `;
            
            button.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.1) translateY(-5px)';
                button.style.boxShadow = '0 6px 20px rgba(79, 110, 247, 0.6)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1) translateY(0)';
                button.style.boxShadow = '0 4px 15px rgba(79, 110, 247, 0.4)';
            });

            document.body.appendChild(button);
            this.button = button;
        },

        toggleVisibility() {
            if (window.scrollY > 500) {
                this.button.style.opacity = '1';
                this.button.style.visibility = 'visible';
            } else {
                this.button.style.opacity = '0';
                this.button.style.visibility = 'hidden';
            }
        }
    },

    // ============================================
    // CUSTOM CURSOR MODULE
    // ============================================
    CursorEffect: {
        init() {
            if (window.matchMedia('(pointer: fine)').matches) {
                this.createCursor();
                this.addEventListeners();
            }
        },

        createCursor() {
            const cursor = document.createElement('div');
            cursor.id = 'custom-cursor';
            cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
            
            const style = document.createElement('style');
            style.textContent = `
                #custom-cursor {
                    position: fixed;
                    pointer-events: none;
                    z-index: 99999;
                }
                .cursor-dot {
                    width: 8px;
                    height: 8px;
                    background: #4f6ef7;
                    border-radius: 50%;
                    position: absolute;
                    transform: translate(-50%, -50%);
                    transition: transform 0.1s ease;
                }
                .cursor-ring {
                    width: 40px;
                    height: 40px;
                    border: 2px solid rgba(79, 110, 247, 0.5);
                    border-radius: 50%;
                    position: absolute;
                    transform: translate(-50%, -50%);
                    transition: all 0.15s ease;
                }
                .cursor-hover .cursor-ring {
                    width: 60px;
                    height: 60px;
                    border-color: #4f6ef7;
                    background: rgba(79, 110, 247, 0.1);
                }
                .cursor-hover .cursor-dot {
                    transform: translate(-50%, -50%) scale(1.5);
                }
                body { cursor: none; }
                a, button, .faq-item, .pricing-card { cursor: none; }
            `;
            document.head.appendChild(style);
            document.body.appendChild(cursor);
            
            this.cursor = cursor;
            this.dot = cursor.querySelector('.cursor-dot');
            this.ring = cursor.querySelector('.cursor-ring');
        },

        addEventListeners() {
            document.addEventListener('mousemove', (e) => {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';
            });

            const hoverElements = document.querySelectorAll('a, button, .faq-item, .pricing-card, .nav-link');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => this.cursor.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => this.cursor.classList.remove('cursor-hover'));
            });
        }
    },

    // ============================================
    // PARALLAX MODULE
    // ============================================
    Parallax: {
        init() {
            this.hero = document.getElementById('home');
            window.addEventListener('scroll', () => this.handleParallax());
        },

        handleParallax() {
            const scrolled = window.scrollY;
            if (this.hero && scrolled < window.innerHeight) {
                const heroContent = this.hero.querySelectorAll('h1, p, .hero-btns');
                heroContent.forEach((el, index) => {
                    el.style.transform = `translateY(${scrolled * (0.3 + index * 0.1)}px)`;
                    el.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
                });
            }
        }
    },

    // ============================================
    // THEME TOGGLE MODULE
    // ============================================
    ThemeToggle: {
        init() {
            this.createToggle();
            this.loadTheme();
        },

        createToggle() {
            const toggle = document.createElement('button');
            toggle.id = 'theme-toggle';
            toggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            toggle.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 30px;
                width: 50px;
                height: 50px;
                background: #2a2a3d;
                color: #e4e4e7;
                border: 1px solid #4f6ef7;
                border-radius: 50%;
                cursor: pointer;
                z-index: 1000;
                font-size: 18px;
                transition: all 0.3s ease;
            `;
            
            toggle.addEventListener('click', () => this.toggleTheme());
            toggle.addEventListener('mouseenter', () => {
                toggle.style.transform = 'scale(1.1)';
                toggle.style.boxShadow = '0 0 15px rgba(79, 110, 247, 0.5)';
            });
            toggle.addEventListener('mouseleave', () => {
                toggle.style.transform = 'scale(1)';
                toggle.style.boxShadow = 'none';
            });

            document.body.appendChild(toggle);
            this.toggle = toggle;
        },

        toggleTheme() {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            
            this.toggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            if (isLight) {
                this.applyLightTheme();
            } else {
                this.applyDarkTheme();
            }
            
            DevHub.Toast.show(`Switched to ${isLight ? 'Light' : 'Dark'} mode`, 'info');
        },

        loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
                this.toggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
                this.applyLightTheme();
            }
        },

        applyLightTheme() {
            const style = document.createElement('style');
            style.id = 'light-theme-styles';
            style.textContent = `
                body.light-theme {
                    background-color: #f5f5f7;
                    color: #1a1a2e;
                }
                body.light-theme .navbar,
                body.light-theme #stats-bar,
                body.light-theme #contact,
                body.light-theme footer {
                    background-color: #ffffff;
                }
                body.light-theme #features .col-md-4,
                body.light-theme #testimonials .col-md-4,
                body.light-theme .pricing-card,
                body.light-theme .form-control,
                body.light-theme .form-select {
                    background-color: #ffffff;
                    color: #1a1a2e;
                }
                body.light-theme h1,
                body.light-theme h2,
                body.light-theme h3,
                body.light-theme h4,
                body.light-theme h5,
                body.light-theme h6 {
                    color: #1a1a2e;
                }
                body.light-theme p,
                body.light-theme .nav-link {
                    color: #666;
                }
            `;
            document.head.appendChild(style);
        },

        applyDarkTheme() {
            const lightStyles = document.getElementById('light-theme-styles');
            if (lightStyles) lightStyles.remove();
        }
    },

    // ============================================
    // TOAST NOTIFICATION MODULE
    // ============================================
    Toast: {
        init() {
            this.createContainer();
        },

        createContainer() {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 100px;
                right: 30px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
            this.container = container;
        },

        show(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast-message toast-${type}`;
            
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-times-circle',
                info: 'fa-info-circle',
                warning: 'fa-exclamation-triangle'
            };
            
            const colors = {
                success: '#2ed573',
                error: '#ff4757',
                info: '#4f6ef7',
                warning: '#ffa502'
            };
            
            toast.innerHTML = `
                <i class="fa-solid ${icons[type]}"></i>
                <span>${message}</span>
                <button class="toast-close">&times;</button>
            `;
            
            toast.style.cssText = `
                background: #1a1a2e;
                color: #e4e4e7;
                padding: 15px 20px;
                border-radius: 8px;
                border-left: 4px solid ${colors[type]};
                display: flex;
                align-items: center;
                gap: 12px;
                min-width: 300px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease;
            `;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .toast-close {
                    background: none;
                    border: none;
                    color: #9393a3;
                    font-size: 20px;
                    cursor: pointer;
                    margin-left: auto;
                }
                .toast-close:hover { color: #e4e4e7; }
            `;
            document.head.appendChild(style);

            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => this.dismiss(toast));

            this.container.appendChild(toast);

            // Auto dismiss after 5 seconds
            setTimeout(() => this.dismiss(toast), 5000);
        },

        dismiss(toast) {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    },

    // ============================================
    // MOBILE MENU MODULE
    // ============================================
    MobileMenu: {
        init() {
            this.navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            this.navbarCollapse = document.getElementById('navbarNavDropdown');
            this.toggler = document.querySelector('.navbar-toggler');
            
            this.closeOnClick();
        },

        closeOnClick() {
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 992) {
                        const bsCollapse = bootstrap.Collapse.getInstance(this.navbarCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    }
                });
            });
        }
    },

    // ============================================
    // SMOOTH SCROLL MODULE
    // ============================================
    SmoothScroll: {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    },

    // ============================================
    // LAZY LOAD MODULE
    // ============================================
    LazyLoad: {
        init() {
            const images = document.querySelectorAll('img[data-src]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            }
        }
    },

    // ============================================
    // PRICING TOGGLE MODULE
    // ============================================
    PricingToggle: {
        init() {
            this.addBillingToggle();
        },

        addBillingToggle() {
            const pricingSection = document.getElementById('pricing');
            const heading = pricingSection.querySelector('h2');
            
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'billing-toggle';
            toggleContainer.innerHTML = `
                <span class="billing-label active" data-billing="monthly">Monthly</span>
                <label class="switch">
                    <input type="checkbox" id="billing-switch">
                    <span class="slider"></span>
                </label>
                <span class="billing-label" data-billing="yearly">Yearly <span class="save-badge">Save 20%</span></span>
            `;
            
            toggleContainer.style.cssText = `
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 15px;
                margin-bottom: 40px;
            `;

            const style = document.createElement('style');
            style.textContent = `
                .billing-toggle .switch {
                    position: relative;
                    width: 60px;
                    height: 30px;
                }
                .billing-toggle .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .billing-toggle .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #2a2a3d;
                    transition: 0.4s;
                    border-radius: 30px;
                }
                .billing-toggle .slider:before {
                    position: absolute;
                    content: "";
                    height: 22px;
                    width: 22px;
                    left: 4px;
                    bottom: 4px;
                    background-color: #4f6ef7;
                    transition: 0.4s;
                    border-radius: 50%;
                }
                .billing-toggle input:checked + .slider:before {
                    transform: translateX(30px);
                }
                .billing-label {
                    color: #9393a3;
                    cursor: pointer;
                    transition: color 0.3s;
                }
                .billing-label.active {
                    color: #e4e4e7;
                    font-weight: 600;
                }
                .save-badge {
                    background: #2ed573;
                    color: #000;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 600;
                    margin-left: 5px;
                }
            `;
            document.head.appendChild(style);

            heading.after(toggleContainer);

            const billingSwitch = document.getElementById('billing-switch');
            const prices = {
                free: { monthly: 0, yearly: 0 },
                pro: { monthly: 19, yearly: 15 },
                team: { monthly: 49, yearly: 39 }
            };

            billingSwitch.addEventListener('change', () => {
                const isYearly = billingSwitch.checked;
                const labels = document.querySelectorAll('.billing-label');
                
                labels.forEach(label => {
                    label.classList.toggle('active', 
                        (isYearly && label.dataset.billing === 'yearly') ||
                        (!isYearly && label.dataset.billing === 'monthly')
                    );
                });

                const priceElements = document.querySelectorAll('.card-price');
                priceElements.forEach((el, index) => {
                    const plans = ['free', 'pro', 'team'];
                    const price = prices[plans[index]][isYearly ? 'yearly' : 'monthly'];
                    el.textContent = `$${price}/mo`;
                    
                    el.style.transform = 'scale(1.1)';
                    setTimeout(() => el.style.transform = 'scale(1)', 200);
                });
            });
        }
    },

    // ============================================
    // TESTIMONIALS CAROUSEL MODULE
    // ============================================
    Testimonials: {
        init() {
            this.addAutoRotate();
        },

        addAutoRotate() {
            const testimonials = document.querySelectorAll('#testimonials .col-md-4');
            let currentIndex = 0;

            // Only activate on mobile
            if (window.innerWidth < 768) {
                setInterval(() => {
                    testimonials.forEach(t => t.style.opacity = '0.5');
                    testimonials[currentIndex].style.opacity = '1';
                    currentIndex = (currentIndex + 1) % testimonials.length;
                }, 3000);
            }
        }
    },

    // ============================================
    // EASTER EGGS MODULE
    // ============================================
    EasterEggs: {
        init() {
            this.konamiCode();
            this.logoClick();
        },

        konamiCode() {
            const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
            let index = 0;

            document.addEventListener('keydown', (e) => {
                if (e.code === code[index]) {
                    index++;
                    if (index === code.length) {
                        this.activateEasterEgg();
                        index = 0;
                    }
                } else {
                    index = 0;
                }
            });
        },

        activateEasterEgg() {
            DevHub.Toast.show('🎉 Konami Code Activated! You found the secret!', 'success');
            
            document.body.style.animation = 'rainbow 2s ease';
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);

            // Confetti effect
            this.createConfetti();
        },

        createConfetti() {
            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: hsl(${Math.random() * 360}, 100%, 50%);
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    z-index: 99999;
                    pointer-events: none;
                    animation: fall ${2 + Math.random() * 2}s linear forwards;
                `;
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 4000);
            }

            const style = document.createElement('style');
            style.textContent = `
                @keyframes fall {
                    to {
                        top: 100vh;
                        transform: rotate(720deg);
                    }
                }
            `;
            document.head.appendChild(style);
        },

        logoClick() {
            const logo = document.querySelector('.navbar-brand');
            let clickCount = 0;
            
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                clickCount++;
                
                if (clickCount === 5) {
                    DevHub.Toast.show('👋 Hello there, curious developer!', 'info');
                    clickCount = 0;
                }
            });
        }
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Get scroll percentage
    getScrollPercent() {
        const h = document.documentElement;
        const b = document.body;
        return (h.scrollTop || b.scrollTop) / ((h.scrollHeight || b.scrollHeight) - h.clientHeight) * 100;
    }
};

// Performance optimization - Use requestAnimationFrame for scroll events
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
});

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

console.log('%c DevHub ', 'background: #4f6ef7; color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
console.log('%c Built with ❤️ by NeelKing ', 'color: #9393a3; font-size: 12px;');