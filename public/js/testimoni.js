// Load data dari JSON
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

    return productsData;
  } catch (error) {
    console.error("Error loading products data:", error);
    console.log("No fallback data available");
    return [];
  }
}

// Collect all comments from all products (only good ratings 4-5 stars)
function getAllComments() {
  const allComments = [];

  productsData.forEach((product) => {
    if (product.comments && product.comments.length > 0) {
      product.comments.forEach((comment) => {
        // Only include comments with rating 5 stars (excellent only)
        if (comment.rating === 5) {
          allComments.push({
            ...comment,
            productName: product.name,
            productId: product.id,
          });
        }
      });
    }
  });

  // Sort by date (newest)
  allComments.sort((a, b) => new Date(b.date) - new Date(a.date));

  return allComments;
}

// Create testimonial card HTML element
function createTestimonialCard(comment) {
  const testimonialCard = document.createElement("div");
  testimonialCard.className = "testimonial-card";

  const stars = "⭐".repeat(comment.rating);

  // Generate a simple title from comment text (first few words)
  const title =
    comment.text.length > 30
      ? comment.text.substring(0, 30) + "..."
      : comment.text;

  testimonialCard.innerHTML = `
    <div class="rating">
      <span class="stars">${stars}</span>
    </div>
    <h3>${title}</h3>
    <p>"${comment.text}"</p>
    <div class="user-info">
      <div class="user-avatar"><i class="fa-solid fa-user"></i></div>
      <div class="user-details">
        <div class="username">${comment.username}</div>
        <div class="location">${comment.productName}</div>
      </div>
    </div>
  `;

  return testimonialCard;
}

// Display testimonials from data.json
async function displayTestimonials() {
  const testimonialsGrid = document.querySelector(".testimonials-grid");

  if (!testimonialsGrid) {
    console.error("Testimonials grid not found");
    return;
  }

  // Show loading
  testimonialsGrid.innerHTML =
    '<div class="loading">Memuat testimonial...</div>';

  try {
    // Load products data
    await loadProductsData();

    // Get all comments
    const allComments = getAllComments();

    console.log("All comments:", allComments);

    // Clear loading state
    testimonialsGrid.innerHTML = "";

    if (allComments.length === 0) {
      testimonialsGrid.innerHTML =
        '<div class="no-testimonials">Belum ada testimonial yang tersedia.</div>';
      return;
    }

    // Create testimonial cards
    allComments.forEach((comment) => {
      const testimonialCard = createTestimonialCard(comment);
      testimonialsGrid.appendChild(testimonialCard);
    });
  } catch (error) {
    console.error("Error displaying testimonials:", error);
    testimonialsGrid.innerHTML =
      '<div class="error">Gagal memuat testimonial. Silakan refresh halaman.</div>';
  }
}

// Initialize page when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Testimoni page loaded");
  displayTestimonials();
});
