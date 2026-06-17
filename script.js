const includePartials = async () => {
  const includeNodes = [...document.querySelectorAll("[data-include]")];

  await Promise.all(
    includeNodes.map(async (node) => {
      const includePath = node.dataset.include;
      const response = await fetch(includePath);

      if (!response.ok) {
        throw new Error(`Unable to load ${includePath}`);
      }

      node.outerHTML = await response.text();
    })
  );
};

const setActiveNavigation = () => {
  const currentPage = document.body.dataset.page || "home";

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === currentPage);
  });
};

const initMenu = () => {
  const menu = document.querySelector("[data-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");

  if (!menu || !menuToggle) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
};

const initQuoteForm = () => {
  const quoteForm = document.querySelector("[data-quote-form]");

  if (!quoteForm) return;

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
};

const initUniverseCards = () => {
  const quoteForm = document.querySelector("[data-quote-form]");
  const universeLinks = document.querySelectorAll("[data-event-type]");

  universeLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const eventType = link.dataset.eventType;
      const typeSelect = quoteForm?.elements.type;

      if (typeSelect && eventType) {
        typeSelect.value = eventType;
      }
    });
  });
};

const initPage = async () => {
  try {
    await includePartials();
  } catch (error) {
    console.error(error);
  }

  setActiveNavigation();
  initMenu();
  initQuoteForm();
  initUniverseCards();
};

initPage();
