(function() {
    'use strict';

    if (document.querySelector('.footer')) return;

    // Path detection
    var isSubpage = window.location.pathname !== '/' && window.location.pathname !== '/index.html';
    var P = isSubpage ? '../' : '';
    var HOME = isSubpage ? '../' : '/';
    var HASH_HOME = isSubpage ? '../' : '';

    // ============================================================
    // FOOTER
    // ============================================================
    var footerHTML =
        '<footer class="footer">' +
            '<div class="container">' +
                '<div class="footer__grid">' +
                    '<div class="footer__col footer__col--logo">' +
                        '<a href="' + HOME + '" class="footer__logo">АГ СТРОЙ</a>' +
                        '<div class="footer__socials">' +
                            '<a href="https://t.me/pkagstroy" aria-label="Telegram" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M16.5 1.5L1 8l5 2m10.5-8.5L10 16l-4-6m10.5-8.5L6 10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
                            '<a href="https://wa.me/79998926036" aria-label="WhatsApp" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.25-1.44l-.38-.22-3.92 1.03 1.04-3.82-.25-.4A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.93 9.93 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.44-7.4c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51l-.58-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.34z" fill="currentColor"/></svg></a>' +
                        '</div>' +
                        '<div class="footer__contacts">' +
                            '<a href="tel:+79998926036">+7 999 892-60-36</a>' +
                            '<a href="mailto:agstroy@list.ru">agstroy@list.ru</a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="footer__col">' +
                        '<h4 class="footer__heading">\u041A\u0430\u0442\u0430\u043B\u043E\u0433</h4>' +
                        '<ul>' +
                            '<li><a href="' + P + 'catalog-plitka">\u0422\u0440\u043E\u0442\u0443\u0430\u0440\u043D\u0430\u044F \u043F\u043B\u0438\u0442\u043A\u0430</a></li>' +
                            '<li><a href="' + P + 'catalog-bordyury">\u0411\u043E\u0440\u0434\u044E\u0440\u044B</a></li>' +
                            '<li><a href="' + P + 'catalog-kompensatory">\u041A\u043E\u043C\u043F\u0435\u043D\u0441\u0430\u0442\u043E\u0440\u044B</a></li>' +
                            '<li><a href="' + P + 'catalog">\u0413\u0430\u0437\u043E\u043D\u043D\u0430\u044F \u0440\u0435\u0448\u0451\u0442\u043A\u0430</a></li>' +
                            '<li><a href="' + P + 'catalog">\u0412\u043E\u0434\u043E\u043E\u0442\u0432\u043E\u0434\u043D\u044B\u0435 \u043B\u043E\u0442\u043A\u0438</a></li>' +
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
                            '<li><a href="' + P + 'about">\u041E \u043D\u0430\u0441</a></li>' +
                            '<li><a href="' + P + 'about#production">\u041F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u043E</a></li>' +
                            '<li><a href="#">\u0421\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u044B</a></li>' +
                            '<li><a href="#">\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438</a></li>' +
                        '</ul>' +
                    '</div>' +
                '</div>' +
                '<div class="footer__bottom">' +
                    '<p>&copy; АГ СТРОЙ 2010\u20132026. \u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B.</p>' +
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
