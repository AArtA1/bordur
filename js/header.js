(function() {
    'use strict';

    if (document.getElementById('cardNav')) return;

    // Path detection
    var isSubpage = /[\/\\]pages[\/\\]/.test(window.location.pathname);
    var P = isSubpage ? '' : 'pages/';
    var HOME = isSubpage ? '../index.html' : 'index.html';
    var HASH_HOME = isSubpage ? '../index.html' : 'index.html';

    // ============================================================
    // NAV CARDS DATA
    // ============================================================
    var cards = [
        {
            label: '\u041F\u0440\u043E\u0434\u0443\u043A\u0446\u0438\u044F',
            bg: '#1a1a1a',
            color: '#fff',
            links: [
                { text: '\u0422\u0440\u043E\u0442\u0443\u0430\u0440\u043D\u0430\u044F \u043F\u043B\u0438\u0442\u043A\u0430', href: P + 'catalog-plitka.html' },
                { text: '\u0411\u043E\u0440\u0434\u044E\u0440\u044B', href: P + 'catalog-bordyury.html' },
                { text: '\u041A\u043E\u043C\u043F\u0435\u043D\u0441\u0430\u0442\u043E\u0440\u044B', href: P + 'catalog-kompensatory.html' }
            ]
        },
        {
            label: '\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F',
            bg: '#1a1a1a',
            color: '#fff',
            links: [
                { text: '\u041E \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438', href: P + 'about.html' },
                { text: '\u0421\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u044B', href: '#' },
                { text: '\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B', href: HASH_HOME + '#callback' }
            ]
        }
    ];

    // ============================================================
    // BUILD CARDS HTML
    // ============================================================
    var cardsHTML = '';
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var linksHTML = '';
        for (var j = 0; j < card.links.length; j++) {
            linksHTML += '<a href="' + card.links[j].href + '" class="nav-card-link">' + card.links[j].text + '</a>';
        }
        cardsHTML +=
            '<div class="nav-card" style="background:' + card.bg + ';color:' + card.color + '">' +
                '<span class="nav-card-label">' + card.label + '</span>' +
                '<div class="nav-card-links">' + linksHTML + '</div>' +
            '</div>';
    }

    // ============================================================
    // HEADER HTML
    // ============================================================
    var headerHTML =
        '<div class="card-nav-container" id="header">' +
            '<nav class="card-nav" id="cardNav">' +
                '<div class="card-nav-top">' +
                    '<button class="hamburger-menu" id="hamburgerBtn" aria-label="\u041C\u0435\u043D\u044E">' +
                        '<span class="hamburger-line"></span>' +
                        '<span class="hamburger-line"></span>' +
                    '</button>' +
                    '<a href="' + HOME + '" class="card-nav-logo">' +
                        '<span class="card-nav-logo-text">АГ СТРОЙ</span>' +
                    '</a>' +
                    '<button class="card-nav-cta" id="leadFormTrigger" type="button">\u041F\u0435\u0440\u0435\u0437\u0432\u043E\u043D\u0438\u0442\u0435 \u043C\u043D\u0435</button>' +
                '</div>' +
                '<div class="card-nav-content">' +
                    cardsHTML +
                '</div>' +
            '</nav>' +
        '</div>' +
        '<div class="overlay" id="overlay"></div>';

    // ============================================================
    // INJECT INTO DOM
    // ============================================================
    var wrapper = document.createElement('div');
    wrapper.innerHTML = headerHTML;
    while (wrapper.firstChild) {
        document.body.insertBefore(wrapper.firstChild, document.body.firstChild);
    }

    // ============================================================
    // CARD-NAV TOGGLE LOGIC
    // ============================================================
    var cardNav = document.getElementById('cardNav');
    var hamburger = document.getElementById('hamburgerBtn');
    var overlay = document.getElementById('overlay');
    var isOpen = false;

    function calculateExpandedHeight() {
        var content = cardNav.querySelector('.card-nav-content');
        // Temporarily make content visible to measure
        content.style.opacity = '1';
        content.style.pointerEvents = 'all';
        content.style.position = 'relative';
        content.style.top = 'auto';

        var contentHeight = content.offsetHeight;

        // Reset temporary styles
        content.style.opacity = '';
        content.style.pointerEvents = '';
        content.style.position = '';
        content.style.top = '';

        return 68 + contentHeight + 12; // top bar offset + content + bottom padding
    }

    function openNav() {
        isOpen = true;
        var expandedHeight = calculateExpandedHeight();
        cardNav.style.height = expandedHeight + 'px';
        cardNav.classList.add('card-nav--open');
        hamburger.classList.add('open');
        overlay.classList.add('overlay--active');
    }

    function closeNav() {
        isOpen = false;
        cardNav.style.height = '60px';
        cardNav.classList.remove('card-nav--open');
        hamburger.classList.remove('open');
        overlay.classList.remove('overlay--active');
    }

    function toggleNav() {
        if (isOpen) closeNav();
        else openNav();
    }

    // Expose closeMenu globally for main-v3.js smooth scroll
    window.__closeMenu = closeNav;

    hamburger.addEventListener('click', toggleNav);
    overlay.addEventListener('click', closeNav);

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) closeNav();
    });

    // Close when clicking a nav link
    var navLinks = cardNav.querySelectorAll('.nav-card-link');
    for (var k = 0; k < navLinks.length; k++) {
        navLinks[k].addEventListener('click', function() {
            closeNav();
        });
    }

    // Recalculate height on resize
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (isOpen) {
                var expandedHeight = calculateExpandedHeight();
                cardNav.style.height = expandedHeight + 'px';
            }
        }, 100);
    });

})();
