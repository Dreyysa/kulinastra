let allProducts = [];
let isFilterOpen = true;

// === Inisialisasi ===
function initializeFilters() {
  createFilterBadgeContainer();

  // Checkbox kategori
  const categoryCheckboxes = document.querySelectorAll(".filter-category");
  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      applyFilters();
    });
  });

  // Input harga
  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  if (minPriceInput) minPriceInput.addEventListener("input", applyFilters);
  if (maxPriceInput) maxPriceInput.addEventListener("input", applyFilters);

  // Checkbox rating
  const ratingCheckbox = document.getElementById("rating4");
  if (ratingCheckbox) {
    ratingCheckbox.addEventListener("change", () => {
      applyFilters();
    });
  }
}

// === Membuat container badge ===
function createFilterBadgeContainer() {
  const productsContainer = document.getElementById("products-container");
  if (!productsContainer) return;

  let badgeContainer = document.getElementById("filter-badge-container");
  if (!badgeContainer) {
    badgeContainer = document.createElement("div");
    badgeContainer.id = "filter-badge-container";
    productsContainer.parentElement.insertBefore(
      badgeContainer,
      productsContainer
    );
  }
}

// Show filter
function openFilterSidebar() {
  const filterColumn = document.querySelector(".col-md-3");
  if (!filterColumn) return;
  filterColumn.style.display = "block";
  isFilterOpen = true;
}

// Apply filter
function applyFilters() {
  const selectedCategories = [];
  document.querySelectorAll(".filter-category:checked").forEach((cb) => {
    selectedCategories.push(cb.value);
  });

  const minPrice = parseFloat(document.getElementById("min-price")?.value) || 0;
  const maxPrice =
    parseFloat(document.getElementById("max-price")?.value) || Infinity;
  const rating4Plus = document.getElementById("rating4")?.checked || false;

  const filteredProducts = allProducts.filter((p) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.every((cat) => p.categories.includes(cat));
    const priceMatch = p.price >= minPrice && p.price <= maxPrice;
    const ratingMatch = !rating4Plus || p.rating >= 4;
    return categoryMatch && priceMatch && ratingMatch;
  });

  displayFilteredProducts(filteredProducts);
  updateFilterBadges(selectedCategories, minPrice, maxPrice, rating4Plus);
}

// Update tampilan badge
function updateFilterBadges(
  selectedCategories,
  minPrice,
  maxPrice,
  rating4Plus
) {
  const badgeContainer = document.getElementById("filter-badge-container");
  if (!badgeContainer) return;

  badgeContainer.style.display = "flex";
  badgeContainer.innerHTML = "";

  // Filter text dengan icon
  const prefix = document.createElement("span");
  prefix.className = "filter-label";
  prefix.style.cursor = "pointer";
  prefix.innerHTML = `
    <img src="../public/assets/images/icons/filter-icon.svg" alt="Filter Icon" style="width:20px; height:20px; margin-bottom:4px;">
    </img>
    Filters
  `;
  prefix.addEventListener("click", openFilterSidebar);
  badgeContainer.appendChild(prefix);

  const arrow = document.createElement("span");
  arrow.className = "filter-arrow";
  arrow.textContent = "›";
  badgeContainer.appendChild(arrow);

  const categoryNames = {
    manis: "Manis",
    gurih: "Gurih",
    nabati: "Nabati",
    hewani: "Hewani",
    jajan: "Jajan",
    "makanan-berat": "Makanan Berat",
  };

  // Tambahkan icon '›'
  const createClosableBadge = (text) => {
    const item = document.createElement("span");
    item.className = "filter-breadcrumb-item";
    item.innerHTML = `${text} <span class="close-icon">›</span>`;

    return item;
  };

  selectedCategories.forEach((cat) => {
    const badge = createClosableBadge(categoryNames[cat] || cat, () => {
      const cb = document.getElementById(cat);
      if (cb) cb.checked = false;
      applyFilters();
    });
    badgeContainer.appendChild(badge);
  });

  if (minPrice > 0 || maxPrice < Infinity) {
    let priceText = "";
    if (minPrice > 0 && maxPrice < Infinity)
      priceText = `Rp ${minPrice.toLocaleString(
        "id-ID"
      )} - Rp ${maxPrice.toLocaleString("id-ID")}`;
    else if (minPrice > 0)
      priceText = `Min Rp ${minPrice.toLocaleString("id-ID")}`;
    else priceText = `Max Rp ${maxPrice.toLocaleString("id-ID")}`;

    const badge = createClosableBadge(priceText, () => {
      document.getElementById("min-price").value = "";
      document.getElementById("max-price").value = "";
      applyFilters();
    });
    badgeContainer.appendChild(badge);
  }

  if (rating4Plus) {
    const badge = createClosableBadge("Rating ⭐ 4+", () => {
      const r = document.getElementById("rating4");
      if (r) r.checked = false;
      applyFilters();
    });
    badgeContainer.appendChild(badge);
  }
}

// Tampilkan produk
function displayFilteredProducts(products) {
  const container = document.getElementById("products-container");
  if (!container) return;
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML =
      '<div class="col-12 text-center text-muted">Tidak ada produk yang sesuai.</div>';
    return;
  }

  products.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col-md-4 col-sm-6 mb-4";
    const stars = "⭐".repeat(p.rating);
    const categories = p.categories.join(", ");
    col.innerHTML = `
      <div class="card shadow-sm product-card" onclick="goToProductDetail('${
        p.id
      }')">
        <img src="${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body">
          <h6 class="card-title">${p.name}</h6>
          <p class="card-text text-success">Rp. ${p.price.toLocaleString(
            "id-ID"
          )}</p>
          <p class="rating">${stars}</p>
          <small class="text-muted">${categories}</small>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// Navigasi ke detail produk
function goToProductDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

//Load produk dan set allProducts
async function loadAndStoreProducts() {
  if (typeof loadProductsData === "function") {
    allProducts = await loadProductsData();
    displayFilteredProducts(allProducts);
  }
  initializeFilters();
}

// Ekspor ke global
window.setAllProducts = function (products) {
  allProducts = products;
  displayFilteredProducts(products);
};

document.addEventListener("DOMContentLoaded", () => {
  loadAndStoreProducts();
});
