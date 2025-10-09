// Filter functionality for products
let allProducts = [];

// Initialize filters
function initializeFilters() {
  // Category filters
  const categoryCheckboxes = document.querySelectorAll('.filter-category');
  categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
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
    ratingCheckbox.addEventListener('change', applyFilters);
  }
}

// Apply all filters
function applyFilters() {
  const productsContainer = document.getElementById('products-container');
  if (!productsContainer || allProducts.length === 0) return;

  // Get selected categories
  const selectedCategories = [];
  const categoryCheckboxes = document.querySelectorAll('.filter-category:checked');
  categoryCheckboxes.forEach(checkbox => {
    selectedCategories.push(checkbox.value);
  });

  // Get price range
  const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
  const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

  // Get rating filter
  const rating4Plus = document.getElementById('rating4').checked;

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    // Category filter
    let categoryMatch = true;
    if (selectedCategories.length > 0) {
      categoryMatch = product.categories.some(cat => selectedCategories.includes(cat));
    }

    // Price filter
    const priceMatch = product.price >= minPrice && product.price <= maxPrice;

    // Rating filter
    const ratingMatch = !rating4Plus || product.rating >= 4;

    return categoryMatch && priceMatch && ratingMatch;
  });

  // Display filtered products
  displayFilteredProducts(filteredProducts);
}

// Display filtered products
function displayFilteredProducts(products) {
  const productsContainer = document.getElementById('products-container');
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
  allProducts = await loadProductsData();
  
  // Wait a bit to ensure products are loaded
  if (allProducts.length === 0) {
    setTimeout(async () => {
      allProducts = await loadProductsData();
      initializeFilters();
    }, 500);
  } else {
    initializeFilters();
  }
}

// Expose function to be called from products.js
window.setAllProducts = function(products) {
  allProducts = products;
  initializeFilters();
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'product.html' || window.location.pathname.includes('product.html')) {
      loadAndStoreProducts();
    }
  });
} else {
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'product.html' || window.location.pathname.includes('product.html')) {
    loadAndStoreProducts();
  }
}