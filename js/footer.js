(function() {
    'use strict';

    if (document.querySelector('.footer')) return;

    // Path detection
    var isSubpage = /[\/\\]pages[\/\\]/.test(window.location.pathname);
    var P = isSubpage ? '' : 'pages/';
    var HOME = isSubpage ? '../index.html' : '/';
    var HASH_HOME = isSubpage ? '../index.html' : '';

    // ============================================================
    // FOOTER
    // ============================================================
    var footerHTML =
        '<footer class="footer">' +
            '<div class="container">' +
                '<div class="footer__grid">' +
                    '<div class="footer__col footer__col--logo">' +
                        '<a href="' + HOME + '" class="footer__logo">BORDUR</a>' +
                        '<div class="footer__socials">' +
                            '<a href="#" aria-label="Telegram"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M16.5 1.5L1 8l5 2m10.5-8.5L10 16l-4-6m10.5-8.5L6 10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
                            '<a href="#" aria-label="VK"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9.5 13c-3.8 0-6-2.6-6.1-7h1.9c.1 3.2 1.5 4.5 2.5 4.8V6h1.8v2.7c1.1-.1 2.3-1.4 2.6-2.7h1.8c-.3 1.6-1.5 3-2.4 3.4.9.4 2.3 1.5 2.9 3.6h-2c-.4-1.4-1.5-2.4-2.9-2.5V13h-.1z" fill="currentColor"/></svg></a>' +
                        '</div>' +
                        '<div class="footer__contacts">' +
                            '<a href="tel:+79998926036">+7 999 892-60-36</a>' +
                            '<a href="mailto:agstroy@list.ru">agstroy@list.ru</a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="footer__col">' +
                        '<h4 class="footer__heading">\u041A\u0430\u0442\u0430\u043B\u043E\u0433</h4>' +
                        '<ul>' +
                            '<li><a href="' + P + 'catalog-plitka.html">\u0422\u0440\u043E\u0442\u0443\u0430\u0440\u043D\u0430\u044F \u043F\u043B\u0438\u0442\u043A\u0430</a></li>' +
                            '<li><a href="' + P + 'catalog-bordyury.html">\u0411\u043E\u0440\u0434\u044E\u0440\u044B</a></li>' +
                            '<li><a href="' + P + 'catalog-kompensatory.html">\u041A\u043E\u043C\u043F\u0435\u043D\u0441\u0430\u0442\u043E\u0440\u044B</a></li>' +
                            '<li><a href="' + P + 'catalog.html">\u0413\u0430\u0437\u043E\u043D\u043D\u0430\u044F \u0440\u0435\u0448\u0451\u0442\u043A\u0430</a></li>' +
                            '<li><a href="' + P + 'catalog.html">\u0412\u043E\u0434\u043E\u043E\u0442\u0432\u043E\u0434\u043D\u044B\u0435 \u043B\u043E\u0442\u043A\u0438</a></li>' +
                        '</ul>' +
                    '</div>' +
                    '<div class="footer__col">' +
                        '<h4 class="footer__heading">\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044E</h4>' +
                        '<ul>' +
                            '<li><a href="' + HASH_HOME + '#callback">\u041E\u043F\u043B\u0430\u0442\u0430 \u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430</a></li>' +
                            '<li><a href="' + HASH_HOME + '#callback">\u0412\u043E\u043F\u0440\u043E\u0441-\u043E\u0442\u0432\u0435\u0442</a></li>' +
                            '<li><a href="' + HASH_HOME + '#gallery">\u0424\u043E\u0442\u043E \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432</a></li>' +
                            '<li><a href="' + HASH_HOME + '#contacts">\u0413\u0434\u0435 \u043A\u0443\u043F\u0438\u0442\u044C?</a></li>' +
                            '<li><a href="' + HASH_HOME + '#contacts">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</a></li>' +
                        '</ul>' +
                    '</div>' +
                    '<div class="footer__col">' +
                        '<h4 class="footer__heading">\u041E \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438</h4>' +
                        '<ul>' +
                            '<li><a href="' + P + 'about.html">\u041E \u043D\u0430\u0441</a></li>' +
                            '<li><a href="' + P + 'about.html#production">\u041F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u043E</a></li>' +
                            '<li><a href="#">\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438</a></li>' +
                        '</ul>' +
                    '</div>' +
                '</div>' +
                '<div class="footer__bottom">' +
                    '<p>&copy; BORDUR 2010\u20132026. \u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B.</p>' +
                    '<a href="#">\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438</a>' +
                '</div>' +
            '</div>' +
        '</footer>';

    // ============================================================
    // COOKIE BAR
    // ============================================================
    var cookieHTML =
        '<div class="cookie-bar" id="cookieBar">' +
            '<p>\u041C\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u043C \u0444\u0430\u0439\u043B\u044B cookie \u0434\u043B\u044F \u0443\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0441\u0430\u0439\u0442\u0430. \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u044F \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0441\u0430\u0439\u0442, \u0412\u044B \u0441\u043E\u0433\u043B\u0430\u0448\u0430\u0435\u0442\u0435\u0441\u044C \u0441 <a href="#">\u043F\u043E\u043B\u0438\u0442\u0438\u043A\u043E\u0439 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0438 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445</a>.</p>' +
            '<button class="cookie-bar__btn" id="cookieAccept">\u041F\u0440\u0438\u043D\u044F\u0442\u044C</button>' +
        '</div>';

    // ============================================================
    // BACK TO TOP
    // ============================================================
    var backToTopHTML =
        '<button class="back-to-top" id="backToTop" aria-label="\u041D\u0430\u0432\u0435\u0440\u0445">' +
            '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 16V4M4 10l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>';

    // ============================================================
    // INJECT INTO DOM
    // ============================================================
    // Find the script tags area (footer goes before scripts)
    var scripts = document.querySelectorAll('body > script[src]');
    var firstScript = scripts.length ? scripts[0] : null;

    var wrapper = document.createElement('div');
    wrapper.innerHTML = footerHTML + cookieHTML + backToTopHTML;
    while (wrapper.firstChild) {
        if (firstScript) {
            document.body.insertBefore(wrapper.firstChild, firstScript);
        } else {
            document.body.appendChild(wrapper.firstChild);
        }
    }

    // ============================================================
    // COOKIE BAR LOGIC
    // ============================================================
    var cookieAccept = document.getElementById('cookieAccept');
    var cookieBar = document.getElementById('cookieBar');
    if (cookieAccept) {
        cookieAccept.addEventListener('click', function() {
            cookieBar.classList.add('cookie-bar--hidden');
        });
    }

    // ============================================================
    // BACK TO TOP LOGIC
    // ============================================================
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 600) {
                backToTop.classList.add('back-to-top--visible');
            } else {
                backToTop.classList.remove('back-to-top--visible');
            }
        }, { passive: true });
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

})();
