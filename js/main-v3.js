document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('header');
    const hero = document.getElementById('hero');

    // ===== HEADER SCROLL =====
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }, { passive: true });

    // closeMenu is provided by header.js via window.__closeMenu
    var closeMenu = window.__closeMenu || function() {};

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

    // ===== CONTACTS MAP (Yandex Maps 2.1, lazy-loaded) =====
    const contactsMapSection = document.getElementById('contacts');
    const contactsYMap = document.getElementById('contactsYMap');

    if (contactsMapSection && contactsYMap) {
        // Locations data — координаты [широта, долгота] для Yandex Maps 2.1
        const LOCATIONS = [
            {
                id: 'showroom',
                name: 'Шоу-Рум',
                address: 'Московская обл., г.о. Красногорск, д. Гольево, ул. Центральная, 51',
                coords: [55.8000, 37.3117],
                schedule: ''
            },
            {
                id: 'production',
                name: 'Производство',
                address: 'Московская обл., Волоколамский м.о., д. Золево, Сельский пер., 6с1',
                coords: [56.0400, 36.3500],
                schedule: ''
            },
            {
                id: 'warehouse-1',
                name: 'Склад',
                address: 'Московская обл., Волоколамский м.о., д. Золево, Сельский пер., 6с1',
                coords: [56.0410, 36.3520],
                schedule: ''
            },
            {
                id: 'warehouse-2',
                name: 'Склад',
                address: 'Московская обл., г.о. Красногорск, п. Архангельское, 2Бс2',
                coords: [55.7946, 37.2864],
                schedule: ''
            },
            {
                id: 'masterstroi',
                name: 'Мастерстрой',
                address: 'Одинцовский р-н, с. Ершово, ул. Лермонтова, 10с5',
                coords: [55.7240, 36.8480],
                schedule: '8:00–20:00'
            },
            {
                id: 'ag-stroi',
                name: 'ПК АГ Строй',
                address: 'Московская обл., Ленинский г.о., п. Петровское, 53/1',
                coords: [55.5450, 37.7200],
                schedule: '8:00–20:00'
            },
            {
                id: 'betkon',
                name: 'ООО БЕТКОН',
                address: 'г. Москва, ул. Василия Петушкова, д. 8',
                coords: [55.8530, 37.4430],
                schedule: '8:00–20:00'
            },
            {
                id: 'stroidizain',
                name: 'СтройДизайн',
                address: 'Московская обл., г.о. Клин, тер. Производственный центр, 37',
                coords: [56.3320, 36.7130],
                schedule: '8:00–20:00'
            },
            {
                id: 'art-stroi',
                name: 'ООО Арт-Строй1',
                address: 'Московская обл., Одинцовский г.о., пгт ВНИИССОК, Липовая ул., 2',
                coords: [55.6560, 37.2040],
                schedule: '8:00–20:00'
            },
            {
                id: 'mosplit',
                name: 'МосПлит',
                address: 'Московская обл., г.о. Щёлково, д. Долгое Лёдово, Академическая ул., 5',
                coords: [55.9450, 37.9650],
                schedule: '8:00–20:00'
            },
            {
                id: 'petrosyan',
                name: 'ИП Петросян О.Г.',
                address: 'Московская обл., м.о. Чехов, д. Бавыкино, 71',
                coords: [55.1380, 37.4680],
                schedule: '9:00–21:00, без выходных'
            },
            {
                id: 'vlad-stroi',
                name: 'ООО Влад строй',
                address: 'Московская обл., Богородский г.о., пгт им. Воровского, Привокзальная ул., 1',
                coords: [55.8520, 38.5700],
                schedule: '8:00–20:00'
            },
            {
                id: 'vip-stroi',
                name: 'VIP-STROI',
                address: 'Московская обл., м.о. Чехов, с. Шарапово, Северная ул., 21',
                coords: [55.2000, 37.3980],
                schedule: '8:00–22:00'
            },
            {
                id: 'mikaelyan',
                name: 'ИП Микаелян',
                address: 'Тверская обл., г. Конаково, пл. Калинина, д. 3',
                coords: [56.7010, 36.7640],
                schedule: '8:00–20:00'
            },
            {
                id: 'levar',
                name: 'LEVAR',
                address: 'Московская обл., г. Можайск, Полевая ул., 98с1',
                coords: [55.5020, 36.0220],
                schedule: '8:00–20:00'
            }
        ];

        const PIN_SVG = '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>';
        const CHEVRON_SVG = '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>';

        let ymapInstance = null;
        let placemarks = {};
        let activeLocationId = null;
        let mapLoaded = false;

        // Render sidebar list (no API needed)
        function renderLocationList() {
            const listEl = document.getElementById('contactsList');
            if (!listEl) return;

            LOCATIONS.forEach(function(loc, index) {
                const btn = document.createElement('button');
                btn.className = 'contacts-map__item' + (index === 0 ? ' contacts-map__item--active' : '');
                btn.dataset.locationId = loc.id;

                let scheduleHtml = '';
                if (loc.schedule) {
                    scheduleHtml = '<span class="contacts-map__item-schedule">' + loc.schedule + '</span>';
                }

                btn.innerHTML =
                    '<div class="contacts-map__item-icon">' + PIN_SVG + '</div>' +
                    '<div class="contacts-map__item-info">' +
                        '<span class="contacts-map__item-type">' + loc.name + '</span>' +
                        '<span class="contacts-map__item-address">' + loc.address + '</span>' +
                        scheduleHtml +
                    '</div>' +
                    '<div class="contacts-map__item-arrow">' + CHEVRON_SVG + '</div>';

                btn.addEventListener('click', function() { selectLocation(loc.id); });
                listEl.appendChild(btn);
            });

            activeLocationId = LOCATIONS[0].id;
        }

        // Select location: highlight list + pan map
        function selectLocation(locId) {
            var items = document.querySelectorAll('.contacts-map__item');
            items.forEach(function(item) {
                if (item.dataset.locationId === locId) {
                    item.classList.add('contacts-map__item--active');
                    item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                } else {
                    item.classList.remove('contacts-map__item--active');
                }
            });

            // Update placemark styles
            if (placemarks[activeLocationId] && placemarks[activeLocationId].overlayEl) {
                var prevEl = placemarks[activeLocationId].overlayEl;
                prevEl.classList.remove('bordur-marker--active');
            }
            if (placemarks[locId] && placemarks[locId].overlayEl) {
                var nextEl = placemarks[locId].overlayEl;
                nextEl.classList.add('bordur-marker--active');
            }

            activeLocationId = locId;

            var loc = LOCATIONS.find(function(l) { return l.id === locId; });
            if (loc && ymapInstance) {
                ymapInstance.setCenter(loc.coords, 13, { duration: 400 });
            }
        }

        // Load Yandex Maps API dynamically
        function loadYandexMapsAPI() {
            return new Promise(function(resolve, reject) {
                if (window.ymaps) {
                    resolve();
                    return;
                }
                var script = document.createElement('script');
                script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        // Create custom placemark layout
        function createMarkerLayout(ymaps) {
            return ymaps.templateLayoutFactory.createClass(
                '<div class="bordur-marker">' +
                    '<div class="bordur-marker__pin"><div class="bordur-marker__pin-inner"></div></div>' +
                    '<span class="bordur-marker__label">{{ properties.name }}</span>' +
                '</div>'
            );
        }

        // Initialize map
        function initContactsMap() {
            if (mapLoaded) return;
            mapLoaded = true;

            loadYandexMapsAPI().then(function() {
                ymaps.ready(function() {
                    var placeholder = contactsYMap.querySelector('.contacts-map__map-placeholder');
                    if (placeholder) placeholder.remove();

                    // Calculate center from all locations
                    var lats = LOCATIONS.map(function(l) { return l.coords[0]; });
                    var lngs = LOCATIONS.map(function(l) { return l.coords[1]; });
                    var centerLat = (Math.min.apply(null, lats) + Math.max.apply(null, lats)) / 2;
                    var centerLng = (Math.min.apply(null, lngs) + Math.max.apply(null, lngs)) / 2;

                    ymapInstance = new ymaps.Map(contactsYMap, {
                        center: [centerLat, centerLng],
                        zoom: 8,
                        controls: ['zoomControl', 'geolocationControl']
                    }, {
                        suppressMapOpenBlock: true
                    });

                    var MarkerLayout = createMarkerLayout(ymaps);

                    // Add placemarks
                    LOCATIONS.forEach(function(loc, index) {
                        var placemark = new ymaps.Placemark(loc.coords, {
                            name: loc.name
                        }, {
                            iconLayout: MarkerLayout,
                            iconShape: {
                                type: 'Rectangle',
                                coordinates: [[-20, -50], [20, 0]]
                            }
                        });

                        placemark.events.add('click', function() {
                            selectLocation(loc.id);
                        });

                        ymapInstance.geoObjects.add(placemark);

                        // Store reference and get overlay element after it's added
                        placemarks[loc.id] = { placemark: placemark, overlayEl: null };

                        placemark.getOverlaySync();
                        placemark.events.add('overlaychange', function() {
                            var overlay = placemark.getOverlaySync();
                            if (overlay) {
                                overlay.events.add('mapchange', function() {
                                    var el = overlay.getLayoutSync().getElement();
                                    if (el) {
                                        placemarks[loc.id].overlayEl = el.querySelector('.bordur-marker');
                                        if (index === 0 && placemarks[loc.id].overlayEl) {
                                            placemarks[loc.id].overlayEl.classList.add('bordur-marker--active');
                                        }
                                    }
                                });
                            }
                        });
                    });

                    // Set bounds to fit all markers with padding
                    ymapInstance.setBounds(ymapInstance.geoObjects.getBounds(), {
                        checkZoomRange: true,
                        zoomMargin: 40
                    });
                });
            }).catch(function(err) {
                console.error('Yandex Maps failed to load:', err);
                var placeholder = contactsYMap.querySelector('.contacts-map__map-placeholder');
                if (placeholder) {
                    placeholder.innerHTML = '<span>Не удалось загрузить карту. <a href="https://yandex.ru/maps/" target="_blank" rel="noopener" style="color:var(--orange)">Открыть Яндекс Карты</a></span>';
                }
            });
        }

        // Render sidebar immediately
        renderLocationList();

        // Lazy-load map when section enters viewport
        var mapObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    initContactsMap();
                    mapObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '200px 0px' });

        mapObserver.observe(contactsMapSection);
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
