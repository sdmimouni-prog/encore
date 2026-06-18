const getVehicleSlug = () => {
  const explicitSlug = document.body.dataset.vehicleSlug;

  if (explicitSlug) return explicitSlug;

  const filename = window.location.pathname.split("/").pop() || "";
  return filename.replace(/^vehicule-/, "").replace(/\.html$/, "");
};

const bySlug = (slug) => (window.ENCORE_VEHICLES || []).find((vehicle) => vehicle.slug === slug);

const setText = (selector, value) => {
  const node = document.querySelector(selector);
  if (node) node.textContent = value || "";
};

const setHTML = (selector, value) => {
  const node = document.querySelector(selector);
  if (node) node.innerHTML = value || "";
};

const getQuoteType = (usage) => {
  const normalizedUsage = (usage || "").toLowerCase();

  if (normalizedUsage.includes("mariage") || normalizedUsage.includes("cortège")) return "Mariage";
  if (normalizedUsage.includes("food")) return "Food Trucks & Activations";
  if (normalizedUsage.includes("corporate")) return "Événement corporate";
  if (normalizedUsage.includes("shooting")) return "Shooting photo";
  if (normalizedUsage.includes("publicité")) return "Publicité";
  if (normalizedUsage.includes("cinéma") || normalizedUsage.includes("série")) return "Tournage cinéma";
  return usage || "";
};

const renderVehicleDetail = () => {
  const vehicles = window.ENCORE_VEHICLES || [];
  const vehicle = bySlug(getVehicleSlug());

  if (!vehicle) {
    setText("[data-vehicle-title]", "Véhicule introuvable");
    setText("[data-vehicle-copy]", "Cette fiche n'est pas disponible.");
    return;
  }

  const pageTitle = `${vehicle.name} - ENCORE`;
  const metaDescription = `${vehicle.name} ${vehicle.year} - fiche véhicule ENCORE pour mariages, tournages, événements et activations.`;
  const heroPicture = document.querySelector("[data-vehicle-hero-picture]");
  const mainImage = document.querySelector("[data-vehicle-main-image]");
  const sourceLink = document.querySelector("[data-vehicle-source]");
  const quoteLink = document.querySelector("[data-vehicle-quote]");
  const collectionLink = document.querySelector("[data-vehicle-collection]");
  const descriptionMeta = document.querySelector('meta[name="description"]');
  const relatedVehicles = vehicles
    .filter((item) => item.slug !== vehicle.slug)
    .sort((a, b) => {
      const familyA = a.family === vehicle.family ? 0 : 1;
      const familyB = b.family === vehicle.family ? 0 : 1;
      return familyA - familyB || a.name.localeCompare(b.name);
    })
    .slice(0, 3);

  document.title = pageTitle;
  if (descriptionMeta) descriptionMeta.setAttribute("content", metaDescription);
  if (heroPicture) heroPicture.style.backgroundImage = `url("${vehicle.image}")`;
  if (mainImage) {
    mainImage.src = vehicle.image;
    mainImage.alt = vehicle.name;
  }

  setText("[data-vehicle-title]", vehicle.name);
  setText("[data-vehicle-kicker]", `${vehicle.family} · ${vehicle.year}`);
  setText("[data-vehicle-copy]", vehicle.intro);
  setText("[data-vehicle-year]", vehicle.year);
  setText("[data-vehicle-origin]", vehicle.origin);
  setText("[data-vehicle-period]", vehicle.period);
  setText("[data-vehicle-family]", vehicle.family);
  setText("[data-vehicle-story-title]", `${vehicle.name}, une présence qui signe l'image.`);
  setHTML(
    "[data-vehicle-story]",
    vehicle.story.map((paragraph) => `<p>${paragraph}</p>`).join("")
  );
  setHTML(
    "[data-vehicle-specs]",
    Object.entries(vehicle.specs)
      .map(([label, value]) => `<div><strong>${label}</strong><span>${value}</span></div>`)
      .join("")
  );
  setHTML(
    "[data-vehicle-usages]",
    vehicle.usages.map((usage) => `<a href="devis.html?type=${encodeURIComponent(getQuoteType(usage))}&vehicule=${encodeURIComponent(vehicle.slug)}">${usage}</a>`).join("")
  );
  setHTML(
    "[data-vehicle-related]",
    relatedVehicles
      .map(
        (item) => `
          <a class="vehicle-related-card" href="vehicule-${item.slug}.html">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <span>${item.year}</span>
            <strong>${item.name}</strong>
          </a>
        `
      )
      .join("")
  );

  if (sourceLink) {
    if (vehicle.sourceUrl) {
      sourceLink.href = vehicle.sourceUrl;
      sourceLink.hidden = false;
    } else {
      sourceLink.hidden = true;
    }
  }

  if (quoteLink) {
    quoteLink.href = `devis.html?type=${encodeURIComponent(getQuoteType(vehicle.usages[0]))}&vehicule=${encodeURIComponent(vehicle.slug)}`;
  }

  if (collectionLink) {
    collectionLink.href = "collection.html";
  }
};

renderVehicleDetail();
