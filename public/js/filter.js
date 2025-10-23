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
      // Hanya close sidebar jika checkbox DI-CHECK (bukan di-uncheck)
      if (checkbox.checked) {
        setTimeout(() => closeFilterSidebar(), 300);
      }
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
      // Hanya close sidebar jika checkbox DI-CHECK (bukan di-uncheck)
      if (ratingCheckbox.checked) {
        setTimeout(() => closeFilterSidebar(), 300);
      }
    });
  }
  
  console.log("Filters initialized successfully");
}

// Close filter sidebar (only when user selects an option)
function closeFilterSidebar() {
  const filterColumn = document.querySelector('.col-md-3');
  if (!filterColumn || !filterColumn.querySelector('.filter-box')) return;
  
  const filterIconSpan = document.querySelector('#filter-prefix-badge #filter-icon');
  
  filterColumn.style.display = 'none';
  if (filterIconSpan) filterIconSpan.textContent = '▼';
  isFilterOpen = false;
  console.log("Filter sidebar closed after selection");
}

// Open filter sidebar (ketika badge dihapus)
function openFilterSidebar() {
  const filterColumn = document.querySelector('.col-md-3');
  if (!filterColumn || !filterColumn.querySelector('.filter-box')) return;
  
  const filterIconSpan = document.querySelector('#filter-prefix-badge #filter-icon');
  
  filterColumn.style.display = 'block';
  if (filterIconSpan) filterIconSpan.textContent = '▲';
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
  
  const filterIconSpan = document.querySelector('#filter-prefix-badge #filter-icon');
  
  if (isFilterOpen) {
    filterColumn.style.display = 'none';
    if (filterIconSpan) filterIconSpan.textContent = '▼';
    isFilterOpen = false;
    console.log("Filter panel closed");
  } else {
    filterColumn.style.display = 'block';
    if (filterIconSpan) filterIconSpan.textContent = '▲';
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

  // Filter products - FIXED: Using every() instead of some()
  const filteredProducts = allProducts.filter(product => {
    let categoryMatch = true;
    if (selectedCategories.length > 0) {
      // Produk harus memiliki SEMUA kategori yang dipilih (AND logic)
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
  
  // Then update badges - ini penting dilakukan setelah display
  updateFilterBadges(selectedCategories, minPrice, maxPrice, rating4Plus);
}

// Update filter badges
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
    // Buka kembali sidebar filter agar user bisa memilih filter lagi
    const filterColumn = document.querySelector('.col-md-3');
    if (filterColumn) {
      filterColumn.style.display = 'block';
      isFilterOpen = true;
    }
    return;
  }
  
  // Cek apakah prefix badge sudah ada, jika belum buat baru
  let prefixBadge = document.getElementById('filter-prefix-badge');
  const needsRebuild = !prefixBadge;
  
  if (needsRebuild) {
    badgeContainer.innerHTML = '';
  } else {
    // Hapus semua badge kecuali prefix badge
    const badges = badgeContainer.querySelectorAll('span:not(#filter-prefix-badge)');
    badges.forEach(badge => badge.remove());
  }
  
  badgeContainer.style.display = 'flex';
  console.log("Showing badge container with filters");
  
  // Hanya buat prefix badge jika belum ada
  if (needsRebuild) {
    prefixBadge = document.createElement('span');
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
    
    // Set icon berdasarkan status sidebar
    const iconText = isFilterOpen ? '▲' : '▼';
    prefixBadge.innerHTML = `<span id="filter-icon" style="margin-right: 3px;">${iconText}</span> Filters <span style="margin: 0 5px;">›</span>`;
    
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
  } else {
    // Update icon saat badge sudah ada
    const filterIconSpan = prefixBadge.querySelector('#filter-icon');
    if (filterIconSpan) {
      filterIconSpan.textContent = isFilterOpen ? '▲' : '▼';
    }
  }
  
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
        // Gunakan requestAnimationFrame untuk memastikan DOM update selesai
        requestAnimationFrame(() => {
          applyFilters();
        });
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
      // Gunakan requestAnimationFrame untuk memastikan DOM update selesai
      requestAnimationFrame(() => {
        applyFilters();
      });
    });
    badgeContainer.appendChild(badge);
  }
  
  if (rating4Plus) {
    const badge = createFilterBadge('Rating ⭐ 4+', () => {
      const ratingCheckbox = document.getElementById('rating4');
      if (ratingCheckbox) {
        ratingCheckbox.checked = false;
        console.log('Unchecked rating filter');
        // Gunakan requestAnimationFrame untuk memastikan DOM update selesai
        requestAnimationFrame(() => {
          applyFilters();
        });
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
    // Jangan buka sidebar saat badge diklik
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
    // Gunakan fungsi createProductCard dari products.js jika ada
    if (typeof createProductCard === 'function') {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    } else {
      // Fallback: buat card sendiri jika fungsi tidak tersedia
      const col = document.createElement('div');
      col.className = 'col-md-4 col-sm-6 mb-4';
      
      const stars = '⭐'.repeat(product.rating);
      const categories = product.categories.join(', ');
      
      col.innerHTML = `
        <div class="card shadow-sm product-card" onclick="goToProductDetail('${product.id}')">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h6 class="card-title">${product.name}</h6>
            <p class="card-text text-success">Rp. ${product.price.toLocaleString('id-ID')}</p>
            <p class="rating">${stars}</p>
            <small class="text-muted">${categories}</small>
          </div>
        </div>
      `;
      
      productsContainer.appendChild(col);
    }
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