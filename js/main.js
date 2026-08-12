document.addEventListener('DOMContentLoaded', () => {

  initSiteHeader();

  initSolutionsTabs();

  // Initialize Hero Swiper（僅在頁面上真的存在 #banner 時才初始化，
  // 避免在沒有 banner 輪播的頁面上建立無用的 Swiper 實例）
  if (document.getElementById('banner')) {
    const heroSwiper = new Swiper('#banner', {
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

function initSolutionsTabs() {
  const solutionsSection = document.getElementById('solutions');
  // 判斷頁面上是否有 #solutions，若無則提早結束，避免報錯
  if (!solutionsSection) return;

  // 將選取範圍限制在 solutionsSection 內，效能更好也避免干擾其他區塊
  const tabsContainer = solutionsSection.querySelector('.tabs');
  const contentItems = solutionsSection.querySelectorAll('.content-item');

  if (!tabsContainer || contentItems.length === 0) return;

  // 使用事件委派 (Event Delegation) 提升效能
  tabsContainer.addEventListener('click', (e) => {
    // 找到被點擊的按鈕，如果點擊的不是按鈕或其子元素，則不處理
    const clickedBtn = e.target.closest('.tab-btn');
    if (!clickedBtn) return;

    // 如果點擊的按鈕已經是 active 狀態，則不需重複執行
    if (clickedBtn.classList.contains('active')) return;

    // 移除所有按鈕的 active 狀態
    tabsContainer.querySelector('.tab-btn.active')?.classList.remove('active');
    // 為當前點擊的按鈕加上 active
    clickedBtn.classList.add('active');

    // 移除所有內容區塊的 active 狀態
    solutionsSection.querySelector('.content-item.active')?.classList.remove('active');

    // 取得對應的目標 ID 並加上 active 顯示內容
    const targetId = clickedBtn.dataset.target;
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
}
