document.addEventListener('DOMContentLoaded', () => {

  initSiteHeader();

  initSolutionsTabs();
  
  // Initialize Hero Swiper
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

  // Other JavaScript code for the site can go here.

});

function initSiteHeader() {
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const headerActions = document.getElementById('site-header-actions');
  const navBackdrop = document.getElementById('nav-backdrop');

  if (!navToggle || !mainNav || !headerActions || !navBackdrop) return;

  const desktopQuery = window.matchMedia('(min-width: 1024px)');
  const dropdowns = document.querySelectorAll('.has-dropdown');

  dropdowns.forEach((item) => {
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

  // Mobile accordion: tap a submenu's chevron to expand it in place instead
  // of navigating away. Links without a dropdown, and taps outside the
  // chevron on link items, keep their normal href behavior.
  dropdowns.forEach((item) => {
    const trigger = item.querySelector(':scope > a, :scope > button');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      if (desktopQuery.matches) return;

      const isLink = trigger.tagName === 'A';
      const hitChevron = Boolean(e.target.closest('.chevron'));
      if (isLink && !hitChevron) return;

      e.preventDefault();
      const willOpen = !item.classList.contains('is-open');

      dropdowns.forEach((sibling) => {
        if (sibling !== item && sibling.parentElement === item.parentElement) {
          closeDropdown(sibling);
        }
      });

      item.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    });
  });
}

function initSolutionsTabs() {
  const solutionsSection = document.getElementById('solutions');
  
  // 判斷頁面上是否有 #solutions，若無則提早結束，避免報錯
  if (!solutionsSection) return;

  // 將選取範圍限制在 solutionsSection 內，效能更好也避免干擾其他區塊
  const tabBtns = solutionsSection.querySelectorAll('.tab-btn');
  const contentItems = solutionsSection.querySelectorAll('.content-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 移除所有按鈕的 active 狀態
      tabBtns.forEach(b => b.classList.remove('active'));
      // 移除所有內容區塊的 active 狀態
      contentItems.forEach(item => item.classList.remove('active'));

      // 為當前點擊的按鈕加上 active
      btn.classList.add('active');

      // 取得對應的目標 ID 並加上 active 顯示內容
      const targetId = btn.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

