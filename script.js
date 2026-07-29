const tabTriggers = [...document.querySelectorAll("[data-tab-target]")];
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const tabPanels = [...document.querySelectorAll("[data-tab-panel]")];
const homePanel = document.querySelector("[data-home-panel]");
const homeTriggers = [...document.querySelectorAll("[data-home-trigger]")];
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const sectionIds = new Set(tabPanels.map((panel) => panel.id));
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function closeMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.classList.remove("is-open");
  mobileMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

function updateHistory(targetId) {
  const url = new URL(window.location.href);
  url.hash = targetId || "";
  window.history.pushState(null, "", url);
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: motionQuery.matches ? "auto" : "smooth"
  });
}

function setActiveNav(targetId) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.tabTarget === targetId;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function openHome(shouldUpdateHistory = true) {
  homePanel.hidden = false;
  tabPanels.forEach((panel) => {
    panel.hidden = true;
  });
  setActiveNav("");
  closeMenu();
  if (shouldUpdateHistory) updateHistory("");
  scrollToTop();
}

function openSection(targetId, shouldUpdateHistory = true) {
  if (!sectionIds.has(targetId)) {
    openHome(shouldUpdateHistory);
    return;
  }

  homePanel.hidden = true;
  tabPanels.forEach((panel) => {
    panel.hidden = panel.id !== targetId;
  });
  setActiveNav(targetId);
  closeMenu();
  if (shouldUpdateHistory) updateHistory(targetId);
  scrollToTop();
}

tabTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openSection(trigger.dataset.tabTarget);
  });
});

homeTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openHome());
});

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("is-open");
    mobileMenu.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
}

window.addEventListener("popstate", () => {
  const targetId = window.location.hash.replace("#", "");
  if (sectionIds.has(targetId)) {
    openSection(targetId, false);
  } else {
    openHome(false);
  }
});

const initialTarget = window.location.hash.replace("#", "");
if (sectionIds.has(initialTarget)) {
  openSection(initialTarget, false);
} else {
  openHome(false);
}
