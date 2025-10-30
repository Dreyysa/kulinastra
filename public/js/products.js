// ========================================
// GLOBAL VARIABLE - SINGLE SOURCE OF TRUTH
// ========================================
let productsData = [];
let isDataLoaded = false;

// ========================================
// LOAD DATA (ONCE) - WITH CACHING
// ========================================
async function loadProductsData() {
  // Cek cache - jika sudah load, langsung return
  if (isDataLoaded && productsData.length > 0) {
    console.log("Using cached products data");
    return productsData;
  }

  try {
    const response = await fetch("../app/data.json");
    const data = await response.json();
    productsData = data.products;
    isDataLoaded = true;
    
    console.log("Products loaded:", productsData.length);

    // Notify filter.js bahwa data sudah ready
    if (window.onProductsLoaded) {
      window.onProductsLoaded(productsData);
    }

    return productsData;

  } catch (error) {
    console.error("Error loading products data:", error);
    return [];
  }
}

// ========================================
// DISPLAY PRODUCTS (product.html)
// ========================================
async function displayProducts() {
  const productsContainer = document.getElementById("products-container");
  if (!productsContainer) return;

  // Show loading
  productsContainer.innerHTML =
    '<div class="col-12"><div class="loading">Memuat produk...</div></div>';

  const products = await loadProductsData();
  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.innerHTML =
      '<div class="col-12"><p class="text-center text-muted">Tidak ada produk yang ditemukan.</p></div>';
    return;
  }

  // Filter.js akan handle display setelah ini
}

// ========================================
// NAVIGATION - GLOBAL FUNCTION
// ========================================
window.goToProductDetail = function(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
};

// ========================================
// GET PRODUCT BY ID
// ========================================
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// ========================================
// DISPLAY PRODUCT DETAIL (product-detail.html)
// ========================================
async function displayProductDetail() {
  const productId = getProductIdFromUrl();

  if (!productId) {
    document.getElementById("product-detail").innerHTML =
      '<div class="text-center"><h2>Produk tidak ditemukan</h2><p>ID produk tidak valid.</p></div>';
    return;
  }

  // Show loading state
  showLoadingState();

  const products = await loadProductsData();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    document.getElementById("product-detail").innerHTML =
      '<div class="text-center"><h2>Produk tidak ditemukan</h2><p>Produk dengan ID tersebut tidak tersedia.</p></div>';
    return;
  }

  // Update all product information
  updateProductDisplay(product);
  
  // Load comments from localStorage
  loadCommentsFromStorage();
  
  // Display comments
  displayComments(product.comments);
  
  // Update rating
  updateOverallRating();
  
  // Initialize features
  initializeRatingStars();
  initializeCharCounter();
  
  // Display related products
  displayRelatedProducts(productId);
}

// ========================================
// HELPER: Show Loading State
// ========================================
function showLoadingState() {
  const elements = {
    title: document.getElementById("product-title"),
    price: document.getElementById("product-price"),
    stock: document.getElementById("product-stock"),
    categories: document.getElementById("product-categories"),
    description: document.getElementById("product-description")
  };

  Object.values(elements).forEach(el => {
    if (el) el.textContent = "Loading...";
  });
}

// ========================================
// HELPER: Update Product Display
// ========================================
function updateProductDisplay(product) {
  // Update page title
  document.title = `${product.name} - KuliNastra`;

  // Update image
  const productImage = document.querySelector(".product-image img");
  if (productImage) {
    productImage.src = product.image;
    productImage.alt = product.name;
  }

  // Update title
  const productTitleInfo = document.querySelector(".product-info h1");
  if (productTitleInfo) {
    productTitleInfo.textContent = product.name;
  }

  // Update price
  const productPriceInfo = document.querySelector(".product-info .price");
  if (productPriceInfo) {
    productPriceInfo.textContent = `Rp. ${product.price.toLocaleString("id-ID")}`;
  }

  // Update stock
  const stockValue = document.querySelector(".detail-row .value");
  if (stockValue) {
    stockValue.textContent = product.stock;
  }

  // Update categories
  const categoryValue = document.querySelector(".detail-row:nth-child(2) .value");
  if (categoryValue) {
    const categoryNames = {
      manis: "Manis",
      gurih: "Gurih",
      nabati: "Nabati",
      hewani: "Hewani",
      jajan: "Jajan",
      "makanan-berat": "Makanan Berat",
    };
    categoryValue.textContent = product.categories
      .map((cat) => categoryNames[cat] || cat)
      .join(", ");
  }

  // Update description
  const productDescriptionInfo = document.getElementById("product-description");
  if (productDescriptionInfo) {
    productDescriptionInfo.textContent = product.description;
  }

  // Update rating stars
  const ratingStars = document.querySelector(".rating-section .stars");
  if (ratingStars) {
    ratingStars.textContent = "⭐".repeat(product.rating);
  }
}

// ========================================
// DISPLAY COMMENTS
// ========================================
function displayComments(originalComments) {
  const commentsList = document.querySelector(".comments-list");
  if (!commentsList) return;

  const allComments = [...originalComments, ...comments];
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
        <div class="comment-actions">${deleteButton}</div>
      </div>
    `;

    commentsList.appendChild(commentItem);
  });
}

// ========================================
// DISPLAY RELATED PRODUCTS
// ========================================
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
    productCard.onclick = () => window.goToProductDetail(product.id);

    const stars = "⭐".repeat(product.rating);

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover;">
      <div class="product-info-card">
        <h3>${product.name}</h3>
        <div class="product-price">Rp. ${product.price.toLocaleString("id-ID")}</div>
        <div class="rating">
          <span class="stars">${stars}</span>
        </div>
      </div>
    `;

    relatedProductsContainer.appendChild(productCard);
  });
}

// ========================================
// TAB FUNCTIONALITY
// ========================================
function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  const selectedTabContent = document.getElementById(tabName);
  if (selectedTabContent) {
    selectedTabContent.classList.add("active");
  }

  event.target.classList.add("active");
}

// ========================================
// COMMENT SECTION
// ========================================
let selectedRating = 0;
let comments = [];

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
  if (ratingContainer) {
    ratingContainer.addEventListener("mouseleave", () => {
      updateStarDisplay();
    });
  }
}

function highlightStars(count) {
  const stars = document.querySelectorAll(".rating-input .star");
  stars.forEach((star, index) => {
    if (index < count) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

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

function updateRatingLabel() {
  const ratingLabel = document.getElementById("rating-label");
  const ratingTexts = {
    1: "Sangat Buruk",
    2: "Buruk",
    3: "Biasa",
    4: "Bagus",
    5: "Sangat Bagus",
  };

  if (ratingLabel) {
    ratingLabel.textContent = selectedRating > 0 
      ? ratingTexts[selectedRating] 
      : "Pilih rating";
  }
}

function initializeCharCounter() {
  const textarea = document.getElementById("comment-text");
  const charCount = document.getElementById("char-count");

  if (textarea && charCount) {
    textarea.addEventListener("input", () => {
      const currentLength = textarea.value.length;
      charCount.textContent = `${currentLength}/500 karakter`;
      charCount.style.color = currentLength > 450 ? "#e74c3c" : "#999";
    });
  }
}

function loadCommentsFromStorage() {
  const productId = getProductIdFromUrl();
  if (!productId) return;

  const storedComments = localStorage.getItem(`comments_${productId}`);
  if (storedComments) {
    comments = JSON.parse(storedComments);
  }
}

function saveCommentsToStorage() {
  const productId = getProductIdFromUrl();
  if (!productId) return;

  localStorage.setItem(`comments_${productId}`, JSON.stringify(comments));
}

function addComment() {
  const usernameInput = document.getElementById("username");
  const commentTextarea = document.getElementById("comment-text");

  const username = usernameInput.value.trim() || "Anonim";
  const commentText = commentTextarea.value.trim();

  if (!commentText) {
    alert("Silakan masukkan komentar terlebih dahulu!");
    commentTextarea.focus();
    return;
  }

  if (selectedRating === 0) {
    alert("Silakan pilih rating terlebih dahulu!");
    return;
  }

  const newComment = {
    id: Date.now(),
    username: username,
    rating: selectedRating,
    text: commentText,
    date: new Date().toISOString().split("T")[0],
  };

  comments.push(newComment);
  saveCommentsToStorage();

  const productId = getProductIdFromUrl();
  const product = productsData.find((p) => p.id === productId);
  if (product) {
    displayComments(product.comments);
    updateOverallRating();
  }

  usernameInput.value = "";
  commentTextarea.value = "";
  selectedRating = 0;
  updateStarDisplay();
  updateRatingLabel();
  document.getElementById("char-count").textContent = "0/500 karakter";

  showSuccessMessage("Komentar berhasil ditambahkan!");
}

function deleteComment(commentId) {
  if (confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
    comments = comments.filter((comment) => comment.id !== commentId);
    saveCommentsToStorage();

    const productId = getProductIdFromUrl();
    const product = productsData.find((p) => p.id === productId);
    if (product) {
      displayComments(product.comments);
      updateOverallRating();
    }

    showSuccessMessage("Komentar berhasil dihapus!");
  }
}

function showSuccessMessage(message) {
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

  setTimeout(() => {
    document.body.removeChild(successDiv);
  }, 3000);
}

function updateOverallRating() {
  const productId = getProductIdFromUrl();
  if (!productId) return;

  const product = productsData.find((p) => p.id === productId);
  if (!product) return;

  const allComments = [...product.comments, ...comments];

  if (allComments.length === 0) {
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

  const totalRating = allComments.reduce((sum, comment) => sum + comment.rating, 0);
  const averageRating = totalRating / allComments.length;
  const roundedRating = Math.round(averageRating);

  const overallStars = document.getElementById("overall-stars");
  if (overallStars) {
    overallStars.textContent = "⭐".repeat(roundedRating);
  }

  const ratingText = document.getElementById("rating-text");
  if (ratingText) {
    ratingText.textContent = `Rating rata-rata: ${averageRating.toFixed(1)} dari ${allComments.length} komentar`;
  }
}

// ========================================
// PAGE INITIALIZATION
// ========================================
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
  }
});