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
