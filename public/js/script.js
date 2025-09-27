function showTab(tabName) {
  // Remove active class from all tabs and tab contents
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => tab.classList.remove("active"));
  tabContents.forEach((content) => content.classList.remove("active"));
  // Add active class to clicked tab
  event.target.classList.add("active");
  // Show corresponding tab content
  document.getElementById(tabName).classList.add("active");
}

function addComment() {
  const textarea = document.querySelector('.comment-form textarea');
  const commentText = textarea.value.trim();
  
  if (commentText) {
    // Membuat elemen comment baru
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item';
    commentItem.innerHTML = `
      <div class="comment-header">
        <div class="stars">⭐⭐⭐⭐⭐</div>
        <div class="user-info">
          <div class="user-avatar"></div>
          <div class="user-details">
            <div class="username">User</div>
            <div class="comment-text">${commentText}</div>
          </div>
        </div>
      </div>
    `;
    
    // Menambahkan comment ke list
    document.querySelector('.comments-list').appendChild(commentItem);
    
    // Reset textarea
    textarea.value = '';
  }
}