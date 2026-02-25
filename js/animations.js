/* =============================================
   ANIMATIONS.JS — Scroll-triggered Reveal & Stat Bars
   Uses IntersectionObserver for performance
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // 1. SCROLL REVEAL ANIMATION
    // ===========================
    const revealElements = document.querySelectorAll(
        '.reveal-up, .reveal-down, .reveal-left, .reveal-right'
    );

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Apply delay from data-delay attribute or transition-delay style
                    const delay = entry.target.dataset.delay;
                    if (delay) {
                        entry.target.style.transitionDelay = delay + 'ms';
                    }

                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ===========================
    // 2. STAT BAR FILL ANIMATION
    // ===========================
    const statFills = document.querySelectorAll('.stat .fill');

    if (statFills.length > 0) {
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const width = fill.dataset.width;

                    if (width) {
                        // Small delay for staggered effect
                        const card = fill.closest('.roster-card');
                        const allFills = card ? card.querySelectorAll('.fill') : [fill];
                        const index = Array.from(allFills).indexOf(fill);

                        setTimeout(() => {
                            fill.style.width = width;
                            fill.style.transform = 'scaleX(1)';
                            fill.classList.add('animated');
                        }, index * 200);
                    }

                    barObserver.unobserve(fill);
                }
            });
        }, {
            threshold: 0.3
        });

        statFills.forEach(fill => barObserver.observe(fill));
    }

    // ===========================
    // 3. TIMELINE DOT GLOW ON SCROLL
    // ===========================
    const timelineDots = document.querySelectorAll('.timeline-dot');

    if (timelineDots.length > 0) {
        const dotObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.background = 'var(--primary)';
                    entry.target.style.boxShadow = '0 0 12px var(--primary-glow)';
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -20% 0px'
        });

        timelineDots.forEach(dot => dotObserver.observe(dot));
    }

    // ===========================
    // 4. PARALLAX-LITE FOR HERO
    // ===========================
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight) * 0.8;
                const translateY = scrolled * 0.3;
                heroContent.style.opacity = opacity;
                heroContent.style.transform = `translateY(${translateY}px)`;
            }
        }, { passive: true });
    }

    // ===========================
    // 5. CARD TILT EFFECT ON MOUSEMOVE
    // ===========================
    const rosterCards = document.querySelectorAll('.roster-card');

    rosterCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (card.classList.contains('flipped')) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            const front = card.querySelector('.card-front');
            if (front) {
                front.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            }

            // Move glow with cursor
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.left = `${x - rect.width}px`;
                glow.style.top = `${y - rect.height}px`;
            }
        });

        card.addEventListener('mouseleave', () => {
            const front = card.querySelector('.card-front');
            if (front) {
                front.style.transform = '';
            }
        });
    });

    // ===========================
    // 6. STAGGERED ANIMATION FOR AMALAN CARDS
    // ===========================
    const amalanCards = document.querySelectorAll('.amalan-card');

    if (amalanCards.length > 0) {
        const amalanObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.parentElement.querySelectorAll('.amalan-card');
                    cards.forEach((card, i) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, i * 100);
                    });
                    amalanObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const amalanGrid = document.querySelector('.amalan-grid');
        if (amalanGrid) amalanObserver.observe(amalanGrid);
    }

    // ===========================
    // 7. LOADING ANIMATION
    // ===========================
    // Brief fade-in on load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });

});
