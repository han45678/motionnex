document.addEventListener('DOMContentLoaded', () => {

  initAOS();

  initSiteHeader();

  initHeaderScrollState();

  initSolutionsTabs();

  initCaseMissionSelect();

  initNewsFilter();

  initCountUpStats();

  initCountUpStatsAbout();

  initPartnersMarquee();

  // Initialize Hero Swiper（僅在頁面上真的存在 #banner 時才初始化，
  // 避免在沒有 banner 輪播的頁面上建立無用的 Swiper 實例）
  if (document.getElementById('banner')) {
    new Swiper('#banner', {
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  // Other JavaScript code for the site can go here.

});

// 頁面上所有帶 data-aos 屬性的元素,滾動進可視範圍時觸發動畫(見 assets/vendor/aos)
// 全站統一採用「向上淡出」(fade-up),只在每個元素第一次進入畫面時觸發一次
function initAOS() {
  if (typeof AOS === 'undefined') return;

  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    offset: 80,
    once: true,
    disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });
}

function initSiteHeader() {
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const headerActions = document.getElementById('site-header-actions');
  const navBackdrop = document.getElementById('nav-backdrop');

  // 確保所有需要的元素都存在
  if (!navToggle || !mainNav || !headerActions || !navBackdrop) return;

  const desktopQuery = window.matchMedia('(min-width: 1024px)');
  const dropdowns = document.querySelectorAll('.has-dropdown');

  dropdowns.forEach(item => {
    const trigger = item.querySelector(':scope > a, :scope > button');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });

  function closeDropdown(item) {
    item.classList.remove('is-open');
    const trigger = item.querySelector(':scope > a, :scope > button');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    navToggle.setAttribute('aria-expanded', 'true');
    mainNav.classList.add('is-open');
    headerActions.classList.add('is-open');
    navBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
    headerActions.classList.remove('is-open');
    navBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    dropdowns.forEach(closeDropdown);
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navBackdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  desktopQuery.addEventListener('change', (e) => {
    if (e.matches) closeMenu();
  });

  // Mobile accordion: tapping anywhere on a submenu trigger (label or
  // chevron) expands it in place. It never navigates away on mobile —
  // a mistap on the label used to fire the link's href and jump away
  // instead of opening the submenu, which is what this avoids.
  dropdowns.forEach((item) => {
    const trigger = item.querySelector(':scope > a, :scope > button'); 
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      if (desktopQuery.matches) return;

      e.preventDefault();
      const willOpen = !item.classList.contains('is-open');

      dropdowns.forEach((sibling) => {
        if (sibling !== item && sibling.parentElement === item.parentElement) {
          closeDropdown(sibling);
        }
      });

      item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(willOpen));
    });
  });

  // Tapping anywhere outside an open submenu (e.g. elsewhere in the mobile
  // menu) closes it, so the language popup and nav accordions are always
  // dismissible without having to hit the exact trigger again.
  document.addEventListener('click', (e) => {
    if (desktopQuery.matches) return;

    dropdowns.forEach((item) => {
      if (item.classList.contains('is-open') && !item.contains(e.target)) {
        closeDropdown(item);
      }
    });
  });
}

// 往下滑動後,桌機版 header 貼齊頂端、兩側補滿並整體縮小(見 _header.scss 的 .is-scrolled)
function initHeaderScrollState() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 40;

  function updateHeaderState() {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

// 數字滾動至可視範圍時,由 0 累加到目標值(見 #about 區塊的 .num[data-count-to])
function initCountUpStats() {
  const counters = document.querySelectorAll('.num[data-count-to]');
  if (!counters.length) return;

  const DURATION = 1500; // 動畫時間(毫秒)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easeOutQuad = (t) => t * (2 - t);

  function animateCounter(el) {
    const target = parseFloat(el.dataset.countTo) || 0;
    const suffix = el.dataset.suffix || '';

    // 使用者關閉動態效果時,直接顯示最終數值
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }

    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / DURATION, 1);
      const current = Math.round(target * easeOutQuad(progress));
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // 進入可視範圍後才觸發,且每個數字只執行一次
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.5,
  });

  counters.forEach((counter) => observer.observe(counter));
}

function initCountUpStatsAbout() {
  // 加上外層 class 限制範圍，並精準選取帶有 data-count-to 的 <pre> 標籤
  const counters = document.querySelectorAll('.built-on-experience .num pre[data-count-to]');
  if (!counters.length) return;

  const DURATION = 1500; // 動畫時間(毫秒)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easeOutQuad = (t) => t * (2 - t);

  function animateCounter(el) {
    const target = parseFloat(el.dataset.countTo) || 0;

    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }

    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / DURATION, 1);
      const current = Math.round(target * easeOutQuad(progress));
      
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // 確保最後數值絕對等於目標值
        el.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, {
    // 將 threshold 從 0.5 降到 0.1
    threshold: 0.1, 
  });

  counters.forEach((counter) => observer.observe(counter));
}

// 合作夥伴 Logo 跑馬燈:用 Swiper 做成 autoplay delay:0 + 等速(linear)的無縫輪播
function initPartnersMarquee() {
  const marqueeEl = document.querySelector('#partners-section .logos-wrapper');
  const wrapperEl = marqueeEl?.querySelector('.swiper-wrapper');
  if (!marqueeEl || !wrapperEl) return;

  // .logos-wrapper 現在是滿版寬度(跳出 .container),原本 4 個 logo 的總寬度
  // 不足以撐滿畫面,loop 銜接處會露出空白;因此先把原始 logo 組合多複製幾份,
  // 確保軌道夠長、無論螢幕多寬都能無縫接續捲動
  const baseSlides = Array.from(wrapperEl.children);
  const REPEATS = 4; // 總共會有 4 份原始 logo 組合
  for (let i = 1; i < REPEATS; i++) {
    baseSlides.forEach((slide) => wrapperEl.appendChild(slide.cloneNode(true)));
  }

  // spaceBetween 需對應 _home.scss 的 size()/size-m() 換算基準(1920 / 375),
  // 手機斷點則跟專案統一的 $bp-desktop: 1024px 對齊
  const mobileQuery = window.matchMedia('(max-width: 1023px)');

  function getSpaceBetween() {
    const ratio = mobileQuery.matches ? 30 / 375 : 80 / 1920;
    return window.innerWidth * ratio;
  }

  const marqueeSwiper = new Swiper(marqueeEl, {
    loop: true,
    slidesPerView: 'auto',
    spaceBetween: getSpaceBetween(),
    speed: 5000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    allowTouchMove: false,
  });

  // 視窗縮放時重新計算間距,維持跟 SCSS 一致的流體縮放比例；
  // 用 rAF 節流,拖曳視窗邊緣連續觸發的 resize 只會在下一影格重算一次，
  // 不會每個 resize 事件都逼一次 Swiper 重排。
  let resizeQueued = false;
  window.addEventListener('resize', () => {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
      resizeQueued = false;
      marqueeSwiper.params.spaceBetween = getSpaceBetween();
      marqueeSwiper.update();
    });
  }, { passive: true });
}

// 分類 Swiper（Mission Categories / 產品分類）:case.html、products.html
// 共用同一份設定，原本兩邊各自在 inline <script> 複製一份，改成這裡集中一份。
// 回傳建立好的 Swiper 實例（頁面沒有 .category-swiper 時回傳 null），
// 讓呼叫端（例如 products.html）可以接著掛自己的 click / slideChange 邏輯。
function initCategorySwiper() {
  const el = document.querySelector('.category-swiper');
  if (!el) return null;

  return new Swiper(el, {
    loop: false,
    slidesPerView: 'auto',
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      1024: {
        spaceBetween: 30,
      },
    },
  });
}

function initSolutionsTabs() {
  const solutionsSection = document.getElementById('solutions');
  // 判斷頁面上是否有 #solutions，若無則提早結束，避免報錯。
  // solutions.html 的 <body> 也帶了 id="solutions"（作為該頁 SCSS 命名空間根，
  // 跟這裡要找的首頁 <section id="solutions"> 是兩回事)，用 tagName 排除掉，
  // 避免哪天 solutions.html 也長出 .tabs 時，事件被錯誤委派到整個 <body>。
  if (!solutionsSection || solutionsSection.tagName !== 'SECTION') return;

  // 將選取範圍限制在 solutionsSection 內，效能更好也避免干擾其他區塊
  const tabsContainer = solutionsSection.querySelector('.tabs');
  const tabContent = solutionsSection.querySelector('.tab-content');
  const contentItems = solutionsSection.querySelectorAll('.content-item');

  if (!tabsContainer || !tabContent || contentItems.length === 0) return;

  // 手機版斷點跟 _mixins.scss 的 mq(mobile) 對齊 ($bp-desktop: 1024px)
  const mobileQuery = window.matchMedia('(max-width: 1023px)');

  // 手機版：把內容區塊搬到「目前作用中頁籤按鈕」的正下方，
  // 桌機版：內容區塊固定在 tabs 右側，搬回 .tabs 後面（原本 HTML 的位置）
  function positionTabContent() {
    if (mobileQuery.matches) {
      const activeBtn = tabsContainer.querySelector('.tab-btn.active');
      if (activeBtn) activeBtn.insertAdjacentElement('afterend', tabContent);
    } else {
      tabsContainer.insertAdjacentElement('afterend', tabContent);
    }
  }

  // 切到指定頁籤：按鈕/內容區塊的 active 狀態切換 + 內容區塊歸位，
  // 點擊(手機版)、滑過(桌機版)共用同一套邏輯
  function activateTab(targetBtn) {
    // 如果目標按鈕已經是 active 狀態，則不需重複執行
    if (targetBtn.classList.contains('active')) return;

    // 移除所有按鈕的 active 狀態
    tabsContainer.querySelector('.tab-btn.active')?.classList.remove('active');
    // 為目標按鈕加上 active
    targetBtn.classList.add('active');

    // 移除所有內容區塊的 active 狀態
    solutionsSection.querySelector('.content-item.active')?.classList.remove('active');

    // 取得對應的目標 ID 並加上 active 顯示內容
    const targetId = targetBtn.dataset.target;
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.add('active');
    }

    positionTabContent();
  }

  // 使用事件委派 (Event Delegation) 提升效能
  // 手機版：點擊觸發切換
  tabsContainer.addEventListener('click', (e) => {
    const clickedBtn = e.target.closest('.tab-btn');
    if (!clickedBtn) return;
    activateTab(clickedBtn);
  });

  // 桌機版：滑過（hover）就觸發切換，不用點擊
  // 用 mouseover 而非 mouseenter 才能靠事件委派冒泡到 tabsContainer；
  // mobileQuery.matches 時代表是手機版寬度（含觸控裝置的 hover 模擬），這裡直接略過
  tabsContainer.addEventListener('mouseover', (e) => {
    if (mobileQuery.matches) return;
    const hoveredBtn = e.target.closest('.tab-btn');
    if (!hoveredBtn) return;
    activateTab(hoveredBtn);
  });

  // 監聽斷點切換（例如轉橫向、縮放視窗），確保內容區塊隨版面重新歸位
  mobileQuery.addEventListener('change', positionTabContent);
  positionTabContent();
}

// news.html 專用：篩選列（All / CASE / Events / Technology）點選 →
// 顯示/隱藏對應分類的新聞卡片。刻意只動 .filter-btn 跟 .news-card，
// 完全不去碰上面的 .news-hero，橫幅圖片跟文字維持固定、不隨篩選切換而變動。
function initNewsFilter() {
  const filterGroup = document.querySelector('.news-list-section .filter-group');
  const cards = document.querySelectorAll('.news-list-section .news-card[data-category]');
  if (!filterGroup || cards.length === 0) return;

  // 事件委派在整個篩選列上，之後要加減按鈕也不用重新綁定
  filterGroup.addEventListener('click', (e) => {
    const clickedBtn = e.target.closest('.filter-btn');
    if (!clickedBtn || clickedBtn.classList.contains('active')) return;

    filterGroup.querySelector('.filter-btn.active')?.classList.remove('active');
    clickedBtn.classList.add('active');

    const filter = clickedBtn.dataset.filter;
    cards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !matches);
    });
  });
}

// case.html 專用：Mission Categories 卡片點選 → 切換下方 Featured Missions 的內容。
// 卡片同時也是 category-swiper 的 swiper-slide，Swiper 預設會在真的拖曳滑動時
// 自動吃掉隨後的 click（preventClicks），所以這裡不用額外分辨點擊/滑動。
function initCaseMissionSelect() {
  const categoriesSection = document.querySelector('.case-categories');
  const featuredSection = document.querySelector('.featured-missions');
  if (!categoriesSection || !featuredSection) return;

  const cards = categoriesSection.querySelectorAll('.category-card[data-target]');
  const missionSets = featuredSection.querySelectorAll('.mission-set[data-mission]');
  if (cards.length === 0 || missionSets.length === 0) return;

  // 事件委派在整個分類區塊上，卡片是動態的 swiper-slide 也不用擔心綁不到
  categoriesSection.addEventListener('click', (e) => {
    const card = e.target.closest('.category-card[data-target]');
    if (!card || card.classList.contains('active')) return;

    categoriesSection.querySelector('.category-card.active')?.classList.remove('active');
    card.classList.add('active');

    const target = card.dataset.target;
    featuredSection.querySelector('.mission-set.active')?.classList.remove('active');
    featuredSection.querySelector(`.mission-set[data-mission="${target}"]`)?.classList.add('active');
  });

  // .stats-grid 的 5 張 .stat-card 各自代表一個不同案例（見 case.html 的
  // .mission-item），點了只切換「目前 active 的那組 .mission-set」內部的
  // 圖片/說明，每個分類各自記自己選到第幾張，彼此不影響
  featuredSection.addEventListener('click', (e) => {
    const statCard = e.target.closest('.stat-card[data-mission-index]');
    if (!statCard || statCard.classList.contains('active')) return;

    const missionSet = statCard.closest('.mission-set');
    if (!missionSet) return;

    missionSet.querySelector('.stat-card.active')?.classList.remove('active');
    statCard.classList.add('active');

    const index = statCard.dataset.missionIndex;
    missionSet.querySelector('.mission-item.active')?.classList.remove('active');
    missionSet.querySelector(`.mission-item[data-mission-index="${index}"]`)?.classList.add('active');
  });
}
