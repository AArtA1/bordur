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
    const popupLogistics = document.getElementById('popupLogistics');
    const popupSizes = document.getElementById('popupSizes');

    function row(label, value) {
        if (!value) return '';
        return '<tr><td>' + label + '</td><td>' + value + '</td></tr>';
    }

    /**
     * Parse size string like "1000×200×80 мм"
     * into {w, h, thickness} for visualization.
     */
    function buildSizeBlock(sizeStr, thickness) {
        if (!sizeStr) return '';
        var clean = sizeStr.replace(/\s*мм\s*/g, '').trim();
        var dims = clean.split(/[×xXхХ]/);
        if (dims.length < 2) return '';

        var w = parseInt(dims[0]);
        var h = parseInt(dims[1]);
        if (isNaN(w) || isNaN(h)) return '';

        // Scale: max dimension -> 100px
        var maxDim = Math.max(w, h);
        var scale = 100 / maxDim;
        var bw = Math.round(w * scale);
        var bh = Math.round(h * scale);
        if (bw < 16) bw = 16;
        if (bh < 16) bh = 16;

        var html = '<div class="popup-sizes__label">Размер бордюра</div>';
        html += '<div class="popup-sizes__row">';
        html += '<div class="popup-sizes__item">' +
            '<div class="popup-sizes__block" style="width:' + bw + 'px;height:' + bh + 'px"></div>' +
            '<span class="popup-sizes__dim">' + w + '×' + h + '</span>' +
            '</div>';
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
        popupPrice.innerHTML = d.price + ' <span>\u20BD/\u0448\u0442</span>';
        popupDesc.textContent = d.desc;

        // Build size visualization
        popupSizes.innerHTML = buildSizeBlock(d.size, d.thick);

        popupSpecs.innerHTML =
            row('Размер', d.size) +
            row('Форма', d.formaName) +
            row('Коллекция', d.collectionName) +
            row('Цвет', d.color) +
            row('Класс бетона', d.strength) +
            row('Морозостойкость', d.frost) +
            row('Водопоглощение', d.water) +
            row('Истираемость', d.abrasion);

        popupLogistics.innerHTML =
            row('Кол-во на поддоне', d.palletPcs ? d.palletPcs + ' шт' : '') +
            row('Вес поддона', d.palletWeight) +
            row('А/м 20 тонн, шт', d.truck20) +
            row('А/м 20 тонн, поддоны', d.truck20Pallets);

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
