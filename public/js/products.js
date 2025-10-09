// Global variable to store products data
let productsData = [];

// Load products data from JSON file
async function loadProductsData() {
  try {
    // Try multiple possible paths for the JSON file
    const possiblePaths = ["data.json", "../data.json", "./data.json"];

    let response;
    let lastError;

    for (const path of possiblePaths) {
      try {
        console.log(`Trying to fetch from: ${path}`);
        response = await fetch(path);
        if (response.ok) {
          console.log(`Successfully fetched from: ${path}`);
          break;
        }
      } catch (error) {
        console.log(`Failed to fetch from ${path}:`, error.message);
        lastError = error;
        continue;
      }
    }

    if (!response || !response.ok) {
      throw lastError || new Error(`HTTP error! status: ${response?.status}`);
    }

    const data = await response.json();
    productsData = data.products;
    console.log("Products loaded:", productsData.length);
    return productsData;
  } catch (error) {
    console.error("Error loading products data:", error);
    return [];
  }
}

// Display all products on product.html page
async function displayProducts() {
  const productsContainer = document.getElementById("products-container");

  if (!productsContainer) return;

  // Show loading state
  productsContainer.innerHTML =
    '<div class="col-12"><div class="loading"></div></div>';

  const products = await loadProductsData();

  console.log("Loaded products:", products); // Debug log

  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.innerHTML =
      '<div class="col-12"><p class="text-center text-muted">Tidak ada produk yang ditemukan.</p></div>';
    return;
  }

  products.forEach((product) => {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
  });
}

// Create product card HTML element
function createProductCard(product) {
  const col = document.createElement("div");
  col.className = "col-md-4 col-sm-6 mb-4";

  const stars = "⭐".repeat(product.rating);
  const categories = product.categories.join(", ");

  col.innerHTML = `
        <div class="card shadow-sm product-card" onclick="goToProductDetail('${
          product.id
        }')">
            <img src="${product.image}" class="card-img-top" alt="${
    product.name
  }" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h6 class="card-title">${product.name}</h6>
                <p class="card-text text-success">Rp. ${product.price.toLocaleString(
                  "id-ID"
                )}</p>
                <p class="rating">${stars}</p>
                <small class="text-muted">${categories}</small>
            </div>
        </div>
    `;

  return col;
}

// Navigate to product detail page with ID parameter
function goToProductDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

// Get product by ID from URL parameter
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Display product detail on product-detail.html page
async function displayProductDetail() {
  const productId = getProductIdFromUrl();

  if (!productId) {
    document.getElementById("product-detail").innerHTML =
      '<div class="text-center"><h2>Produk tidak ditemukan</h2><p>ID produk tidak valid.</p></div>';
    return;
  }

  // Show loading state
  const productTitleElement = document.getElementById("product-title");
  const productPriceElement = document.getElementById("product-price");
  const productStockElement = document.getElementById("product-stock");
  const productCategoriesElement =
    document.getElementById("product-categories");
  const productDescriptionElement = document.getElementById(
    "product-description"
  );

  if (productTitleElement) productTitleElement.textContent = "Loading...";
  if (productPriceElement) productPriceElement.textContent = "Loading...";
  if (productStockElement) productStockElement.textContent = "Loading...";
  if (productCategoriesElement)
    productCategoriesElement.textContent = "Loading...";
  if (productDescriptionElement)
    productDescriptionElement.textContent = "Loading...";

  const products = await loadProductsData();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    document.getElementById("product-detail").innerHTML =
      '<div class="text-center"><h2>Produk tidak ditemukan</h2><p>Produk dengan ID tersebut tidak tersedia.</p></div>';
    return;
  }

  // Update page title
  document.title = `${product.name} - KuliNastra`;

  // Update product image
  const productImage = document.querySelector(".product-image img");
  if (productImage) {
    productImage.src = product.image;
    productImage.alt = product.name;
  }

  // Update product info
  const productTitleInfo = document.querySelector(".product-info h1");
  if (productTitleInfo) {
    productTitleInfo.textContent = product.name;
  }

  const productPriceInfo = document.querySelector(".product-info .price");
  if (productPriceInfo) {
    productPriceInfo.textContent = `Rp. ${product.price.toLocaleString(
      "id-ID"
    )}`;
  }

  // Update product details
  const stockValue = document.querySelector(".detail-row .value");
  if (stockValue) {
    stockValue.textContent = product.stock;
  }

  const categoryValue = document.querySelector(
    ".detail-row:nth-child(2) .value"
  );
  if (categoryValue) {
    categoryValue.textContent = product.categories
      .map((cat) => {
        const categoryNames = {
          manis: "Manis",
          gurih: "Gurih",
          nabati: "Nabati",
          hewani: "Hewani",
          jajan: "Jajan",
          "makanan-berat": "Makanan Berat",
        };
        return categoryNames[cat] || cat;
      })
      .join(", ");
  }

  // Update description
  const productDescriptionInfo = document.getElementById("product-description");
  if (productDescriptionInfo) {
    productDescriptionInfo.textContent = product.description;
  }

  // Update rating and comments
  const ratingStars = document.querySelector(".rating-section .stars");
  if (ratingStars) {
    ratingStars.textContent = "⭐".repeat(product.rating);
  }

  // Display comments
  displayComments(product.comments);

  // Update related products (show other products)
  displayRelatedProducts(productId);
}

// Display comments for a product
function displayComments(comments) {
  const commentsList = document.querySelector(".comments-list");
  if (!commentsList) return;

  commentsList.innerHTML = "";

  comments.forEach((comment) => {
    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";

    const stars = "⭐".repeat(comment.rating);

    commentItem.innerHTML = `
            <div class="comment-header">
                <div class="stars">${stars}</div>
                <div class="user-info">
                    <div class="user-avatar"></div>
                    <div class="user-details">
                        <div class="username">${comment.username}</div>
                        <div class="comment-text">${comment.text}</div>
                    </div>
                </div>
            </div>
        `;

    commentsList.appendChild(commentItem);
  });
}

// Display related products (other products excluding current one)
async function displayRelatedProducts(currentProductId) {
  const products = await loadProductsData();
  const relatedProducts = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  const relatedProductsContainer = document.querySelector(".products-grid");
  if (!relatedProductsContainer) return;

  relatedProductsContainer.innerHTML = "";

  relatedProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.onclick = () => goToProductDetail(product.id);

    const stars = "⭐".repeat(product.rating);

    productCard.innerHTML = `
            <img src="${product.image}" alt="${
      product.name
    }" style="width: 100%; height: 150px; object-fit: cover;">
            <div class="product-info-card">
                <h3>${product.name}</h3>
                <div class="product-price">Rp. ${product.price.toLocaleString(
                  "id-ID"
                )}</div>
                <div class="rating">
                    <span class="stars">${stars}</span>
                </div>
            </div>
        `;

    relatedProductsContainer.appendChild(productCard);
  });
}

// Tab functionality
function showTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => {
    content.classList.remove("active");
  });

  // Remove active class from all tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show selected tab content
  const selectedTabContent = document.getElementById(tabName);
  if (selectedTabContent) {
    selectedTabContent.classList.add("active");
  }

  // Add active class to clicked tab
  event.target.classList.add("active");
}

// Add comment functionality
function addComment() {
  const textarea = document.querySelector(".comment-form textarea");
  const commentText = textarea.value.trim();

  if (!commentText) {
    alert("Silakan masukkan komentar terlebih dahulu!");
    return;
  }

  // Here you would typically send the comment to a server
  // For now, we'll just show an alert
  alert(
    "Komentar berhasil ditambahkan! (Fitur ini memerlukan backend untuk menyimpan data)"
  );
  textarea.value = "";
}

// Initialize page based on current page
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded");
  const currentPage = window.location.pathname.split("/").pop();
  console.log("Current page:", currentPage);

  if (currentPage === "product.html") {
    console.log("Initializing product page");
    displayProducts();
  } else if (currentPage === "product-detail.html") {
    console.log("Initializing product detail page");
    displayProductDetail();
  } else {
    console.log("Unknown page, trying to initialize anyway");
    // Try to initialize based on URL
    if (window.location.pathname.includes("product.html")) {
      displayProducts();
    } else if (window.location.pathname.includes("product-detail.html")) {
      displayProductDetail();
    }
  }
});
