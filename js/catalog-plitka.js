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
    const popupSizes = document.getElementById('popupSizes');

    function row(label, value) {
        if (!value) return '';
        return '<tr><td>' + label + '</td><td>' + value + '</td></tr>';
    }

    function buildProfileBlock(d) {
        // data-size  = "500×500 мм"  → длина × ширина (плоские размеры)
        // data-thick = "70 мм"       → высота/толщина (вертикальный размер)
        var thickStr = d.thick || '';
        var sizeStr  = d.size  || '';
        var thick = parseInt(thickStr);  // высота, мм
        var nums = sizeStr.match(/\d+/g) || [];
        var len  = nums[0] ? parseInt(nums[0]) : 0; // первый размер — длина
        var wid  = nums[1] ? parseInt(nums[1]) : len; // второй размер — ширина
        if (!thick || !len) return '';

        // Fixed display: широкий прямоугольник = вид сбоку (длина × высота)
        var rw = 160, rh = 60;
        var ox = 10, oy = 24;  // oy=24 — место для подписи сверху
        var svgW = ox + rw + 70;
        var svgH = oy + rh + 44;

        var html = '<div class="popup-sizes__label">Профиль сечения (вид сбоку)</div>';
        html += '<svg width="' + svgW + '" height="' + svgH + '" viewBox="0 0 ' + svgW + ' ' + svgH + '" style="display:block;overflow:visible">';

        // Подпись оси X сверху
        html += '<text x="' + (ox + rw / 2) + '" y="14" font-size="10" fill="#888" text-anchor="middle" font-family="Open Sans,sans-serif">Длина / Ширина</text>';

        // Rectangle body (вид сбоку)
        html += '<rect x="' + ox + '" y="' + oy + '" width="' + rw + '" height="' + rh + '" fill="#ede8e3" stroke="#1a1a1a" stroke-width="2"/>';

        // Штриховка
        for (var xi = 16; xi < rw; xi += 14) {
            html += '<line x1="' + (ox+xi) + '" y1="' + oy + '" x2="' + (ox+xi) + '" y2="' + (oy+rh) + '" stroke="#b0a89a" stroke-width="0.7" opacity="0.5"/>';
        }

        // Размерная линия снизу — ДЛИНА
        var dy = oy + rh + 12;
        html += '<line x1="' + ox + '" y1="' + (oy+rh+3) + '" x2="' + ox + '" y2="' + (dy+5) + '" stroke="#888" stroke-width="1"/>';
        html += '<line x1="' + (ox+rw) + '" y1="' + (oy+rh+3) + '" x2="' + (ox+rw) + '" y2="' + (dy+5) + '" stroke="#888" stroke-width="1"/>';
        html += '<line x1="' + (ox+4) + '" y1="' + dy + '" x2="' + (ox+rw-4) + '" y2="' + dy + '" stroke="#888" stroke-width="1"/>';
        html += '<polygon points="' + ox + ',' + dy + ' ' + (ox+7) + ',' + (dy-3) + ' ' + (ox+7) + ',' + (dy+3) + '" fill="#888"/>';
        html += '<polygon points="' + (ox+rw) + ',' + dy + ' ' + (ox+rw-7) + ',' + (dy-3) + ' ' + (ox+rw-7) + ',' + (dy+3) + '" fill="#888"/>';
        html += '<text x="' + (ox+rw/2) + '" y="' + (dy+13) + '" font-size="11" fill="#333" text-anchor="middle" font-family="Open Sans,sans-serif" font-weight="700">' + len + ' × ' + wid + ' мм</text>';

        // Размерная линия справа — ВЫСОТА (толщина)
        var dx = ox + rw + 14;
        html += '<line x1="' + (ox+rw+3) + '" y1="' + oy + '" x2="' + (dx+5) + '" y2="' + oy + '" stroke="#888" stroke-width="1"/>';
        html += '<line x1="' + (ox+rw+3) + '" y1="' + (oy+rh) + '" x2="' + (dx+5) + '" y2="' + (oy+rh) + '" stroke="#888" stroke-width="1"/>';
        html += '<line x1="' + dx + '" y1="' + (oy+4) + '" x2="' + dx + '" y2="' + (oy+rh-4) + '" stroke="#888" stroke-width="1"/>';
        html += '<polygon points="' + dx + ',' + oy + ' ' + (dx-3) + ',' + (oy+7) + ' ' + (dx+3) + ',' + (oy+7) + '" fill="#888"/>';
        html += '<polygon points="' + dx + ',' + (oy+rh) + ' ' + (dx-3) + ',' + (oy+rh-7) + ' ' + (dx+3) + ',' + (oy+rh-7) + '" fill="#888"/>';
        html += '<text x="' + (dx+9) + '" y="' + (oy+rh/2-3) + '" font-size="10" fill="#888" text-anchor="start" font-family="Open Sans,sans-serif">Высота</text>';
        html += '<text x="' + (dx+9) + '" y="' + (oy+rh/2+10) + '" font-size="11" fill="#333" text-anchor="start" font-family="Open Sans,sans-serif" font-weight="700">' + thick + ' мм</text>';

        html += '</svg>';
        return html;
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
        popupPrice.innerHTML = d.price + ' <span>\u20BD/\u043C\u00B2</span>';
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

        // Profile block
        if (popupSizes) popupSizes.innerHTML = buildProfileBlock(d);

        // Merged specs + logistics table
        popupSpecs.innerHTML =
            row('Производитель', 'Gonami') +
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
            row('Технология', d.tech) +
            row('Кол-во на поддоне', d.palletPcs ? d.palletPcs + ' шт' : '') +
            row('Штук в 1 м\u00B2', d.pcsM2) +
            row('А/м 20 тонн, м\u00B2', d.truck20) +
            row('А/м 20 тонн, поддоны', d.truck20Pallets);

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
