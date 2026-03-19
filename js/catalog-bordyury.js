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

    function buildProfileBlock(d) {
        var w = parseInt(d.profileW);
        var h = parseInt(d.profileH);
        if (isNaN(w) || isNaN(h)) return '';

        var forma = d.formaName || '';

        // Scale to max 100px on longest side
        var MAXPX = 100;
        var maxDim = Math.max(w, h);
        var scale = MAXPX / maxDim;
        var sw = Math.round(w * scale);
        var sh = Math.round(h * scale);

        // Canvas: shape + bottom label (18px) + right label (38px)
        var padL = 10, padT = 10, padB = 22, padR = 42;
        var svgW = sw + padL + padR;
        var svgH = sh + padT + padB;
        var x = padL, y = padT;

        // Build points based on curb type
        var pts;
        if (forma === 'Садовый') {
            // Simple flat rectangle — garden curb laid flat
            pts = [[x, y], [x+sw, y], [x+sw, y+sh], [x, y+sh]];

        } else if (forma === 'Дорожный с фаской') {
            // Road curb with chamfer: angled top-front + chamfered top-back corner
            var slope = Math.round(sw * 0.20); // front slope width
            var cf    = Math.round(Math.min(sw, sh) * 0.14); // chamfer size
            pts = [
                [x,          y + sh],        // bottom-left  (road side)
                [x + sw,     y + sh],        // bottom-right (sidewalk)
                [x + sw,     y + cf],        // back face, chamfer start
                [x + sw - cf, y],            // chamfer corner
                [x + slope,  y],             // top surface (back)
                [x,          y + Math.round(sh * 0.10)] // front face top
            ];

        } else if (forma === 'Дорожный') {
            // Standard road curb: angled front face, flat top
            var slope2 = Math.round(sw * 0.20);
            pts = [
                [x,           y + sh],                   // bottom-left (road side)
                [x + sw,      y + sh],                   // bottom-right (sidewalk)
                [x + sw,      y],                        // top-right (back)
                [x + slope2,  y],                        // top surface, front edge
                [x,           y + Math.round(sh * 0.10)] // front face top
            ];

        } else if (forma === 'Мостовой') {
            // Bridge curb: tall, trapezoid — wider at bottom, slight lean on front face
            var lean = Math.round(sw * 0.08);
            pts = [
                [x,           y + sh],   // bottom-left
                [x + sw,      y + sh],   // bottom-right
                [x + sw,      y],        // top-right
                [x + lean,    y]         // top-left (slight taper)
            ];

        } else {
            pts = [[x, y], [x+sw, y], [x+sw, y+sh], [x, y+sh]];
        }

        var ptStr = pts.map(function(p){ return p[0]+','+p[1]; }).join(' ');

        var html = '<div style="margin:14px 0 6px">';
        html += '<div class="popup-sizes__label">Профиль сечения</div>';
        html += '<div style="display:flex;align-items:center;gap:18px;margin-top:8px">';

        // SVG
        html += '<svg width="'+svgW+'" height="'+svgH+'" viewBox="0 0 '+svgW+' '+svgH+'" style="flex-shrink:0;display:block">';
        html += '<polygon points="'+ptStr+'" fill="rgba(30,30,30,0.08)" stroke="#2a2a2a" stroke-width="1.5" stroke-linejoin="round"/>';
        // bottom dim line (width)
        var dy = y + sh + 7;
        html += '<line x1="'+x+'" y1="'+dy+'" x2="'+(x+sw)+'" y2="'+dy+'" stroke="#aaa" stroke-width="1"/>';
        html += '<text x="'+(x+sw/2)+'" y="'+(dy+9)+'" text-anchor="middle" font-size="8.5" fill="#888">'+w+' мм</text>';
        // right dim line (height)
        var dx = x + sw + 6;
        html += '<line x1="'+dx+'" y1="'+y+'" x2="'+dx+'" y2="'+(y+sh)+'" stroke="#aaa" stroke-width="1"/>';
        html += '<text x="'+(dx+4)+'" y="'+(y+sh/2+3)+'" text-anchor="start" font-size="8.5" fill="#888">'+h+' мм</text>';
        html += '</svg>';

        // Labels
        html += '<div style="font-size:12px;color:#555;line-height:2">';
        html += '<div><b style="color:#222">Ширина:</b> '+w+' мм</div>';
        html += '<div><b style="color:#222">Высота:</b> '+h+' мм</div>';
        html += '</div>';

        html += '</div></div>';
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
            row('Производитель', 'Gonami') +
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
