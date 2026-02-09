document.addEventListener('DOMContentLoaded', () => {

    // ===== PROMO BAR =====
    const promoBar = document.getElementById('promoBar');
    const promoClose = document.getElementById('promoClose');
    const promoSlides = document.querySelectorAll('.promo-bar__slide');
    const header = document.getElementById('header');
    const hero = document.getElementById('hero');
    let promoIndex = 0;

    if (promoSlides.length > 1) {
        setInterval(() => {
            promoSlides[promoIndex].classList.remove('promo-bar__slide--active');
            promoIndex = (promoIndex + 1) % promoSlides.length;
            promoSlides[promoIndex].classList.add('promo-bar__slide--active');
        }, 4000);
    }

    if (promoClose) {
        promoClose.addEventListener('click', () => {
            promoBar.classList.add('promo-bar--hidden');
            header.classList.add('header--no-promo');
            if (hero) hero.classList.add('hero--no-promo');
            const bc = document.querySelector('.breadcrumbs');
            if (bc) bc.classList.add('breadcrumbs--no-promo');
        });
    }

    // ===== HEADER SCROLL =====
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }, { passive: true });

    // ===== MOBILE MENU =====
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('menuClose');
    const overlay = document.getElementById('overlay');

    function openMenu() {
        mobileMenu.classList.add('mobile-menu--active');
        overlay.classList.add('overlay--active');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        mobileMenu.classList.remove('mobile-menu--active');
        overlay.classList.remove('overlay--active');
        document.body.style.overflow = '';
    }

    if (burgerBtn) burgerBtn.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // ===== HERO TABS (with animation restart) =====
    const heroTabs = document.querySelectorAll('.hero__tab');
    const heroPanels = document.querySelectorAll('.hero__panel');

    function switchHeroTab(index) {
        heroTabs.forEach(t => t.classList.remove('hero__tab--active'));
        heroPanels.forEach(p => p.classList.remove('hero__panel--active'));
        if (heroTabs[index]) heroTabs[index].classList.add('hero__tab--active');
        if (heroPanels[index]) {
            // Force reflow to restart CSS animations
            void heroPanels[index].offsetWidth;
            heroPanels[index].classList.add('hero__panel--active');
        }
    }

    heroTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const idx = parseInt(tab.dataset.tab);
            switchHeroTab(idx);
        });
    });

    // Header nav & mobile menu links that switch hero tabs
    document.querySelectorAll('[data-hero-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            const idx = parseInt(link.dataset.heroTab);
            switchHeroTab(idx);
            closeMenu();
        });
    });

    // Remove intro class after initial entrance animations complete
    if (hero) {
        setTimeout(() => {
            hero.classList.remove('hero--intro');
        }, 1800);
    }

    // ===== STATS COUNTER ANIMATION =====
    function animateCounter(el) {
        const textNode = el.childNodes[0];
        if (!textNode || textNode.nodeType !== 3) return;
        const target = parseInt(textNode.textContent.trim());
        if (isNaN(target) || target <= 0) return;

        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            textNode.textContent = current + ' ';
            if (progress < 1) requestAnimationFrame(update);
        }

        textNode.textContent = '0 ';
        requestAnimationFrame(update);
    }

    const statsValues = document.querySelectorAll('.stats__value');
    if (statsValues.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsValues.forEach(el => counterObserver.observe(el));
    }

    // ===== SCROLL ANIMATIONS (data-anim system) =====
    const animTargets = document.querySelectorAll('[data-anim]');

    if (animTargets.length) {
        const animObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.animDelay || '0');
                    if (delay > 0) {
                        setTimeout(() => {
                            entry.target.classList.add('anim--visible');
                        }, delay);
                    } else {
                        entry.target.classList.add('anim--visible');
                    }
                    animObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        animTargets.forEach(el => animObserver.observe(el));
    }

    // ===== VIDEO BANNER PARALLAX =====
    const videoBanner = document.querySelector('.video-banner');
    if (videoBanner) {
        const videoBg = videoBanner.querySelector('.video-banner__bg');
        if (videoBg) {
            window.addEventListener('scroll', () => {
                const rect = videoBanner.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < window.innerHeight) {
                    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                    const offset = (progress - 0.5) * 80;
                    videoBg.style.transform = 'translateY(' + offset + 'px) scale(1.1)';
                }
            }, { passive: true });
        }
    }

    // ===== CALLBACK FORM =====
    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        callbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = callbackForm.querySelector('[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Отправлено!';
            btn.style.background = '#4CAF50';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = orig;
                btn.style.background = '';
                btn.disabled = false;
                callbackForm.reset();
            }, 3000);
        });
    }

    // ===== COOKIE BAR =====
    const cookieBar = document.getElementById('cookieBar');
    const cookieAccept = document.getElementById('cookieAccept');
    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            cookieBar.classList.add('cookie-bar--hidden');
        });
    }

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('back-to-top--visible');
            } else {
                backToTop.classList.remove('back-to-top--visible');
            }
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== SMOOTH SCROLL (with header offset) =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                closeMenu();
                const headerHeight = header.offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ===== CATALOG FILTER CHIPS =====
    const filterGroups = document.querySelectorAll('.catalog-filters__group');
    if (filterGroups.length) {
        filterGroups.forEach(group => {
            const chips = group.querySelectorAll('.catalog-filters__chip');
            chips.forEach(chip => {
                chip.addEventListener('click', () => {
                    chips.forEach(c => c.classList.remove('catalog-filters__chip--active'));
                    chip.classList.add('catalog-filters__chip--active');
                });
            });
        });
    }

});
