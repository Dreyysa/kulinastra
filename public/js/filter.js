// Filter functionality for products
let allProducts = [];
let isFilterOpen = false;

// Initialize filters
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
      // Auto-close filter sidebar when checkbox is clicked
      setTimeout(() => closeFilterSidebar(), 300);
    });
  });

  // Price filters (hapus auto-close saat blur)
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
      setTimeout(() => closeFilterSidebar(), 300);
    });
  }
  
  console.log("Filters initialized successfully");
}

// Close filter sidebar (only when user selects an option)
function closeFilterSidebar() {
  const filterColumn = document.querySelector('.col-md-3');
  if (!filterColumn || !filterColumn.querySelector('.filter-box')) return;
  
  const filterIcon = document.getElementById('filter-icon');
  
  filterColumn.style.display = 'none';
  if (filterIcon) filterIcon.textContent = '▼';
  isFilterOpen = false;
  console.log("Filter sidebar closed after selection");
}

// Open filter sidebar (ketika badge dihapus)
function openFilterSidebar() {
  const filterColumn = document.querySelector('.col-md-3');
  if (!filterColumn || !filterColumn.querySelector('.filter-box')) return;
  
  const filterIcon = document.getElementById('filter-icon');
  
  filterColumn.style.display = 'block';
  if (filterIcon) filterIcon.textContent = '▲';
  isFilterOpen = true;
  console.log("Filter sidebar opened after badge removed");
}

// Create filter badge container
function createFilterBadgeContainer() {
  const productsContainer = document.getElementById('products-container');
  if (!productsContainer) {
    console.log("Products container not found");
    return;
  }
  
  let badgeContainer = document.getElementById('filter-badge-container');
  if (badgeContainer) {
    console.log("Badge container already exists");
    return;
  }
  
  badgeContainer = document.createElement('div');
  badgeContainer.id = 'filter-badge-container';
  badgeContainer.className = 'mb-3';
  badgeContainer.style.cssText = `
    margin-bottom: 15px;
    padding: 10px 0;
    display: none;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  `;
  
  productsContainer.parentElement.insertBefore(badgeContainer, productsContainer);
  console.log("Badge container created");
}

// Toggle filter panel
function toggleFilterPanel() {
  const filterColumn = document.querySelector('.col-md-3');
  if (!filterColumn || !filterColumn.querySelector('.filter-box')) return;
  
  const filterIcon = document.getElementById('filter-icon');
  
  if (isFilterOpen) {
    filterColumn.style.display = 'none';
    if (filterIcon) filterIcon.textContent = '▼';
    isFilterOpen = false;
    console.log("Filter panel closed");
  } else {
    filterColumn.style.display = 'block';
    if (filterIcon) filterIcon.textContent = '▲';
    isFilterOpen = true;
    console.log("Filter panel opened");
  }
}

// Apply all filters
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

  // Update filter badges
  updateFilterBadges(selectedCategories, minPrice, maxPrice, rating4Plus);

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    let categoryMatch = true;
    if (selectedCategories.length > 0) {
      categoryMatch = product.categories.some(cat => selectedCategories.includes(cat));
    }

    const priceMatch = product.price >= minPrice && product.price <= maxPrice;
    const ratingMatch = !rating4Plus || product.rating >= 4;

    return categoryMatch && priceMatch && ratingMatch;
  });

  console.log("Filtered products:", filteredProducts.length, "out of", allProducts.length);
  displayFilteredProducts(filteredProducts);
}

// Update filter badges
function updateFilterBadges(selectedCategories, minPrice, maxPrice, rating4Plus) {
  const badgeContainer = document.getElementById('filter-badge-container');
  if (!badgeContainer) {
    console.log("Badge container not found for update");
    return;
  }
  
  badgeContainer.innerHTML = '';
  
  const hasActiveFilters = selectedCategories.length > 0 || 
                          minPrice > 0 || 
                          maxPrice < Infinity || 
                          rating4Plus;
  
  if (!hasActiveFilters) {
    badgeContainer.style.display = 'none';
    console.log("No active filters, hiding badge container");
    return;
  }
  
  badgeContainer.style.display = 'flex';
  console.log("Showing badge container with filters");
  
  const prefixBadge = document.createElement('span');
  prefixBadge.id = 'filter-prefix-badge';
  prefixBadge.style.cssText = `
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    background-color: transparent;
    color: #333;
    font-size: 14px;
    font-weight: 500;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  `;
  prefixBadge.innerHTML = '<span id="filter-icon" style="margin-right: 3px;">▼</span> Filters <span style="margin: 0 5px;">›</span>';
  
  prefixBadge.addEventListener('click', () => {
    console.log("Prefix badge clicked");
    toggleFilterPanel();
  });
  
  prefixBadge.addEventListener('mouseenter', () => {
    prefixBadge.style.backgroundColor = '#f0f0f0';
  });
  prefixBadge.addEventListener('mouseleave', () => {
    prefixBadge.style.backgroundColor = 'transparent';
  });
  
  badgeContainer.appendChild(prefixBadge);
  
  const categoryNames = {
    'manis': 'Manis',
    'gurih': 'Gurih',
    'nabati': 'Nabati',
    'hewani': 'Hewani',
    'jajan': 'Jajan',
    'makanan-berat': 'Makanan Berat'
  };
  
  selectedCategories.forEach(category => {
    const badge = createFilterBadge(categoryNames[category] || category, () => {
      const checkbox = document.getElementById(category);
      if (checkbox) {
        checkbox.checked = false;
        console.log(`Unchecked category: ${category}`);
        applyFilters();
      }
    });
    badgeContainer.appendChild(badge);
  });
  
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
      applyFilters();
      openFilterSidebar(); // buka sidebar setelah badge harga dihapus
    });
    badgeContainer.appendChild(badge);
  }
  
  if (rating4Plus) {
    const badge = createFilterBadge('Rating ⭐ 4+', () => {
      const ratingCheckbox = document.getElementById('rating4');
      if (ratingCheckbox) {
        ratingCheckbox.checked = false;
        console.log('Unchecked rating filter');
        applyFilters();
        openFilterSidebar(); // buka sidebar setelah rating dihapus
      }
    });
    badgeContainer.appendChild(badge);
  }
}

// Create individual filter badge
function createFilterBadge(text, onRemove) {
  const badge = document.createElement('span');
  badge.style.cssText = `
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    background-color: #e8f5e9;
    color: #2e7d32;
    font-size: 13px;
    font-weight: 500;
    border-radius: 16px;
    border: 1px solid #4CAF50;
    cursor: pointer;
    transition: all 0.2s;
  `;
  
  badge.innerHTML = `
    ${text}
    <span style="margin-left: 8px; font-weight: bold; font-size: 14px;">×</span>
  `;
  
  badge.addEventListener('click', () => {
    onRemove();
    openFilterSidebar(); // buka sidebar lagi setelah badge dihapus
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

// Display filtered products
function displayFilteredProducts(products) {
  const productsContainer = document.getElementById('products-container');
  if (!productsContainer) {
    console.log("Products container not found");
    return;
  }
  
  productsContainer.innerHTML = '';

  if (products.length === 0) {
    productsContainer.innerHTML = '<div class="col-12"><p class="text-center text-muted">Tidak ada produk yang sesuai dengan filter.</p></div>';
    return;
  }

  products.forEach(product => {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
  });
}

// Store products data when loaded
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

window.setAllProducts = function(products) {
  console.log("Setting all products from products.js:", products.length);
  allProducts = products;
  initializeFilters();
}

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
