document.addEventListener('DOMContentLoaded', () => {

    // ===== FILTERS =====
    const grid = document.getElementById('productsGrid');
    const empty = document.getElementById('catalogEmpty');
    const chips = document.querySelectorAll('.catalog-filters__chip[data-filter]');
    const activeFilters = { collection: 'all' };

    function applyFilters() {
        const cards = grid.querySelectorAll('.product-card');
        let visible = 0;
        cards.forEach(card => {
            const matchColl = activeFilters.collection === 'all' || card.dataset.collection === activeFilters.collection;
            const show = matchColl;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        empty.style.display = visible === 0 ? '' : 'none';
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.dataset.filter;
            const value = chip.dataset.value;
            activeFilters[filter] = value;
            chip.closest('.catalog-filters__group').querySelectorAll('.catalog-filters__chip').forEach(c => {
                c.classList.toggle('catalog-filters__chip--active', c === chip);
            });
            applyFilters();
        });
    });

    // ===== PRODUCT POPUP =====
    const popup = document.getElementById('productPopup');
    const popupOverlay = document.getElementById('popupOverlay');
    const popupClose = document.getElementById('popupClose');
    const popupImage = document.getElementById('popupImage');
    const popupTitle = document.getElementById('popupTitle');
    const popupPrice = document.getElementById('popupPrice');
    const popupDesc = document.getElementById('popupDesc');
    const popupSpecs = document.getElementById('popupSpecs');
    const popupBadge = document.getElementById('popupBadge');
    const popupReadmore = document.getElementById('popupReadmore');
    const popupThumbs = document.getElementById('popupThumbs');

    function row(label, value) {
        if (!value) return '';
        return '<tr><td>' + label + '</td><td>' + value + '</td></tr>';
    }

    function buildGallery(card) {
        const d = card.dataset;
        const galleryStr = d.gallery || '';
        const images = galleryStr ? galleryStr.split(',') : [];
        if (images.length === 0) {
            const imgEl = card.querySelector('.product-card__img');
            const bg = imgEl ? imgEl.style.backgroundImage : '';
            popupImage.style.backgroundImage = bg;
            popupThumbs.innerHTML = '';
            return;
        }
        popupImage.style.backgroundImage = 'url(' + images[0] + ')';
        popupThumbs.innerHTML = images.map(function(src, i) {
            return '<div class="product-popup__thumb' + (i === 0 ? ' product-popup__thumb--active' : '') +
                '" style="background-image:url(' + src + ')" data-img="' + src + '"></div>';
        }).join('');
    }

    if (popupThumbs) {
        popupThumbs.addEventListener('click', function(e) {
            var thumb = e.target.closest('.product-popup__thumb');
            if (!thumb) return;
            popupImage.style.backgroundImage = 'url(' + thumb.dataset.img + ')';
            popupThumbs.querySelectorAll('.product-popup__thumb').forEach(function(t) {
                t.classList.remove('product-popup__thumb--active');
            });
            thumb.classList.add('product-popup__thumb--active');
        });
    }

    // Readmore toggle
    if (popupReadmore) {
        popupReadmore.addEventListener('click', function() {
            var expanded = popupDesc.classList.toggle('product-popup__desc--expanded');
            popupReadmore.textContent = expanded ? 'Свернуть' : 'Читать ещё';
        });
    }

    function openPopup(card) {
        const d = card.dataset;
        buildGallery(card);
        popupTitle.textContent = d.name;
        popupPrice.innerHTML = d.price + ' <span>\u20BD/\u0448\u0442</span>';
        popupDesc.textContent = d.desc;

        // Reset readmore state
        popupDesc.classList.remove('product-popup__desc--expanded');
        popupReadmore.textContent = 'Читать ещё';

        // Check if description is truncated — show readmore
        requestAnimationFrame(function() {
            if (popupDesc.scrollHeight > popupDesc.clientHeight + 2) {
                popupReadmore.classList.add('product-popup__readmore--visible');
            } else {
                popupReadmore.classList.remove('product-popup__readmore--visible');
            }
        });

        // Badge
        var hasBadge = card.querySelector('.badge--hit');
        popupBadge.classList.toggle('product-popup__badge--visible', !!hasBadge);

        // Merged specs + logistics table
        popupSpecs.innerHTML =
            row('Размер', d.size) +
            row('Коллекция', d.collectionName) +
            row('Цвет', d.color) +
            row('Толщина', d.thick) +
            row('Класс бетона', d.strength) +
            row('Морозостойкость', d.frost) +
            row('Водопоглощение', d.water) +
            row('Истираемость', d.abrasion) +
            row('Кол-во на поддоне', d.palletPcs ? d.palletPcs + ' шт' : '') +
            row('А/м 20 тонн', d.truck20);

        // Order button → Telegram
        var orderBtn = popup.querySelector('.product-popup__order-btn');
        if (orderBtn) {
            var msg = encodeURIComponent('Здравствуйте, хотел бы у вас заказать "' + d.name + '"');
            orderBtn.href = 'https://t.me/pkagstroy?text=' + msg;
            orderBtn.target = '_blank';
            orderBtn.rel = 'noopener';
        }

        popup.classList.add('product-popup--active');
        document.body.style.overflow = 'hidden';
    }

    function closePopupFn() {
        popup.classList.remove('product-popup--active');
        document.body.style.overflow = '';
    }

    // Click on entire card
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (card) {
            e.preventDefault();
            openPopup(card);
        }
    });

    popupOverlay.addEventListener('click', closePopupFn);
    popupClose.addEventListener('click', closePopupFn);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('product-popup--active')) closePopupFn();
    });

});
