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
    const TG_TOKEN = '8634364282:AAE0kG_4-IaB666vYpsIXeiX-PhNCfzft0k';
    const TG_CHAT  = '7334974261';

    function sendToTelegram(text) {
        return fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TG_CHAT, text: text, parse_mode: 'HTML' })
        });
    }

    // ===== PHONE MASK (+7 (XXX) XXX-XX-XX) =====
    const cbPhoneInput = document.getElementById('cbPhone');
    if (cbPhoneInput) {
        cbPhoneInput.addEventListener('input', function() {
            let digits = this.value.replace(/\D/g, '');
            if (digits.startsWith('8')) digits = '7' + digits.slice(1);
            if (digits.startsWith('7')) digits = digits.slice(1);
            digits = digits.slice(0, 10);
            let result = '+7';
            if (digits.length > 0) result += ' (' + digits.slice(0, 3);
            if (digits.length >= 3) result += ') ' + digits.slice(3, 6);
            if (digits.length >= 6) result += '-' + digits.slice(6, 8);
            if (digits.length >= 8) result += '-' + digits.slice(8, 10);
            this.value = result;
        });
        cbPhoneInput.addEventListener('focus', function() {
            if (!this.value) this.value = '+7 (';
        });
        cbPhoneInput.addEventListener('blur', function() {
            if (this.value === '+7 (' || this.value === '+7') this.value = '';
        });
    }

    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        callbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = callbackForm.querySelector('[type="submit"]');
            const orig = btn.textContent;

            const phoneVal = (document.getElementById('cbPhone').value || '');
            if (phoneVal.replace(/\D/g, '').length < 11) {
                document.getElementById('cbPhone').style.borderColor = '#E53935';
                document.getElementById('cbPhone').focus();
                return;
            }
            document.getElementById('cbPhone').style.borderColor = '';

            btn.textContent = 'Отправка...';
            btn.disabled = true;

            const name    = (document.getElementById('cbName').value || '').trim();
            const phone   = phoneVal.trim();
            const comment = (document.getElementById('cbComment').value || '').trim();
            const wa      = document.getElementById('cbWhatsapp').checked;

            const text = '📋 <b>Новая заявка — АГ СТРОЙ</b>\n\n'
                + '👤 Имя: ' + (name || '—') + '\n'
                + '📞 Телефон: ' + (phone || '—') + '\n'
                + (comment ? '💬 Комментарий: ' + comment + '\n' : '')
                + '📱 WhatsApp: ' + (wa ? 'Да' : 'Нет');

            sendToTelegram(text).finally(() => {
                btn.textContent = 'Отправлено ✓';
                btn.style.background = '#4CAF50';
                setTimeout(() => {
                    btn.textContent = orig;
                    btn.style.background = '';
                    btn.disabled = false;
                    callbackForm.reset();
                }, 3000);
            });
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
                coords: [55.800301, 37.309082],
                schedule: ''
            },
            {
                id: 'production',
                name: 'Производство',
                address: 'Московская обл., Волоколамский м.о., д. Золево, Сельский пер., 6с1',
                coords: [56.059494, 36.217548],
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
                coords: [55.537607, 37.781326],
                schedule: '8:00–20:00'
            },
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

        // Load Yandex Maps API 2.1 dynamically
        function loadYandexMapsAPI() {
            return new Promise(function(resolve, reject) {
                if (window.ymaps) {
                    resolve();
                    return;
                }
                var script = document.createElement('script');
                script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
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

        // Initialize map (Yandex Maps JS API 2.1)
        function initContactsMap() {
            if (mapLoaded) return;
            mapLoaded = true;

            loadYandexMapsAPI().then(function() {
                ymaps.ready(function() {
                    var placeholder = contactsYMap.querySelector('.contacts-map__map-placeholder');
                    if (placeholder) placeholder.remove();

                    var lats = LOCATIONS.map(function(l) { return l.coords[0]; });
                    var lngs = LOCATIONS.map(function(l) { return l.coords[1]; });
                    var centerLat = (Math.min.apply(null, lats) + Math.max.apply(null, lats)) / 2;
                    var centerLng = (Math.min.apply(null, lngs) + Math.max.apply(null, lngs)) / 2;

                    ymapInstance = new ymaps.Map(contactsYMap, {
                        center: [centerLat, centerLng],
                        zoom: 8,
                        controls: ['zoomControl']
                    }, { suppressMapOpenBlock: true });

                    var MarkerLayout = createMarkerLayout(ymaps);

                    LOCATIONS.forEach(function(loc, index) {
                        var placemark = new ymaps.Placemark(loc.coords, { name: loc.name }, {
                            iconLayout: MarkerLayout,
                            iconShape: { type: 'Rectangle', coordinates: [[-20, -50], [20, 0]] }
                        });

                        placemark.events.add('click', function() { selectLocation(loc.id); });
                        ymapInstance.geoObjects.add(placemark);
                        placemarks[loc.id] = { placemark: placemark, overlayEl: null };

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

    // ===== SCROLL TO SECTION FROM sessionStorage (cross-page navigation) =====
    const scrollTarget = sessionStorage.getItem('scrollTo');
    if (scrollTarget) {
        sessionStorage.removeItem('scrollTo');
        setTimeout(() => {
            const target = document.getElementById(scrollTarget);
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        }, 300);
    }

    // ===== SMOOTH SCROLL (with header offset) =====
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
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
