(function() {
    'use strict';

    // Prevent double initialization
    if (document.getElementById('leadModal')) return;

    // ============================================================
    // 1. CSS — inject into <head>
    // ============================================================
    var css = [
        /* Header button */
        '.header__lead-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;font-size:13px;font-weight:600;color:#fff;background:var(--orange);border:none;border-radius:var(--radius);cursor:pointer;white-space:nowrap;transition:all .25s ease;letter-spacing:.3px}',
        '.header__lead-btn:hover{background:var(--orange-hover);transform:translateY(-1px);box-shadow:0 4px 16px rgba(234,118,39,.3)}',
        '.header__lead-btn svg{flex-shrink:0}',

        /* Modal base */
        '.lead-modal{position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease}',
        '.lead-modal--active{opacity:1;visibility:visible}',
        '.lead-modal__overlay{position:absolute;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(4px)}',
        '.lead-modal__container{position:relative;width:90%;max-width:440px;background:#fff;border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,.25);padding:36px 32px;z-index:1;transform:translateY(30px) scale(.97);transition:transform .35s cubic-bezier(.16,1,.3,1);max-height:90vh;overflow-y:auto;overscroll-behavior:contain}',
        '.lead-modal--active .lead-modal__container{transform:translateY(0) scale(1)}',

        /* Close button */
        '.lead-modal__close{position:absolute;top:12px;right:12px;width:36px;height:36px;font-size:22px;line-height:36px;text-align:center;color:var(--text-secondary);background:var(--bg-gray);border:none;border-radius:50%;cursor:pointer;transition:all .25s ease;z-index:2}',
        '.lead-modal__close:hover{background:var(--dark);color:#fff}',

        /* Header */
        '.lead-modal__header{margin-bottom:24px;text-align:center}',
        '.lead-modal__title{font-size:22px;font-weight:700;color:var(--dark);margin-bottom:8px}',
        '.lead-modal__subtitle{font-size:14px;color:var(--text-secondary);line-height:1.5}',

        /* Form fields */
        '.lead-modal__field{margin-bottom:16px}',
        '.lead-modal__label{display:block;font-size:13px;font-weight:600;color:var(--dark);margin-bottom:6px}',
        '.lead-modal__input{width:100%;padding:14px 16px;font-size:14px;font-family:inherit;border:1px solid var(--border);border-radius:var(--radius);background:#fff;outline:none;transition:border-color .25s ease,box-shadow .25s ease;box-sizing:border-box}',
        '.lead-modal__input::placeholder{color:var(--text-muted)}',
        '.lead-modal__input:focus{border-color:var(--orange);box-shadow:0 0 0 3px rgba(234,118,39,.12)}',
        '.lead-modal__input--error{border-color:#E53935;box-shadow:0 0 0 3px rgba(229,57,53,.12)}',
        '.lead-modal__error{display:block;font-size:12px;color:#E53935;margin-top:4px;min-height:0}',

        /* Checkbox */
        '.lead-modal__check{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--text-secondary);cursor:pointer;line-height:1.5;margin-bottom:20px}',
        '.lead-modal__check input{width:16px;height:16px;margin-top:2px;accent-color:var(--orange);flex-shrink:0;cursor:pointer}',
        '.lead-modal__check a{color:var(--orange);text-decoration:underline}',
        '.lead-modal__check a:hover{text-decoration:none}',

        /* Submit */
        '.lead-modal__submit{width:100%;padding:14px 36px;font-size:15px;font-weight:600;color:#fff;background:var(--orange);border:none;border-radius:var(--radius);cursor:pointer;transition:all .25s ease}',
        '.lead-modal__submit:hover{background:var(--orange-hover);box-shadow:0 4px 16px rgba(234,118,39,.3)}',
        '.lead-modal__submit:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}',

        /* Success */
        '.lead-modal__success{text-align:center;padding:20px 0}',
        '.lead-modal__success-icon{margin-bottom:16px}',
        '.lead-modal__success-title{font-size:20px;font-weight:700;color:var(--dark);margin-bottom:8px}',
        '.lead-modal__success-text{font-size:14px;color:var(--text-secondary)}',

        /* Mobile menu button */
        '.mobile-menu__lead-btn{display:block;margin:16px 20px;padding:14px 20px;text-align:center;font-size:15px;font-weight:600;color:#fff;background:var(--orange);border-radius:var(--radius);transition:background .25s ease;text-decoration:none}',
        '.mobile-menu__lead-btn:hover{background:var(--orange-hover);color:#fff}',

        /* Responsive */
        '@media(max-width:768px){.header__lead-btn span{display:none}.header__lead-btn{padding:8px;width:36px;height:36px;justify-content:center}.lead-modal__container{width:95%;padding:28px 20px}.lead-modal__title{font-size:20px}}',
        '@media(max-width:480px){.lead-modal__container{padding:24px 16px}}'
    ].join('\n');

    var styleEl = document.createElement('style');
    styleEl.id = 'lead-form-styles';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // ============================================================
    // 2. MODAL HTML — inject into <body>
    // ============================================================
    var modalHTML = '<div class="lead-modal" id="leadModal">' +
        '<div class="lead-modal__overlay"></div>' +
        '<div class="lead-modal__container">' +
            '<button class="lead-modal__close" type="button" aria-label="Закрыть">&times;</button>' +
            '<div class="lead-modal__header">' +
                '<h2 class="lead-modal__title">Оставить заявку</h2>' +
                '<p class="lead-modal__subtitle">Укажите контактные данные, и мы свяжемся с вами</p>' +
            '</div>' +
            '<form class="lead-modal__form" id="leadForm" novalidate>' +
                '<div class="lead-modal__field">' +
                    '<label class="lead-modal__label" for="leadName">Имя *</label>' +
                    '<input class="lead-modal__input" type="text" id="leadName" name="name" placeholder="Ваше имя" required autocomplete="name">' +
                    '<span class="lead-modal__error" id="leadNameError"></span>' +
                '</div>' +
                '<div class="lead-modal__field">' +
                    '<label class="lead-modal__label" for="leadPhone">Телефон *</label>' +
                    '<input class="lead-modal__input" type="tel" id="leadPhone" name="phone" placeholder="+7 (___) ___-__-__" required autocomplete="tel">' +
                    '<span class="lead-modal__error" id="leadPhoneError"></span>' +
                '</div>' +
                '<div class="lead-modal__field">' +
                    '<label class="lead-modal__label" for="leadEmail">Email</label>' +
                    '<input class="lead-modal__input" type="email" id="leadEmail" name="email" placeholder="example@mail.ru" autocomplete="email">' +
                    '<span class="lead-modal__error" id="leadEmailError"></span>' +
                '</div>' +
                '<div class="lead-modal__field">' +
                    '<label class="lead-modal__label" for="leadTelegram">Telegram</label>' +
                    '<input class="lead-modal__input" type="text" id="leadTelegram" name="telegram" placeholder="@username или номер телефона" autocomplete="off">' +
                '</div>' +
                '<label class="lead-modal__check">' +
                    '<input type="checkbox" id="leadPrivacy" required>' +
                    '<span>Согласен с <a href="#" target="_blank">Политикой конфиденциальности</a></span>' +
                '</label>' +
                '<button class="lead-modal__submit" type="submit">Отправить заявку</button>' +
            '</form>' +
            '<div class="lead-modal__success" id="leadSuccess" style="display:none">' +
                '<div class="lead-modal__success-icon">' +
                    '<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#4CAF50" stroke-width="3"/><path d="M14 24l7 7 13-13" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                '</div>' +
                '<h3 class="lead-modal__success-title">Заявка отправлена!</h3>' +
                '<p class="lead-modal__success-text">Мы свяжемся с вами в ближайшее время</p>' +
            '</div>' +
        '</div>' +
    '</div>';

    var wrapper = document.createElement('div');
    wrapper.innerHTML = modalHTML;
    document.body.appendChild(wrapper.firstElementChild);

    // ============================================================
    // 3. HEADER BUTTON — inject into .header__actions
    // ============================================================
    var headerActions = document.querySelector('.header__actions');
    if (headerActions) {
        var triggerBtn = document.createElement('button');
        triggerBtn.className = 'header__lead-btn';
        triggerBtn.id = 'leadFormTrigger';
        triggerBtn.type = 'button';
        triggerBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.667 2.667h10.666c.734 0 1.334.6 1.334 1.333v8c0 .733-.6 1.333-1.334 1.333H2.667C1.933 13.333 1.333 12.733 1.333 12V4c0-.733.6-1.333 1.334-1.333z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.667 4L8 8.667 1.333 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Оставить заявку</span>';
        headerActions.insertBefore(triggerBtn, headerActions.firstChild);
    }

    // ============================================================
    // 4. MOBILE MENU BUTTON — inject after .mobile-menu__nav
    // ============================================================
    var mobileNav = document.querySelector('.mobile-menu__nav');
    if (mobileNav) {
        var mobileBtn = document.createElement('a');
        mobileBtn.href = '#';
        mobileBtn.className = 'mobile-menu__lead-btn';
        mobileBtn.textContent = 'Оставить заявку';
        mobileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Close mobile menu first
            var mobileMenu = document.getElementById('mobileMenu');
            var overlay = document.getElementById('overlay');
            if (mobileMenu) mobileMenu.classList.remove('mobile-menu--active');
            if (overlay) overlay.classList.remove('overlay--active');
            document.body.style.overflow = '';
            openModal();
        });
        mobileNav.parentElement.insertBefore(mobileBtn, mobileNav.nextSibling);
    }

    // ============================================================
    // 5. REFERENCES
    // ============================================================
    var modal = document.getElementById('leadModal');
    var modalOverlay = modal.querySelector('.lead-modal__overlay');
    var modalClose = modal.querySelector('.lead-modal__close');
    var form = document.getElementById('leadForm');
    var nameInput = document.getElementById('leadName');
    var phoneInput = document.getElementById('leadPhone');
    var emailInput = document.getElementById('leadEmail');
    var privacyCheck = document.getElementById('leadPrivacy');
    var nameError = document.getElementById('leadNameError');
    var phoneError = document.getElementById('leadPhoneError');
    var emailError = document.getElementById('leadEmailError');
    var successDiv = document.getElementById('leadSuccess');
    var trigger = document.getElementById('leadFormTrigger');

    // ============================================================
    // 6. OPEN / CLOSE
    // ============================================================
    function openModal() {
        modal.classList.add('lead-modal--active');
        document.body.style.overflow = 'hidden';
        form.style.display = '';
        successDiv.style.display = 'none';
        form.reset();
        clearErrors();
    }

    function closeModal() {
        modal.classList.remove('lead-modal--active');
        document.body.style.overflow = '';
    }

    if (trigger) trigger.addEventListener('click', openModal);
    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('lead-modal--active')) {
            closeModal();
        }
    });

    // ============================================================
    // 7. PHONE MASK (+7 (XXX) XXX-XX-XX)
    // ============================================================
    phoneInput.addEventListener('input', function(e) {
        var value = e.target.value.replace(/\D/g, '');
        if (value.length > 0 && (value[0] === '8' || value[0] === '7')) {
            value = '7' + value.substring(1);
        } else if (value.length > 0 && value[0] !== '7') {
            value = '7' + value;
        }
        if (value.length > 11) value = value.substring(0, 11);

        var formatted = '';
        if (value.length > 0) formatted = '+' + value[0];
        if (value.length > 1) formatted += ' (' + value.substring(1, 4);
        if (value.length >= 4) formatted += ')';
        if (value.length > 4) formatted += ' ' + value.substring(4, 7);
        if (value.length > 7) formatted += '-' + value.substring(7, 9);
        if (value.length > 9) formatted += '-' + value.substring(9, 11);
        e.target.value = formatted;
    });

    phoneInput.addEventListener('focus', function() {
        if (!phoneInput.value) phoneInput.value = '+7 (';
    });

    phoneInput.addEventListener('blur', function() {
        if (phoneInput.value === '+7 (' || phoneInput.value === '+7') phoneInput.value = '';
    });

    // ============================================================
    // 8. VALIDATION
    // ============================================================
    function clearErrors() {
        [nameInput, phoneInput, emailInput].forEach(function(el) {
            el.classList.remove('lead-modal__input--error');
        });
        nameError.textContent = '';
        phoneError.textContent = '';
        emailError.textContent = '';
    }

    function validateForm() {
        clearErrors();
        var valid = true;

        // Name: required, min 2 chars
        if (nameInput.value.trim().length < 2) {
            nameInput.classList.add('lead-modal__input--error');
            nameError.textContent = 'Введите ваше имя';
            valid = false;
        }

        // Phone: must have 11 digits
        var phoneDigits = phoneInput.value.replace(/\D/g, '');
        if (phoneDigits.length < 11) {
            phoneInput.classList.add('lead-modal__input--error');
            phoneError.textContent = 'Введите корректный номер телефона';
            valid = false;
        }

        // Email: optional, but validate format if filled
        var emailVal = emailInput.value.trim();
        if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            emailInput.classList.add('lead-modal__input--error');
            emailError.textContent = 'Введите корректный email';
            valid = false;
        }

        // Privacy must be checked
        if (!privacyCheck.checked) {
            var checkLabel = privacyCheck.closest('.lead-modal__check');
            checkLabel.style.color = '#E53935';
            setTimeout(function() { checkLabel.style.color = ''; }, 2000);
            valid = false;
        }

        return valid;
    }

    // Clear field error on input
    [nameInput, phoneInput, emailInput].forEach(function(input) {
        input.addEventListener('input', function() {
            input.classList.remove('lead-modal__input--error');
            var errorEl = document.getElementById(input.id + 'Error');
            if (errorEl) errorEl.textContent = '';
        });
    });

    // ============================================================
    // 9. FORM SUBMISSION
    // ============================================================
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validateForm()) return;

        var submitBtn = form.querySelector('.lead-modal__submit');
        var origText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        // Simulate sending (replace with fetch() for backend integration)
        setTimeout(function() {
            console.log('[Lead Form]', {
                name: nameInput.value,
                phone: phoneInput.value,
                email: emailInput.value,
                telegram: document.getElementById('leadTelegram').value
            });

            form.style.display = 'none';
            successDiv.style.display = '';

            submitBtn.textContent = origText;
            submitBtn.disabled = false;

            setTimeout(closeModal, 3000);
        }, 800);
    });

    // ============================================================
    // 10. UNIVERSAL TRIGGER: data-lead-form="open"
    // ============================================================
    document.addEventListener('click', function(e) {
        var el = e.target.closest('[data-lead-form="open"]');
        if (el) {
            e.preventDefault();
            openModal();
        }
    });

})();
