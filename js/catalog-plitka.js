document.addEventListener('DOMContentLoaded', () => {

    // ===== FILTERS =====
    const grid = document.getElementById('productsGrid');
    const empty = document.getElementById('catalogEmpty');
    const chips = document.querySelectorAll('.catalog-filters__chip[data-filter]');
    const activeFilters = { forma: 'all', collection: 'all', thickness: 'all' };

    function applyFilters() {
        const cards = grid.querySelectorAll('.product-card');
        let visible = 0;
        cards.forEach(card => {
            const matchForma = activeFilters.forma === 'all' || card.dataset.forma === activeFilters.forma;
            const matchColl = activeFilters.collection === 'all' || card.dataset.collection === activeFilters.collection;
            const matchThick = activeFilters.thickness === 'all' || card.dataset.thickness === activeFilters.thickness;
            const show = matchForma && matchColl && matchThick;
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
            // Update active states within the same group
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
    const popupLogistics = document.getElementById('popupLogistics');

    const popupSizes = document.getElementById('popupSizes');

    function row(label, value) {
        if (!value) return '';
        return '<tr><td>' + label + '</td><td>' + value + '</td></tr>';
    }

    /**
     * Parse size string like "80×160, 160×160, 260×160 мм" or "600×200×80 мм"
     * into array of {w, h, label} objects.
     */
    function parseSizes(sizeStr) {
        if (!sizeStr) return [];
        // Remove trailing " мм" or "мм"
        var clean = sizeStr.replace(/\s*мм\s*/g, '').trim();
        // Split by comma
        var parts = clean.split(',').map(function(s) { return s.trim(); });
        var sizes = [];
        parts.forEach(function(part) {
            // Split by × or x (case insensitive)
            var dims = part.split(/[×xXхХ]/);
            if (dims.length >= 2) {
                var w = parseInt(dims[0]);
                var h = parseInt(dims[1]);
                if (!isNaN(w) && !isNaN(h)) {
                    sizes.push({ w: w, h: h, label: w + '×' + h });
                }
            }
        });
        return sizes;
    }

    function buildSizeBlocks(sizeStr, thickness) {
        var sizes = parseSizes(sizeStr);
        if (sizes.length === 0) return '';

        // Find the max dimension to scale proportionally
        var maxDim = 0;
        sizes.forEach(function(s) {
            if (s.w > maxDim) maxDim = s.w;
            if (s.h > maxDim) maxDim = s.h;
        });

        // Scale factor: largest dimension maps to 80px
        var scale = 80 / maxDim;

        var html = '<div class="popup-sizes__label">Форматы плитки</div>';
        html += '<div class="popup-sizes__row">';
        sizes.forEach(function(s) {
            var bw = Math.round(s.w * scale);
            var bh = Math.round(s.h * scale);
            // Minimum visible size
            if (bw < 20) bw = 20;
            if (bh < 20) bh = 20;
            html += '<div class="popup-sizes__item">' +
                '<div class="popup-sizes__block" style="width:' + bw + 'px;height:' + bh + 'px"></div>' +
                '<span class="popup-sizes__dim">' + s.label + '</span>' +
                '</div>';
        });
        html += '</div>';
        if (thickness) {
            html += '<div class="popup-sizes__thickness">Толщина: ' + thickness + '</div>';
        }
        return html;
    }

    function openPopup(card) {
        const d = card.dataset;
        const imgEl = card.querySelector('.product-card__img');
        const bgImg = imgEl ? imgEl.style.backgroundImage : '';

        popupImage.style.backgroundImage = bgImg;
        popupTitle.textContent = d.name;
        popupPrice.innerHTML = d.price + ' <span>\u20BD/\u043C\u00B2</span>';
        popupDesc.textContent = d.desc;

        // Build size visualization blocks
        popupSizes.innerHTML = buildSizeBlocks(d.size, d.thick);

        popupSpecs.innerHTML =
            row('Размер', d.size) +
            row('Форма', d.formaName) +
            row('Коллекция', d.collectionName) +
            row('Цвет', d.color) +
            row('Толщина', d.thick) +
            row('Вес/1 м\u00B2', d.weight) +
            row('ГОСТ', d.gost) +
            row('Класс бетона', d.strength) +
            row('Морозостойкость', d.frost) +
            row('Водопоглощение', d.water) +
            row('Истираемость', d.abrasion) +
            row('Окрашивание', d.paint) +
            row('Технология', d.tech);

        popupLogistics.innerHTML =
            row('Поддон, м\u00B2', d.palletM2) +
            row('Кол-во на поддоне', d.palletPcs ? d.palletPcs + ' шт' : '') +
            row('Вес поддона', d.palletWeight) +
            row('Штук в 1 м\u00B2', d.pcsM2) +
            row('А/м 20 тонн, м\u00B2', d.truck20) +
            row('А/м 20 тонн, поддоны', d.truck20Pallets) +
            row('А/м 40 тонн, м\u00B2', d.truck40);

        // Reset tabs
        popup.querySelectorAll('.product-popup__tab').forEach(t => t.classList.remove('product-popup__tab--active'));
        popup.querySelectorAll('.product-popup__tab-panel').forEach(p => p.classList.remove('product-popup__tab-panel--active'));
        popup.querySelector('[data-popup-tab="specs"]').classList.add('product-popup__tab--active');
        popup.querySelector('[data-popup-panel="specs"]').classList.add('product-popup__tab-panel--active');

        popup.classList.add('product-popup--active');
        document.body.style.overflow = 'hidden';
    }

    function closePopupFn() {
        popup.classList.remove('product-popup--active');
        document.body.style.overflow = '';
    }

    // Click on "Подробнее" buttons
    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.product-card__detail');
        if (btn) {
            e.preventDefault();
            const card = btn.closest('.product-card');
            if (card) openPopup(card);
        }
    });

    popupOverlay.addEventListener('click', closePopupFn);
    popupClose.addEventListener('click', closePopupFn);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('product-popup--active')) closePopupFn();
    });

    // Popup tabs
    popup.querySelectorAll('.product-popup__tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.popupTab;
            popup.querySelectorAll('.product-popup__tab').forEach(t => t.classList.remove('product-popup__tab--active'));
            popup.querySelectorAll('.product-popup__tab-panel').forEach(p => p.classList.remove('product-popup__tab-panel--active'));
            tab.classList.add('product-popup__tab--active');
            popup.querySelector('[data-popup-panel="' + target + '"]').classList.add('product-popup__tab-panel--active');
        });
    });

});
