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

const initCollectionFilters = () => {
  const filterPanel = document.querySelector("[data-collection-filters]");

  if (!filterPanel) return;

  const filterButtons = [...filterPanel.querySelectorAll("[data-collection-filter]")];
  const collectionItems = [...document.querySelectorAll("[data-collection-item]")];
  const collectionSections = [...document.querySelectorAll("[data-collection-section]")];

  const getItemTags = (item) => (item.dataset.collectionTags || "").split(/\s+/).filter(Boolean);

  const applyFilter = (filter) => {
    filterButtons.forEach((button) => {
      const isActive = button.dataset.collectionFilter === filter;
      const isAllActive = filter === "all" && button.dataset.collectionFilter === "all";

      button.classList.toggle("is-active", isActive || isAllActive);
      button.setAttribute("aria-pressed", String(isActive || isAllActive));
    });

    collectionItems.forEach((item) => {
      const isVisible = filter === "all" || getItemTags(item).includes(filter);
      item.classList.toggle("is-filter-hidden", !isVisible);
    });

    collectionSections.forEach((section) => {
      const hasVisibleItem = section.querySelector("[data-collection-item]:not(.is-filter-hidden)");
      section.classList.toggle("is-filter-hidden", !hasVisibleItem);
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyFilter(button.dataset.collectionFilter || "all");
    });
  });

  applyFilter("all");
};

const initCollectionScroller = () => {
  document.querySelectorAll("[data-collection-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.collectionScrollTarget);

      if (!target) return;

      const direction = button.dataset.collectionScroll === "next" ? 1 : -1;
      target.scrollBy({ left: target.clientWidth * direction, behavior: "smooth" });
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
  initCollectionFilters();
  initCollectionScroller();
};

initPage();
