// Global variable untuk menyimpan data
let productsData = [];

// Load data product dari JSON
async function loadProductsData() {
  try {
    let response;
    response = await fetch("../app/data.json");

    let lastError;

    if (!response || !response.ok) {
      throw lastError || new Error(`HTTP error! status: ${response?.status}`);
    }

    const data = await response.json();
    productsData = data.products;
    console.log("Products loaded:", productsData.length);

    // Beritahu filter.js produk telah diload
    if (window.setAllProducts) {
      window.setAllProducts(productsData);
    }

    return productsData;
  } catch (error) {
    console.error("Error loading products data:", error);
    console.log("No fallback data available");
    return [];
  }
}

// Display all products
async function displayProducts() {
  const productsContainer = document.getElementById("products-container");

  if (!productsContainer) return;

  // Show loading
  productsContainer.innerHTML =
    '<div class="col-12"><div class="loading">Memuat produk...</div></div>';

  const products = await loadProductsData();

  console.log("Loaded products:", products); // Debugging
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

// Pindah ke halaman detail produk di section Produk Terkait
function goToProductDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

// Get product by ID from URL
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Display product detail on product-detail.html page
async function displayProductDetail() {
  const productId = getProductIdFromUrl();

  if (!productId) { // Invalid ID
    document.getElementById("product-detail").innerHTML =
      '<div class="text-center"><h2>Produk tidak ditemukan</h2><p>ID produk tidak valid.</p></div>';
    return;
  }

  // Show loading state
  const productTitleElement = document.getElementById("product-title");
  const productPriceElement = document.getElementById("product-price");
  const productStockElement = document.getElementById("product-stock");
  const productCategoriesElement = document.getElementById("product-categories");
  const productDescriptionElement = document.getElementById("product-description");

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

  // Load comments from localStorage
  loadCommentsFromStorage();

  // Update rating and comments
  const ratingStars = document.querySelector(".rating-section .stars");
  if (ratingStars) {
    ratingStars.textContent = "⭐".repeat(product.rating);
  }

  // Display comments (combine original + localStorage comments)
  displayComments(product.comments);

  // Update overall rating based on all comments
  updateOverallRating();

  // Initialize rating stars functionality
  initializeRatingStars();

  // Initialize character counter
  initializeCharCounter();

  // Update related products (show other products)
  displayRelatedProducts(productId);
}

// Display comments for a product
function displayComments(originalComments) {
  const commentsList = document.querySelector(".comments-list");
  if (!commentsList) return;

  // Combine original comments with localStorage comments
  const allComments = [...originalComments, ...comments];

  // Sort by date (newest first)
  allComments.sort((a, b) => new Date(b.date) - new Date(a.date));

  commentsList.innerHTML = "";

  if (allComments.length === 0) {
    commentsList.innerHTML =
      '<p style="text-align: center; color: #666; font-style: italic;">Belum ada komentar untuk produk ini.</p>';
    return;
  }

  allComments.forEach((comment) => {
    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";

    const stars = "⭐".repeat(comment.rating);

    // Check if comment is from localStorage (can be deleted)
    const isFromLocalStorage = comments.some((c) => c.id === comment.id);
    const deleteButton = isFromLocalStorage
      ? `<button class="delete-btn" onclick="deleteComment(${comment.id})" title="Hapus komentar"><i class="fa-solid fa-trash"></i></button>`
      : "";

    commentItem.innerHTML = `
            <div class="comment-header">
                <div class="stars">${stars}</div>
                <div class="user-info">
                    <div class="user-avatar"></div>
                    <div class="user-details">
                        <div class="username">${comment.username}</div>
                        <div class="comment-text">${comment.text}</div>
                        <div class="comment-date" style="font-size: 0.8em; color: #999; margin-top: 5px;">${comment.date}</div>
                    </div>
                </div>
                <div class="comment-actions">
                    ${deleteButton}
                </div>
            </div>
        `;

    commentsList.appendChild(commentItem);
  });

  // Add clear all button if there are localStorage comments
  if (comments.length > 0) {
    const clearAllBtn = document.createElement("button");
    clearAllBtn.className = "clear-all-btn";
    clearAllBtn.textContent = "Hapus Semua Komentar";
    clearAllBtn.onclick = clearAllComments;
    commentsList.appendChild(clearAllBtn);
  }
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

// Global variables for comment functionality
let selectedRating = 0;
let comments = [];

// Initialize rating stars functionality
function initializeRatingStars() {
  const stars = document.querySelectorAll(".rating-input .star");
  const ratingLabel = document.getElementById("rating-label");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      selectedRating = index + 1;
      updateStarDisplay();
      updateRatingLabel();
    });

    star.addEventListener("mouseenter", () => {
      highlightStars(index + 1);
    });
  });

  const ratingContainer = document.querySelector(".rating-input");
  ratingContainer.addEventListener("mouseleave", () => {
    updateStarDisplay();
  });
}

// Update star display based on selected rating
function updateStarDisplay() {
  const stars = document.querySelectorAll(".rating-input .star");
  stars.forEach((star, index) => {
    if (index < selectedRating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

// Highlight stars on hover
function highlightStars(rating) {
  const stars = document.querySelectorAll(".rating-input .star");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.style.color = "#FFD700";
    } else {
      star.style.color = "#ddd";
    }
  });
}

// Update rating label text
function updateRatingLabel() {
  const ratingLabel = document.getElementById("rating-label");
  const ratingTexts = {
    1: "Sangat Buruk",
    2: "Buruk",
    3: "Biasa",
    4: "Bagus",
    5: "Sangat Bagus",
  };

  if (selectedRating > 0) {
    ratingLabel.textContent = ratingTexts[selectedRating];
  } else {
    ratingLabel.textContent = "Pilih rating";
  }
}

// Initialize character counter
function initializeCharCounter() {
  const textarea = document.getElementById("comment-text");
  const charCount = document.getElementById("char-count");

  textarea.addEventListener("input", () => {
    const currentLength = textarea.value.length;
    charCount.textContent = `${currentLength}/500 karakter`;

    if (currentLength > 450) {
      charCount.style.color = "#e74c3c";
    } else {
      charCount.style.color = "#999";
    }
  });
}

// Load comments from localStorage
function loadCommentsFromStorage() {
  const productId = getProductIdFromUrl();
  if (!productId) return;

  const storedComments = localStorage.getItem(`comments_${productId}`);
  if (storedComments) {
    comments = JSON.parse(storedComments);
  }
}

// Save comments to localStorage
function saveCommentsToStorage() {
  const productId = getProductIdFromUrl();
  if (!productId) return;

  localStorage.setItem(`comments_${productId}`, JSON.stringify(comments));
}

// Add comment functionality
function addComment() {
  const usernameInput = document.getElementById("username");
  const commentTextarea = document.getElementById("comment-text");

  const username = usernameInput.value.trim() || "Anonim"; // Default to "Anonim" if empty
  const commentText = commentTextarea.value.trim();

  // Validation
  if (!commentText) {
    alert("Silakan masukkan komentar terlebih dahulu!");
    commentTextarea.focus();
    return;
  }

  if (selectedRating === 0) {
    alert("Silakan pilih rating terlebih dahulu!");
    return;
  }

  // Create new comment
  const newComment = {
    id: Date.now(), // Simple ID generation
    username: username,
    rating: selectedRating,
    text: commentText,
    date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
  };

  // Add to comments array
  comments.push(newComment);

  // Save to localStorage
  saveCommentsToStorage();

  // Update display
  const productId = getProductIdFromUrl();
  const product = productsData.find((p) => p.id === productId);
  if (product) {
    displayComments(product.comments);
    updateOverallRating();
  }

  // Clear form
  usernameInput.value = "";
  commentTextarea.value = "";
  selectedRating = 0;
  updateStarDisplay();
  updateRatingLabel();

  // Update character counter
  document.getElementById("char-count").textContent = "0/500 karakter";

  // Show success message
  showSuccessMessage("Komentar berhasil ditambahkan!");
}

// Delete comment functionality
function deleteComment(commentId) {
  if (confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
    // Remove comment from array
    comments = comments.filter((comment) => comment.id !== commentId);

    // Save updated comments to localStorage
    saveCommentsToStorage();

    // Update display
    const productId = getProductIdFromUrl();
    const product = productsData.find((p) => p.id === productId);
    if (product) {
      displayComments(product.comments);
      updateOverallRating();
    }

    // Show success message
    showSuccessMessage("Komentar berhasil dihapus!");
  }
}

// Clear all comments for current product
function clearAllComments() {
  if (
    confirm(
      "Apakah Anda yakin ingin menghapus semua komentar untuk produk ini?"
    )
  ) {
    const productId = getProductIdFromUrl();
    if (productId) {
      localStorage.removeItem(`comments_${productId}`);
      comments = [];

      // Update display
      const product = productsData.find((p) => p.id === productId);
      if (product) {
        displayComments(product.comments);
        updateOverallRating();
      }

      showSuccessMessage("Semua komentar berhasil dihapus!");
    }
  }
}

// Show success message
function showSuccessMessage(message) {
  // Create temporary success message
  const successDiv = document.createElement("div");
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 1000;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  successDiv.textContent = message;

  document.body.appendChild(successDiv);

  // Remove after 3 seconds
  setTimeout(() => {
    document.body.removeChild(successDiv);
  }, 3000);
}

// Update overall rating display
function updateOverallRating() {
  const productId = getProductIdFromUrl();
  if (!productId) return;

  // Get original product comments
  const product = productsData.find((p) => p.id === productId);
  if (!product) return;

  // Combine all comments
  const allComments = [...product.comments, ...comments];

  if (allComments.length === 0) {
    // Show original product rating if no comments
    const overallStars = document.getElementById("overall-stars");
    if (overallStars) {
      overallStars.textContent = "⭐".repeat(product.rating);
    }

    const ratingText = document.getElementById("rating-text");
    if (ratingText) {
      ratingText.textContent = "Berdasarkan komentar pengguna";
    }
    return;
  }

  const totalRating = allComments.reduce(
    (sum, comment) => sum + comment.rating,
    0
  );
  const averageRating = totalRating / allComments.length;
  const roundedRating = Math.round(averageRating);

  // Update stars display
  const overallStars = document.getElementById("overall-stars");
  if (overallStars) {
    overallStars.textContent = "⭐".repeat(roundedRating);
  }

  // Update rating text
  const ratingText = document.getElementById("rating-text");
  if (ratingText) {
    ratingText.textContent = `Rating rata-rata: ${averageRating.toFixed(
      1
    )} dari ${allComments.length} komentar`;
  }
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
