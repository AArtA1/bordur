document.addEventListener('DOMContentLoaded', () => {

    // ===== PROMO BAR =====
    const promoBar = document.getElementById('promoBar');
    const promoClose = document.getElementById('promoClose');
    const promoSlides = document.querySelectorAll('.promo-bar__slide');
    const header = document.getElementById('header');
    let promoIndex = 0;

    // Auto-rotate promo slides
    if (promoSlides.length > 1) {
        setInterval(() => {
            promoSlides[promoIndex].classList.remove('promo-bar__slide--active');
            promoIndex = (promoIndex + 1) % promoSlides.length;
            promoSlides[promoIndex].classList.add('promo-bar__slide--active');
        }, 4000);
    }

    // Close promo bar
    if (promoClose) {
        promoClose.addEventListener('click', () => {
            promoBar.style.transform = 'translateY(-100%)';
            promoBar.style.transition = 'transform .3s ease';
            header.classList.add('header--no-promo');
        });
    }

    // ===== HEADER SCROLL =====
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });

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

    // ===== COUNTDOWN TIMERS =====
    function updateTimers() {
        document.querySelectorAll('.offer-card__timer').forEach(timer => {
            const deadline = new Date(timer.dataset.deadline).getTime();
            const now = Date.now();
            const diff = Math.max(0, deadline - now);

            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            const el = (attr) => timer.querySelector(`[${attr}]`);
            const pad = (n) => String(n).padStart(2, '0');

            if (el('data-days')) el('data-days').textContent = pad(d);
            if (el('data-hours')) el('data-hours').textContent = pad(h);
            if (el('data-minutes')) el('data-minutes').textContent = pad(m);
            if (el('data-seconds')) el('data-seconds').textContent = pad(s);
        });
    }
    updateTimers();
    setInterval(updateTimers, 1000);

    // ===== COLLECTION TABS =====
    document.querySelectorAll('.collections__tabs').forEach(tabGroup => {
        const tabs = tabGroup.querySelectorAll('.collections__tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('collections__tab--active'));
                tab.classList.add('collections__tab--active');
            });
        });
    });

    // ===== PRODUCT QTY BUTTONS =====
    document.querySelectorAll('.product-card__qty').forEach(qtyGroup => {
        const input = qtyGroup.querySelector('.product-card__qty-input');
        const minus = qtyGroup.querySelector('[data-action="minus"]');
        const plus = qtyGroup.querySelector('[data-action="plus"]');

        if (minus) minus.addEventListener('click', () => {
            const val = parseInt(input.value) || 0;
            if (val > 1) input.value = val - 1;
        });
        if (plus) plus.addEventListener('click', () => {
            const val = parseInt(input.value) || 0;
            input.value = val + 1;
        });
    });

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

    // ===== SCROLL ANIMATIONS =====
    const animTargets = document.querySelectorAll(
        '.categories__item, .stats__item, .offer-card, .collection-card, .product-card, .gallery__item, .video-card, .blog-card'
    );
    animTargets.forEach(el => el.classList.add('fade-up'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger siblings
                const siblings = entry.target.parentElement.querySelectorAll('.fade-up');
                let idx = Array.from(siblings).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('fade-up--visible');
                }, idx * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    animTargets.forEach(el => observer.observe(el));

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                closeMenu();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
