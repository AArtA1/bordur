# BORDUR — Документация проекта

## 1. Обзор проекта

**Бренд:** BORDUR
**Тип:** Лендинг-сайт производителя тротуарной плитки, бордюров и компенсаторов
**Стек:** Чистый HTML + CSS + JS (без фреймворков, без бэкенда, без сборщиков)
**Шрифт:** Open Sans (Google Fonts) — wght 300,400,500,600,700,800
**Референс дизайна:** braer.ru (адаптировано под 3 категории продукции)

---

## 2. Файловая структура

```
bordur/
├── index-v3.html              ← Главная страница (ГОТОВА)
├── pages/
│   ├── about.html             ← О компании
│   ├── catalog.html           ← Каталог (общий)
│   ├── catalog-plitka.html    ← Тротуарная плитка (категория)
│   ├── catalog-bordyury.html  ← Бордюры (категория)
│   ├── catalog-kompensatory.html ← Компенсаторы (категория)
│   ├── where-buy.html         ← Где купить
│   ├── buyer/
│   │   ├── certificates.html  ← Сертификаты
│   │   ├── delivery.html      ← Оплата и доставка
│   │   └── faq.html           ← Вопрос-ответ
│   └── contacts.html          ← Контакты
├── css/
│   └── style-v3.css           ← Единый CSS (ГОТОВ, расширять в нём же)
├── js/
│   └── main-v3.js             ← Единый JS (ГОТОВ, расширять в нём же)
├── img/                       ← Изображения (пока gradient-плейсхолдеры)
└── video/                     ← Видео (production.mp4)
```

**Важно:** Все страницы используют ОДИН файл CSS (`css/style-v3.css`) и ОДИН файл JS (`js/main-v3.js`). Новые стили и скрипты добавлять в конец этих файлов, группируя по секциям с комментариями.

---

## 3. Дизайн-система

### 3.1. CSS-переменные (определены в `:root`)

```css
--orange: #EA7627;           /* Основной акцентный */
--orange-hover: #d46a1e;     /* Hover-состояние оранжевого */
--dark: #1a1a1a;             /* Заголовки, тёмный текст */
--text: #333;                /* Основной текст */
--text-secondary: #666;      /* Вторичный текст */
--text-muted: #999;          /* Приглушённый текст */
--bg: #fff;                  /* Белый фон */
--bg-gray: #f5f5f5;          /* Серый фон секций */
--border: #e5e5e5;           /* Цвет границ */
--radius: 8px;               /* Скругление углов */
--shadow: 0 2px 8px rgba(0,0,0,.06);
--shadow-md: 0 4px 16px rgba(0,0,0,.1);
--shadow-lg: 0 12px 40px rgba(0,0,0,.12);
--transition: .25s ease;
--ease-out-expo: cubic-bezier(0.16,1,0.3,1);
--ease-out-quart: cubic-bezier(0.25,1,0.5,1);
--header-height: 98px;       /* desktop */
--promo-height: 38px;        /* высота промо-бара */
```

### 3.2. Типографика

| Элемент | Размер | Вес | Цвет |
|---|---|---|---|
| h1 (hero title) | 60px | 800 | --dark |
| h2 (section-title) | 32px | 700 | --dark |
| h2 (page-title, внутренние) | 40px | 800 | --dark |
| h3 (card titles) | 14–18px | 600–700 | --dark |
| body text | 16px | 400 | --text |
| secondary text | 14–15px | 400–500 | --text-secondary |
| small/caption | 12–13px | 500 | --text-muted |

### 3.3. Отступы секций

- **Desktop:** `padding: 80px 0` для основных секций
- **Tablet (≤768px):** `padding: 48px 0`
- **Контейнер:** `max-width: 1280px; padding: 0 24px` (16px на mobile)

### 3.4. Кнопки

```css
.btn                   → padding: 14px 36px, font-size: 14px, font-weight: 600, radius: 8px
.btn--primary          → bg: orange, color: #fff
.btn--primary:hover    → bg: orange-hover, translateY(-1px), shadow
.btn--outline          → border: 2px solid --dark, bg: transparent (НОВЫЙ, для внутренних страниц)
.btn--outline:hover    → bg: --dark, color: #fff
.btn--submit           → padding: 14px 48px, font-size: 15px
```

### 3.5. Бейджи

```css
.badge--hit   → bg: orange     (Хит продаж)
.badge--new   → bg: #4CAF50    (Новинка)
.badge--sale  → bg: #E53935    (-15%, акция)
```

### 3.6. Анимации при скролле

Система `data-anim` — добавлять атрибуты в HTML:

```html
<div data-anim="up">          <!-- снизу вверх -->
<div data-anim="left">         <!-- слева -->
<div data-anim="right">        <!-- справа -->
<div data-anim="scale">        <!-- масштаб 0.9 → 1 -->
<div data-anim="fade">         <!-- только opacity -->
<div data-anim="up" data-anim-delay="100">  <!-- с задержкой 100ms -->
```

JS автоматически наблюдает все `[data-anim]` элементы через `IntersectionObserver` и добавляет класс `anim--visible`.

---

## 4. Общие компоненты (присутствуют на КАЖДОЙ странице)

### 4.1. Promo Bar

```html
<div class="promo-bar" id="promoBar">
    <div class="promo-bar__slider" id="promoSlider">
        <div class="promo-bar__slide promo-bar__slide--active">Текст акции 1</div>
        <div class="promo-bar__slide">Текст акции 2</div>
        <div class="promo-bar__slide">Текст акции 3</div>
    </div>
    <button class="promo-bar__close" id="promoClose" aria-label="Закрыть">&times;</button>
</div>
```

Фиксированный оранжевый бар сверху. Слайды авторотируются каждые 4 сек. Кнопка закрытия скрывает бар и двигает header вверх.

### 4.2. Header

Двухуровневый фиксированный header:

```
header.header#header
├── header__top            → верхняя строка: nav-ссылки + телефон + регион
│   └── header__top-inner  → flex, space-between
├── header__main           → основная строка: лого + каталог-навигация + бургер
│   └── header__main-inner → flex, gap 28px, height 60px
```

**Навигация header__top-nav (одинаковая на всех страницах):**
- О компании → `/pages/about.html`
- Каталог → `/pages/catalog.html`
- Где купить → `/pages/where-buy.html`
- Покупателю → `/pages/buyer/delivery.html` (или dropdown)
- Контакты → `/pages/contacts.html`

**Навигация header__catalog-nav:**
- Тротуарная плитка → `/pages/catalog-plitka.html`
- Бордюры → `/pages/catalog-bordyury.html`
- Компенсаторы → `/pages/catalog-kompensatory.html`

На главной эти ссылки переключают hero-табы (`data-hero-tab`). На остальных — ведут на страницы каталога (обычные `<a href>`).

**Состояния:**
- `.header--scrolled` → тень при scroll > 10px
- `.header--no-promo` → top: 0 (когда промо-бар скрыт)

### 4.3. Breadcrumbs (НОВЫЙ — для внутренних страниц)

```html
<nav class="breadcrumbs" aria-label="Навигация">
    <div class="container">
        <ol class="breadcrumbs__list">
            <li><a href="/index-v3.html">Главная</a></li>
            <li><a href="/pages/catalog.html">Каталог</a></li>
            <li><span>Тротуарная плитка</span></li>
        </ol>
    </div>
</nav>
```

Стили (добавить в CSS):
```css
.breadcrumbs { padding: 16px 0; background: var(--bg); }
.breadcrumbs__list { display: flex; flex-wrap: wrap; gap: 8px; font-size: 13px; color: var(--text-muted); list-style: none; }
.breadcrumbs__list li + li::before { content: '/'; margin-right: 8px; color: var(--border); }
.breadcrumbs__list a { color: var(--text-secondary); }
.breadcrumbs__list a:hover { color: var(--orange); }
```

### 4.4. Page Hero (НОВЫЙ — для внутренних страниц)

Внутренние страницы используют упрощённый hero без табов:

```html
<section class="page-hero">
    <div class="container">
        <h1 class="page-hero__title">О компании</h1>
        <p class="page-hero__subtitle">Описание при необходимости</p>
    </div>
</section>
```

Стили:
```css
.page-hero {
    margin-top: calc(var(--header-height) + var(--promo-height));
    background: var(--bg-gray);
    padding: 60px 0 40px;
}
.page-hero--no-promo { margin-top: var(--header-height); }
.page-hero__title { font-size: 40px; font-weight: 800; color: var(--dark); line-height: 1.1; }
.page-hero__subtitle { font-size: 16px; color: var(--text-secondary); margin-top: 12px; line-height: 1.6; max-width: 600px; }
```

### 4.5. Footer

```
footer.footer
├── footer__grid  → 4 колонки: лого+соцсети | Каталог | Покупателю | О компании
├── footer__bottom → copyright + политика конфиденциальности
```

Идентичен на всех страницах. Копировать из `index-v3.html`.

### 4.6. Mobile Menu

Боковая панель справа (340px). Те же ссылки, что в header. На внутренних страницах `data-hero-tab` заменить на обычные `href` к страницам каталога.

### 4.7. Cookie Bar, Back to Top

Копировать из `index-v3.html` без изменений.

---

## 5. Спецификации страниц

---

### 5.1. Главная (`index-v3.html`) — ГОТОВА

Секции:
1. Hero с табами (3 категории, overlap-изображение)
2. Video Banner (фоновое видео + текст + плавающая фото-карточка)
3. Stats (4 счётчика с анимацией)
4. Каталог продукции (6 категорий, grid 3×2)
5. Популярные товары (6 карточек, grid 3×2)
6. Фото объектов (gallery grid 4 col)
7. Форма обратной связи
8. Footer

---

### 5.2. О компании (`pages/about.html`)

**Референс:** braer.ru/company/

**Секции (сверху вниз):**

1. **Breadcrumbs:** Главная / О компании
2. **Page Hero:** Заголовок «BORDUR — сделано в России», подзаголовок о компании
3. **Ключевые цифры:** 4 больших числа в ряд (grid 4×1):
   - «200+» видов продукции
   - «150+» точек продаж
   - «15 лет» на рынке
   - «2 500 000 м²» плитки в год
   Использовать counter-анимацию как на главной.
4. **О производстве:** Grid 1fr 1fr (текст + фото-плейсхолдер). Описание завода, мощности, технологии. Заголовок: «Современное производство»
5. **Контроль качества:** Grid 1fr 1fr (фото + текст, зеркально). Описание лаборатории, стандартов ГОСТ. Заголовок: «Контроль качества на всех этапах»
6. **Продукция (3 карточки):** Grid 3×1. Каждая карточка:
   ```
   .about-product-card
   ├── __icon (svg иконка)
   ├── __title (Тротуарная плитка / Бордюры / Компенсаторы)
   ├── __specs (список характеристик: прочность, морозостойкость и т.д.)
   └── __link → на страницу категории
   ```
7. **История (timeline):** Горизонтальная прокручиваемая шкала с ключевыми датами:
   - 2010 — Основание компании
   - 2013 — Запуск производства плитки
   - 2016 — 100-й дилер
   - 2019 — Модернизация линии
   - 2022 — Расширение ассортимента
   - 2024 — Новая линейка компенсаторов

   ```html
   <div class="timeline">
       <div class="timeline__track">
           <div class="timeline__item">
               <span class="timeline__year">2010</span>
               <p class="timeline__text">Основание компании</p>
           </div>
           ...
       </div>
   </div>
   ```
   CSS: `overflow-x: auto`, горизонтальный flex, линия снизу, точки-маркеры.

8. **Сертификаты (preview):** Горизонтальная лента из 4–6 миниатюр сертификатов + ссылка «Все сертификаты →» на страницу сертификатов.
9. **CTA-блок:** Тёмный фон, текст «Нужна консультация?» + кнопка «Связаться с нами» → #callback на главной или форма.
10. **Footer**

---

### 5.3. Каталог (`pages/catalog.html`)

**Референс:** braer.ru/catalog/

**Секции:**

1. **Breadcrumbs:** Главная / Каталог
2. **Page Hero:** Заголовок «Каталог продукции»
3. **Категории продукции:** Grid 3×1, крупные карточки:

   ```html
   <a href="catalog-plitka.html" class="catalog-card">
       <div class="catalog-card__img catalog-card__img--plitka"></div>
       <div class="catalog-card__body">
           <h2 class="catalog-card__title">Тротуарная плитка</h2>
           <p class="catalog-card__count">142 товара</p>
           <p class="catalog-card__desc">Разнообразие форм, цветов и способов укладки</p>
       </div>
   </a>
   ```

   Каждая карточка: большое изображение сверху (~280px), заголовок, количество товаров, описание. Hover: тень + подъём.

   Категории:
   - **Тротуарная плитка** — 142 товара, gradient-плейсхолдер тёплый серый
   - **Бордюрный камень** — 24 товара, gradient-плейсхолдер средний серый
   - **Компенсаторы для бордюров** — 8 товаров, gradient-плейсхолдер тёмный

4. **Дополнительные категории:** Grid 3×1, мелкие карточки (те же что на главной — catalog-overview):
   - Газонная решётка — 2
   - Водоотводные лотки — 5
   - Дорожная плита — 5

5. **CTA-блок:** «Не нашли нужный товар? Свяжитесь с нами» + кнопка
6. **Footer**

---

### 5.4. Страница категории: Тротуарная плитка (`pages/catalog-plitka.html`)

**Референс:** braer.ru/catalog/keramicheskie-bloki/

**Секции:**

1. **Breadcrumbs:** Главная / Каталог / Тротуарная плитка
2. **Page Hero:** Заголовок «Тротуарная плитка», подзаголовок с описанием
3. **Фильтры + Сортировка:**
   ```html
   <div class="catalog-filters">
       <div class="catalog-filters__bar">
           <div class="catalog-filters__group">
               <span class="catalog-filters__label">Форма:</span>
               <button class="catalog-filters__chip catalog-filters__chip--active">Все</button>
               <button class="catalog-filters__chip">Прямоугольная</button>
               <button class="catalog-filters__chip">Фигурная</button>
               <button class="catalog-filters__chip">Мозаика</button>
           </div>
           <div class="catalog-filters__group">
               <span class="catalog-filters__label">Цвет:</span>
               <button class="catalog-filters__chip">Серый</button>
               <button class="catalog-filters__chip">Коричневый</button>
               <button class="catalog-filters__chip">Красный</button>
               <button class="catalog-filters__chip">Чёрный</button>
               <button class="catalog-filters__chip">Mix</button>
           </div>
       </div>
       <div class="catalog-filters__sort">
           <select class="catalog-filters__select">
               <option>По популярности</option>
               <option>Цена: по возрастанию</option>
               <option>Цена: по убыванию</option>
               <option>Новинки</option>
           </select>
       </div>
   </div>
   ```

   Фильтры — горизонтальные chip-кнопки. Сортировка — select справа. **Фильтрация — чисто визуальная** (CSS-классы для скрытия/показа карточек), без бэкенда.

4. **Продуктовая сетка:** Grid 3×n. Карточки `product-card` (уже готовы в CSS):
   ```
   product-card
   ├── __badges (Хит / Новинка / -15%)
   ├── __img (gradient-плейсхолдер)
   ├── __body
   │   ├── __name
   │   ├── __specs (размер, толщина)
   │   ├── __price + __price-old
   │   └── __detail → «Запросить цену»
   ```

   **Товары для тротуарной плитки (12–16 карточек):**
   - Старый город Ландхаус, серый — 160×160×60 — 890 ₽/м²
   - Классико, коричневый — 200×100×60 — 950 ₽/м²
   - Ригель, терракота — 300×100×40 — 935 ₽/м² (скидка с 1100)
   - Брусчатка, серый mix — 200×100×80 — 1050 ₽/м²
   - Волна, графит — 240×120×60 — 980 ₽/м²
   - Катушка, натуральный — 200×170×60 — 870 ₽/м²
   - Клевер, красный — 295×295×40 — 790 ₽/м²
   - Ромб, коричневый — 190×330×45 — 920 ₽/м²
   - 8-ка (восьмёрка), серый — 400×400×50 — 760 ₽/м²
   - Мозаика Тетрис, mix — 120×60×60 — 1200 ₽/м² (Новинка)
   - Старый город, осенний mix — 160×160×60 — 1100 ₽/м²
   - Классико, антрацит — 200×100×60 — 1050 ₽/м²

5. **Описание категории (SEO-блок):** Под сеткой товаров — текстовый блок с описанием тротуарной плитки, её преимуществах, способах укладки. 2–3 абзаца.

6. **CTA:** «Нужна помощь с выбором?» + кнопка «Получить консультацию»
7. **Footer**

---

### 5.5. Страница категории: Бордюры (`pages/catalog-bordyury.html`)

Структура идентична 5.4, но с контентом по бордюрам.

**Фильтры:**
- Тип: Все / Дорожный / Садовый / Магистральный
- Длина: 500 мм / 1000 мм

**Товары (8–10 карточек):**
- Бордюр дорожный БР 100.30.15 — 1000×300×150 — 450 ₽/шт
- Бордюр садовый БР 50.20.8 — 500×200×80 — 180 ₽/шт
- Бордюр дорожный БР 100.30.18 — 1000×300×180 — 520 ₽/шт
- Бордюр магистральный БР 100.45.18 — 1000×450×180 — 780 ₽/шт
- Бордюр садовый БР 100.20.8 — 1000×200×80 — 280 ₽/шт (Хит)
- Бордюр тротуарный БР 50.20.6 — 500×200×60 — 140 ₽/шт
- Бордюр радиусный R500 — 500×300×150 — 680 ₽/шт (Новинка)
- Бордюр понижающий — 1000×300×80→150 — 490 ₽/шт

**SEO-блок:** Описание бордюрного камня, его функции, виды, применение.

---

### 5.6. Страница категории: Компенсаторы (`pages/catalog-kompensatory.html`)

Структура идентична 5.4, но с контентом по компенсаторам.

**Фильтры:**
- Материал: Все / Резина / Полимер
- Толщина: 5 мм / 8 мм / 10 мм

**Товары (6–8 карточек):**
- Компенсатор резиновый КР-15 — 150×50×10 — 85 ₽/шт
- Компенсатор резиновый КР-20 — 200×50×10 — 95 ₽/шт
- Компенсатор полимерный КП-15 — 150×50×8 — 70 ₽/шт (Хит)
- Компенсатор полимерный КП-20 — 200×50×8 — 80 ₽/шт
- Компенсатор усиленный КУ-30 — 300×80×10 — 140 ₽/шт (Новинка)
- Компенсатор универсальный КУ-15 — 150×50×5 — 55 ₽/шт

**SEO-блок:** Описание компенсаторов, зачем они нужны, как продлевают срок мощения.

---

### 5.7. Где купить (`pages/where-buy.html`)

**Референс:** braer.ru/where-buy/

**Секции:**

1. **Breadcrumbs:** Главная / Где купить
2. **Page Hero:** Заголовок «Где купить», подзаголовок «Найдите ближайшую точку продаж BORDUR»
3. **Основной блок — двухколоночный layout:**

   ```html
   <section class="where-buy">
       <div class="where-buy__sidebar">
           <div class="where-buy__search">
               <input type="text" placeholder="Поиск по городу..." class="where-buy__input">
           </div>
           <div class="where-buy__filter-chips">
               <button class="where-buy__chip where-buy__chip--active">Все</button>
               <button class="where-buy__chip">Тротуарная плитка</button>
               <button class="where-buy__chip">Бордюры</button>
               <button class="where-buy__chip">Компенсаторы</button>
           </div>
           <div class="where-buy__list">
               <div class="where-buy__dealer">
                   <h3 class="where-buy__dealer-name">СтройМастер</h3>
                   <p class="where-buy__dealer-address">г. Москва, ул. Строителей, д. 15</p>
                   <a href="tel:..." class="where-buy__dealer-phone">+7 495 123-45-67</a>
                   <div class="where-buy__dealer-tags">
                       <span class="where-buy__tag">Плитка</span>
                       <span class="where-buy__tag">Бордюры</span>
                   </div>
               </div>
               <!-- Повторить 10–15 дилеров -->
           </div>
       </div>
       <div class="where-buy__map" id="dealerMap">
           <!-- Яндекс.Карты или placeholder -->
           <div class="where-buy__map-placeholder">
               Карта будет подключена позже
           </div>
       </div>
   </section>
   ```

   **Layout:** На десктопе — sidebar 380px + map остальное (flex или grid). На мобильных — sidebar сверху, карта снизу (или вкладки sidebar/map).

   **Карта:** Пока оставить placeholder div. Позже подключим Яндекс.Карты.

4. **CTA:** «Хотите стать дилером?» + кнопка → контакты
5. **Footer**

---

### 5.8. Оплата и доставка (`pages/buyer/delivery.html`)

**Референс:** braer.ru/delivery/

**Секции:**

1. **Breadcrumbs:** Главная / Покупателю / Оплата и доставка
2. **Page Hero:** Заголовок «Оплата и доставка»
3. **Доставка:**
   ```html
   <section class="info-section">
       <div class="container">
           <div class="info-section__block">
               <h2 class="info-section__title">Стоимость доставки</h2>
               <p>Доставка строительных материалов по России и странам СНГ осуществляется партнёрскими транспортными компаниями.</p>
               <ul class="info-section__list">
                   <li>Стоимость рассчитывается индивидуально</li>
                   <li>Зависит от расстояния и типа транспорта</li>
                   <li>Автотранспорт грузоподъёмностью до 20 тонн</li>
                   <li>Возможна доставка манипулятором 5–10 тонн</li>
               </ul>
               <a href="where-buy.html" class="btn btn--outline">Найти ближайшего дилера</a>
           </div>
       </div>
   </section>
   ```

4. **Приём заказов:** Текстовый блок — режим работы, телефон.
5. **Оплата:**
   - Текст об условиях оплаты через дилерскую сеть
   - Физлица: покупка на заводе, самовывоз, оплата наличными/картой
6. **Возврат:** Условия возврата — текстовый блок.
7. **CTA:** Форма обратной связи (та же, что на главной — `callback__form`)
8. **Footer**

Стили `.info-section`:
```css
.info-section { padding: 60px 0; }
.info-section + .info-section { border-top: 1px solid var(--border); }
.info-section__title { font-size: 24px; font-weight: 700; color: var(--dark); margin-bottom: 16px; }
.info-section__list { padding-left: 20px; margin: 16px 0 24px; }
.info-section__list li { margin-bottom: 8px; font-size: 15px; color: var(--text-secondary); line-height: 1.6; }
.info-section__list li::marker { color: var(--orange); }
```

---

### 5.9. Сертификаты (`pages/buyer/certificates.html`)

**Секции:**

1. **Breadcrumbs:** Главная / Покупателю / Сертификаты
2. **Page Hero:** Заголовок «Сертификаты и награды»
3. **Сетка сертификатов:** Grid 4×n (3 на tablet, 2 на mobile):
   ```html
   <div class="certs-grid">
       <a href="#" class="cert-card" data-anim="scale" data-anim-delay="0">
           <div class="cert-card__img cert-card__img--1"></div>
           <p class="cert-card__name">Сертификат соответствия ГОСТ 17608-2017</p>
       </a>
       <!-- Повторить 8–12 карточек -->
   </div>
   ```

   Карточки: миниатюра документа (gradient-плейсхолдер, aspect-ratio ~3:4), название снизу. Hover: тень + лёгкий scale.

4. **Footer**

---

### 5.10. Вопрос-ответ (`pages/buyer/faq.html`)

**Референс:** braer.ru/questions-and-answers/

**Секции:**

1. **Breadcrumbs:** Главная / Покупателю / Вопрос-ответ
2. **Page Hero:** Заголовок «Часто задаваемые вопросы»
3. **Управление:** Кнопки «Развернуть все» / «Свернуть все»
4. **Аккордеон:**
   ```html
   <div class="faq">
       <div class="faq__item">
           <button class="faq__question">
               <span>Как заказать продукцию BORDUR?</span>
               <svg class="faq__icon">...</svg>
           </button>
           <div class="faq__answer">
               <p>Вы можете заказать продукцию через ближайшего дилера...</p>
           </div>
       </div>
       <!-- Повторить 10–15 вопросов -->
   </div>
   ```

   JS: клик на `.faq__question` → toggle `faq__item--open` → `.faq__answer` раскрывается (max-height transition). Иконка-шеврон вращается.

   Стили:
   ```css
   .faq__item { border-bottom: 1px solid var(--border); }
   .faq__question { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 20px 0; font-size: 16px; font-weight: 600; color: var(--dark); text-align: left; }
   .faq__icon { width: 24px; height: 24px; flex-shrink: 0; transition: transform .3s ease; color: var(--text-muted); }
   .faq__item--open .faq__icon { transform: rotate(180deg); color: var(--orange); }
   .faq__answer { max-height: 0; overflow: hidden; transition: max-height .4s ease; }
   .faq__item--open .faq__answer { max-height: 500px; }
   .faq__answer p { padding: 0 0 20px; font-size: 15px; color: var(--text-secondary); line-height: 1.7; }
   ```

   **Вопросы по категориям:**

   *Общие:*
   - Как заказать продукцию BORDUR?
   - Какие способы оплаты доступны?
   - Осуществляете ли вы доставку?
   - Можно ли приехать на завод?

   *Тротуарная плитка:*
   - Какой срок службы у тротуарной плитки?
   - Какую толщину плитки выбрать?
   - Чем отличается вибропрессование от вибролитья?
   - Как ухаживать за плиткой зимой?

   *Бордюры:*
   - Чем отличается дорожный бордюр от садового?
   - Какой бордюр подойдёт для парковки?

   *Компенсаторы:*
   - Зачем нужны компенсаторы?
   - Как устанавливать компенсаторы?

5. **CTA:** «Не нашли ответ? Свяжитесь с нами» + кнопка
6. **Footer**

---

### 5.11. Контакты (`pages/contacts.html`)

**Референс:** braer.ru/contacts/

**Секции:**

1. **Breadcrumbs:** Главная / Контакты
2. **Page Hero:** Заголовок «Контакты»
3. **Два блока контактной информации:** Grid 1fr 1fr

   ```html
   <div class="contacts-grid">
       <div class="contact-block" data-anim="left">
           <h2 class="contact-block__title">Торговый дом</h2>
           <address class="contact-block__address">
               <p>117186, Москва, ул. Нагорная, д. 18, корп. 4</p>
           </address>
           <div class="contact-block__details">
               <a href="tel:+74956457120">+7 495 645-71-20</a>
               <a href="mailto:info@bordur.ru">info@bordur.ru</a>
               <p>Пн–Пт 09:00–18:00</p>
           </div>
           <a href="#" class="contact-block__map-link">Как добраться? →</a>
           <div class="contact-block__img contact-block__img--office"></div>
       </div>

       <div class="contact-block" data-anim="right">
           <h2 class="contact-block__title">Производство</h2>
           <address class="contact-block__address">
               <p>301132, Тульская обл., пос. Обидимо, ул. Кирпичная, д. 1а</p>
           </address>
           <div class="contact-block__details">
               <a href="tel:+74872252452">+7 4872 25-24-52</a>
               <a href="mailto:zavod@bordur.ru">zavod@bordur.ru</a>
               <p>Пн–Пт 09:00–18:00</p>
           </div>
           <a href="#" class="contact-block__map-link">Как добраться? →</a>
           <div class="contact-block__img contact-block__img--factory"></div>
       </div>
   </div>
   ```

4. **Реквизиты:** Раскрывающийся блок (аккордеон) с юридической информацией:
   - Полное наименование
   - Юридический адрес
   - ИНН / ОГРН
   - Банковские реквизиты

5. **Форма обратной связи (расширенная):**
   ```html
   <form class="contact-form">
       <div class="form-row-3">
           <div class="form-field"><input type="text" placeholder="Ваше имя*" required></div>
           <div class="form-field"><input type="tel" placeholder="Телефон*" required></div>
           <div class="form-field"><input type="email" placeholder="E-mail*" required></div>
       </div>
       <div class="form-row-2">
           <div class="form-field">
               <select required>
                   <option disabled selected>Регион*</option>
                   ...
               </select>
           </div>
           <div class="form-field">
               <select>
                   <option disabled selected>Категория продукции</option>
                   <option>Тротуарная плитка</option>
                   <option>Бордюры</option>
                   <option>Компенсаторы</option>
               </select>
           </div>
       </div>
       <div class="form-field">
           <textarea placeholder="Сообщение" rows="4"></textarea>
       </div>
       <div class="form-checks">
           <label class="form-check">
               <input type="checkbox" required>
               <span>Согласен с <a href="#">Политикой конфиденциальности</a></span>
           </label>
       </div>
       <button type="submit" class="btn btn--primary btn--submit">Отправить</button>
   </form>
   ```

6. **Footer**

---

## 6. Правила для агентов

### 6.1. Подключение CSS и JS

Все страницы ссылаются на одни файлы (пути относительные от корня):

```html
<!-- Из pages/ -->
<link rel="stylesheet" href="../css/style-v3.css">
<script src="../js/main-v3.js"></script>

<!-- Из pages/buyer/ -->
<link rel="stylesheet" href="../../css/style-v3.css">
<script src="../../js/main-v3.js"></script>
```

### 6.2. Шаблон внутренней страницы

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ЗАГОЛОВОК — BORDUR</title>
    <meta name="description" content="Описание страницы">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style-v3.css">
</head>
<body>

    <!-- КОПИРОВАТЬ: promo-bar из index-v3.html -->

    <!-- КОПИРОВАТЬ: header из index-v3.html -->
    <!-- ВАЖНО: На внутренних страницах заменить data-hero-tab на обычные href:
         data-hero-tab="0" → href="../pages/catalog-plitka.html"
         data-hero-tab="1" → href="../pages/catalog-bordyury.html"
         data-hero-tab="2" → href="../pages/catalog-kompensatory.html"
    -->

    <!-- Breadcrumbs -->
    <nav class="breadcrumbs">...</nav>

    <!-- Page Hero -->
    <section class="page-hero">...</section>

    <!-- Контент страницы -->
    ...

    <!-- КОПИРОВАТЬ: footer из index-v3.html -->
    <!-- КОПИРОВАТЬ: mobile-menu (с обычными href вместо data-hero-tab) -->
    <!-- КОПИРОВАТЬ: cookie-bar, back-to-top -->

    <script src="../js/main-v3.js"></script>
</body>
</html>
```

### 6.3. Именование CSS-классов

**BEM-нотация:** `блок__элемент--модификатор`

Примеры:
```
.page-hero__title
.catalog-card__img--plitka
.faq__item--open
.where-buy__dealer-name
.info-section__list
.contact-block__details
.timeline__item
```

### 6.4. Новые стили

Каждый агент добавляет свои стили **в конец файла `css/style-v3.css`**, перед секцией `/* RESPONSIVE */`. Группировать с комментарием:

```css
/* ============================
   PAGE: ABOUT (pages/about.html)
   ============================ */
.about-production { ... }
.timeline { ... }
```

### 6.5. Новый JS

Каждый агент добавляет свой JS **в конец файла `js/main-v3.js`**, внутри основного `DOMContentLoaded`, перед закрывающей `});`. Оборачивать в проверку наличия элемента:

```javascript
// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq__question');
if (faqItems.length) {
    faqItems.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.classList.toggle('faq__item--open');
        });
    });
}
```

### 6.6. Ссылки между страницами

| Откуда | Куда | Путь |
|---|---|---|
| index-v3.html | about | pages/about.html |
| index-v3.html | catalog | pages/catalog.html |
| pages/*.html | главная | ../index-v3.html |
| pages/*.html | другая страница | ./{page}.html |
| pages/buyer/*.html | главная | ../../index-v3.html |
| pages/buyer/*.html | pages/ | ../{page}.html |

### 6.7. Адаптив

Добавлять responsive-стили в соответствующие media-query блоки внутри `style-v3.css`:
- `@media(max-width:1024px)` — tablet landscape
- `@media(max-width:768px)` — tablet/mobile
- `@media(max-width:480px)` — small mobile

### 6.8. Чего НЕ делать

- Не создавать отдельные CSS/JS файлы для каждой страницы
- Не менять существующие стили (только добавлять новые)
- Не менять структуру header/footer (только копировать)
- Не добавлять внешние библиотеки (jQuery, Swiper и т.д.)
- Не добавлять бэкенд-логику, серверные вызовы
- Не использовать `!important`
- Не менять CSS-переменные в `:root`

---

## 7. Контент-заглушки

Пока нет реальных фотографий, используем CSS gradient-плейсхолдеры:

```css
/* Тёплый (плитка) */
background: linear-gradient(160deg, #808080, #C0C0C0 50%, #D8D8D8);

/* Средний (бордюры) */
background: linear-gradient(160deg, #696969, #A0A0A0 50%, #C0C0C0);

/* Тёмный (компенсаторы) */
background: linear-gradient(160deg, #333, #666 50%, #999);

/* Природный (галерея/объекты) */
background: linear-gradient(135deg, #556B2F, #8FBC8F 50%, #98D98E);

/* Офис */
background: linear-gradient(135deg, #4682B4, #87CEEB);

/* Завод */
background: linear-gradient(135deg, #b84c1c, #d06832 50%, #f0a070);
```

Все плейсхолдеры — через CSS-классы `.[block]__img--[variant]`.
