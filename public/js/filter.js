// ========================================
// FILTER FUNCTIONALITY FOR PRODUCTS
// ========================================

// Global variables
let allProducts = [];
let isFilterOpen = true;

// ========================================
// INITIALIZE FILTERS
// ========================================
function initializeFilters() {
  console.log("Initializing filters...");
  
  // Create filter badge container first
  createFilterBadgeContainer();
  
  // Category filters
  const categoryCheckboxes = document.querySelectorAll('.filter-category');
  console.log("Found category checkboxes:", categoryCheckboxes.length);
  
  categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      console.log("Category checkbox changed:", checkbox.value, checkbox.checked);
      applyFilters();
      // Close sidebar only if checkbox is CHECKED (not unchecked)
      if (checkbox.checked) {
        setTimeout(() => closeFilterSidebar(), 300);
      }
    });
  });

  // Price filters
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  
  if (minPriceInput) {
    minPriceInput.addEventListener('input', applyFilters);
  }
  if (maxPriceInput) {
    maxPriceInput.addEventListener('input', applyFilters);
  }

  // Rating filter
  const ratingCheckbox = document.getElementById('rating4');
  if (ratingCheckbox) {
    ratingCheckbox.addEventListener('change', () => {
      console.log("Rating checkbox changed:", ratingCheckbox.checked);
      applyFilters();
      // Close sidebar only if checkbox is CHECKED
      if (ratingCheckbox.checked) {
        setTimeout(() => closeFilterSidebar(), 300);
      }
    });
  }
  
  console.log("Filters initialized successfully");
}

// ========================================
// CLOSE FILTER SIDEBAR
// ========================================
function closeFilterSidebar() {
  const filterSidebar = document.getElementById('filter-sidebar');
  const productsColumn = document.getElementById('products-column');
  
  if (!filterSidebar) return;
  
  filterSidebar.classList.add('hidden');
  if (productsColumn) {
    productsColumn.classList.add('full-width');
  }
  
  const filterIconSpan = document.querySelector('#filter-icon');
  if (filterIconSpan) filterIconSpan.textContent = '▼';
  
  isFilterOpen = false;
  console.log("Filter sidebar closed after selection");
}

// ========================================
// OPEN FILTER SIDEBAR
// ========================================
function openFilterSidebar() {
  const filterSidebar = document.getElementById('filter-sidebar');
  const productsColumn = document.getElementById('products-column');
  
  if (!filterSidebar) return;
  
  filterSidebar.classList.remove('hidden');
  if (productsColumn) {
    productsColumn.classList.remove('full-width');
  }
  
  const filterIconSpan = document.querySelector('#filter-icon');
  if (filterIconSpan) filterIconSpan.textContent = '▲';
  
  isFilterOpen = true;
  console.log("Filter sidebar opened after badge removed");
}

// ========================================
// TOGGLE FILTER PANEL
// ========================================
function toggleFilterPanel() {
  if (isFilterOpen) {
    closeFilterSidebar();
  } else {
    openFilterSidebar();
  }
}

// ========================================
// CREATE FILTER BADGE CONTAINER
// ========================================
function createFilterBadgeContainer() {
  const productsColumn = document.getElementById('products-column');
  if (!productsColumn) {
    console.log("Products column not found");
    return;
  }
  
  let badgeContainer = document.getElementById('filter-badge-container');
  if (badgeContainer) {
    console.log("Badge container already exists");
    return;
  }
  
  badgeContainer = document.createElement('div');
  badgeContainer.id = 'filter-badge-container';
  productsColumn.insertBefore(badgeContainer, productsColumn.firstChild);
  
  console.log("Badge container created");
}

// ========================================
// APPLY ALL FILTERS
// ========================================
function applyFilters() {
  console.log("Applying filters...");
  const productsContainer = document.getElementById('products-container');
  if (!productsContainer) {
    console.log("Products container not found");
    return;
  }
  
  if (allProducts.length === 0) {
    console.log("No products loaded yet");
    return;
  }

  // Get selected categories
  const selectedCategories = [];
  const categoryCheckboxes = document.querySelectorAll('.filter-category:checked');
  categoryCheckboxes.forEach(checkbox => {
    selectedCategories.push(checkbox.value);
  });

  // Get price range
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const minPrice = parseFloat(minPriceInput?.value) || 0;
  const maxPrice = parseFloat(maxPriceInput?.value) || Infinity;

  // Get rating filter
  const ratingCheckbox = document.getElementById('rating4');
  const rating4Plus = ratingCheckbox?.checked || false;

  console.log("Selected categories:", selectedCategories);
  console.log("Price range:", minPrice, maxPrice);
  console.log("Rating 4+:", rating4Plus);

  // Filter products - Using every() for AND logic
  const filteredProducts = allProducts.filter(product => {
    let categoryMatch = true;
    if (selectedCategories.length > 0) {
      // Product must have ALL selected categories (AND logic)
      categoryMatch = selectedCategories.every(selectedCat => 
        product.categories.includes(selectedCat)
      );
    }

    const priceMatch = product.price >= minPrice && product.price <= maxPrice;
    const ratingMatch = !rating4Plus || product.rating >= 4;

    return categoryMatch && priceMatch && ratingMatch;
  });

  console.log("Filtered products:", filteredProducts.length, "out of", allProducts.length);
  
  // Display products first
  displayFilteredProducts(filteredProducts);
  
  // Then update badges
  updateFilterBadges(selectedCategories, minPrice, maxPrice, rating4Plus);
}

// ========================================
// UPDATE FILTER BADGES
// ========================================
function updateFilterBadges(selectedCategories, minPrice, maxPrice, rating4Plus) {
  const badgeContainer = document.getElementById('filter-badge-container');
  if (!badgeContainer) {
    console.log("Badge container not found for update");
    return;
  }
  
  const hasActiveFilters = selectedCategories.length > 0 || 
                          minPrice > 0 || 
                          maxPrice < Infinity || 
                          rating4Plus;
  
  if (!hasActiveFilters) {
    badgeContainer.style.display = 'none';
    badgeContainer.innerHTML = '';
    console.log("No active filters, hiding badge container");
    // Reopen filter sidebar so user can select filters again
    openFilterSidebar();
    return;
  }
  
  // Check if prefix badge already exists
  let prefixBadge = document.getElementById('filter-prefix-badge');
  const needsRebuild = !prefixBadge;
  
  if (needsRebuild) {
    badgeContainer.innerHTML = '';
  } else {
    // Remove all badges except prefix badge
    const badges = badgeContainer.querySelectorAll('span:not(#filter-prefix-badge)');
    badges.forEach(badge => badge.remove());
  }
  
  badgeContainer.style.display = 'flex';
  console.log("Showing badge container with filters");
  
  // Create prefix badge only if it doesn't exist
  if (needsRebuild) {
    prefixBadge = document.createElement('span');
    prefixBadge.id = 'filter-prefix-badge';
    
    // Filter icon SVG
    const filterIcon = `<svg class="filter-icon-svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
    </svg>`;
    
    prefixBadge.innerHTML = `${filterIcon}<span>Filters</span><span class="badge-separator">›</span>`;
    
    badgeContainer.appendChild(prefixBadge);
  }
  
  // Category names mapping
  const categoryNames = {
    'manis': 'Manis',
    'gurih': 'Gurih',
    'nabati': 'Nabati',
    'hewani': 'Hewani',
    'jajan': 'Jajan',
    'makanan-berat': 'Makanan Berat'
  };
  
  // Add category badges
  selectedCategories.forEach(category => {
    const badge = createFilterBadge(categoryNames[category] || category, () => {
      const checkbox = document.getElementById(category);
      if (checkbox) {
        checkbox.checked = false;
        console.log(`Unchecked category: ${category}`);
        // Use requestAnimationFrame to ensure DOM update is complete
        requestAnimationFrame(() => {
          applyFilters();
        });
      }
    });
    badgeContainer.appendChild(badge);
  });
  
  // Add price badge
  if (minPrice > 0 || maxPrice < Infinity) {
    let priceText = '';
    if (minPrice > 0 && maxPrice < Infinity) {
      priceText = `Rp ${minPrice.toLocaleString('id-ID')} - Rp ${maxPrice.toLocaleString('id-ID')}`;
    } else if (minPrice > 0) {
      priceText = `Min Rp ${minPrice.toLocaleString('id-ID')}`;
    } else {
      priceText = `Max Rp ${maxPrice.toLocaleString('id-ID')}`;
    }
    
    const badge = createFilterBadge(priceText, () => {
      const minPriceInput = document.getElementById('min-price');
      const maxPriceInput = document.getElementById('max-price');
      if (minPriceInput) minPriceInput.value = '';
      if (maxPriceInput) maxPriceInput.value = '';
      console.log('Cleared price filters');
      // Use requestAnimationFrame to ensure DOM update is complete
      requestAnimationFrame(() => {
        applyFilters();
      });
    });
    badgeContainer.appendChild(badge);
  }
  
  // Add rating badge
  if (rating4Plus) {
    const badge = createFilterBadge('Rating ⭐ 4+', () => {
      const ratingCheckbox = document.getElementById('rating4');
      if (ratingCheckbox) {
        ratingCheckbox.checked = false;
        console.log('Unchecked rating filter');
        // Use requestAnimationFrame to ensure DOM update is complete
        requestAnimationFrame(() => {
          applyFilters();
        });
      }
    });
    badgeContainer.appendChild(badge);
  }
}

// ========================================
// CREATE INDIVIDUAL FILTER BADGE
// ========================================
function createFilterBadge(text, onRemove) {
  const badge = document.createElement('span');
  badge.className = 'filter-badge';
  
  badge.innerHTML = `
    ${text}
    <span style="margin-left: 8px; font-weight: bold; font-size: 14px;">×</span>
  `;
  
  badge.addEventListener('click', () => {
    onRemove();
  });
  
  badge.addEventListener('mouseenter', () => {
    badge.style.backgroundColor = '#c8e6c9';
    badge.style.borderColor = '#388e3c';
  });
  
  badge.addEventListener('mouseleave', () => {
    badge.style.backgroundColor = '#e8f5e9';
    badge.style.borderColor = '#4CAF50';
  });
  
  return badge;
}

// ========================================
// DISPLAY FILTERED PRODUCTS
// ========================================
function displayFilteredProducts(products) {
  const productsContainer = document.getElementById('products-container');
  if (!productsContainer) {
    console.log("Products container not found");
    return;
  }
  
  productsContainer.innerHTML = '';

  if (products.length === 0) {
    productsContainer.innerHTML = '<div class="text-center text-muted" style="grid-column: 1 / -1; padding: 40px;">Tidak ada produk yang sesuai dengan filter.</div>';
    return;
  }

  products.forEach(product => {
    // Use createProductCard function from products.js if available
    if (typeof createProductCard === 'function') {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    } else {
      // Fallback: create card manually if function not available
      const wrapper = document.createElement('div');
      wrapper.className = 'product-card-wrapper';
      wrapper.onclick = () => {
        window.location.href = `product-detail.html?id=${product.id}`;
      };
      
      const stars = '⭐'.repeat(product.rating);
      const categoryNames = {
        'manis': 'Manis',
        'gurih': 'Gurih',
        'nabati': 'Nabati',
        'hewani': 'Hewani',
        'jajan': 'Jajan',
        'makanan-berat': 'Makanan Berat'
      };
      const categories = product.categories
        .map(cat => categoryNames[cat] || cat)
        .join(', ');
      
      wrapper.innerHTML = `
        <div class="product-image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/200x200?text=No+Image'">
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
          <p class="product-rating">${stars}</p>
          <p class="product-categories">${categories}</p>
        </div>
      `;
      
      productsContainer.appendChild(wrapper);
    }
  });
}

// ========================================
// LOAD AND STORE PRODUCTS
// ========================================
async function loadAndStoreProducts() {
  console.log("Loading and storing products...");
  allProducts = await loadProductsData();
  
  if (allProducts.length === 0) {
    console.log("No products loaded, retrying...");
    setTimeout(async () => {
      allProducts = await loadProductsData();
      if (allProducts.length > 0) {
        initializeFilters();
      }
    }, 500);
  } else {
    console.log("Products loaded successfully:", allProducts.length);
    initializeFilters();
  }
}

// ========================================
// WINDOW FUNCTION TO SET PRODUCTS
// ========================================
window.setAllProducts = function(products) {
  console.log("Setting all products from products.js:", products.length);
  allProducts = products;
  initializeFilters();
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, checking page...");
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'product.html' || window.location.pathname.includes('product.html') || currentPage === '') {
      console.log("On product page, loading products...");
      setTimeout(() => {
        loadAndStoreProducts();
      }, 100);
    }
  });
} else {
  console.log("DOM already loaded, checking page...");
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'product.html' || window.location.pathname.includes('product.html') || currentPage === '') {
    console.log("On product page, loading products...");
    setTimeout(() => {
      loadAndStoreProducts();
    }, 100);
  }
}

// ========================================
// LOG INITIALIZATION
// ========================================
console.log("filter.js loaded successfully");