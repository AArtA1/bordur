document.addEventListener('DOMContentLoaded', () => {

    // ===== FILTERS =====
    const grid = document.getElementById('productsGrid');
    const empty = document.getElementById('catalogEmpty');
    const chips = document.querySelectorAll('.catalog-filters__chip[data-filter]');
    const activeFilters = { type: 'all' };

    function applyFilters() {
        const cards = grid.querySelectorAll('.product-card');
        let visible = 0;
        cards.forEach(card => {
            const matchType = activeFilters.type === 'all' || card.dataset.type === activeFilters.type;
            card.style.display = matchType ? '' : 'none';
            if (matchType) visible++;
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
    const popupSizes = document.getElementById('popupSizes');

    function row(label, value) {
        if (!value) return '';
        return '<tr><td>' + label + '</td><td>' + value + '</td></tr>';
    }

    /**
     * Build visual profile of compensator cross-section.
     * Uses h1/h2 (heights) and w1/w2 (widths) to draw a proportional
     * trapezoid/rectangle with a cut corner.
     */
    function buildProfileBlock(d) {
        var h1 = parseInt(d.sizeH1);
        var h2 = parseInt(d.sizeH2);
        var w1 = parseInt(d.sizeW1);
        var w2 = parseInt(d.sizeW2);
        if (isNaN(h1) || isNaN(w1)) return '';

        // Scale: max dimension -> 100px
        var maxDim = Math.max(h1, h2 || h1, w1, w2 || w1);
        var scale = 100 / maxDim;

        var sh1 = Math.round(h1 * scale);
        var sh2 = Math.round((h2 || h1) * scale);
        var sw1 = Math.round(w1 * scale);
        var sw2 = Math.round((w2 || w1) * scale);

        // Draw using SVG for proper shape
        var svgW = sw1 + 20;
        var svgH = sh1 + 20;
        var offsetX = 10;
        var offsetY = 10;

        // Shape: bottom-left, bottom-right, top-right, top-left (with possible cut corner)
        var cutX = sw1 - sw2; // difference in widths
        var cutY = sh1 - sh2; // difference in heights

        var points;
        if (cutX > 2 && cutY > 2) {
            // Cut corner at top-left
            points = offsetX + ',' + (offsetY + sh1) + ' ' +
                     (offsetX + sw1) + ',' + (offsetY + sh1) + ' ' +
                     (offsetX + sw1) + ',' + offsetY + ' ' +
                     (offsetX + cutX) + ',' + offsetY + ' ' +
                     offsetX + ',' + (offsetY + cutY);
        } else {
            // Simple rectangle
            points = offsetX + ',' + (offsetY + sh1) + ' ' +
                     (offsetX + sw1) + ',' + (offsetY + sh1) + ' ' +
                     (offsetX + sw1) + ',' + offsetY + ' ' +
                     offsetX + ',' + offsetY;
        }

        var html = '<div class="popup-sizes__label">Профиль сечения</div>';
        html += '<div class="popup-sizes__row" style="align-items:center">';
        html += '<div class="popup-sizes__item">';
        html += '<svg width="' + svgW + '" height="' + svgH + '" viewBox="0 0 ' + svgW + ' ' + svgH + '">';
        html += '<polygon points="' + points + '" fill="rgba(234,118,39,0.15)" stroke="#EA7627" stroke-width="2"/>';
        html += '</svg>';
        html += '</div>';

        // Dimension labels
        html += '<div style="font-size:12px;color:#333;line-height:1.8">';
        html += '<div><strong>H:</strong> ' + h2 + '/' + h1 + ' мм</div>';
        html += '<div><strong>W:</strong> ' + (w2 || w1) + '/' + w1 + ' мм</div>';
        if (d.thick) html += '<div><strong>Толщина:</strong> ' + d.thick + '</div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function openPopup(card) {
        const d = card.dataset;
        const imgEl = card.querySelector('.product-card__img');
        const bgImg = imgEl ? imgEl.style.backgroundImage : '';

        popupImage.style.backgroundImage = bgImg;
        popupTitle.textContent = d.name;
        popupPrice.innerHTML = d.price;
        popupDesc.textContent = d.desc;

        // Build profile visualization
        popupSizes.innerHTML = buildProfileBlock(d);

        popupSpecs.innerHTML =
            row('Высота', d.sizeH2 + '/' + d.sizeH1 + ' мм') +
            row('Ширина', d.sizeW2 + '/' + d.sizeW1 + ' мм') +
            row('Толщина', d.thick) +
            row('Материал', d.material) +
            row('Назначение', d.purpose) +
            row('Срок изготовления', d.production) +
            row('Сертификация', d.cert);

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

});
