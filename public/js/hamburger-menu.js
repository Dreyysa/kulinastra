const menuIcon = document.getElementById("menu-icon");
const sideMenu = document.getElementById("side-menu");
const closeBtn = document.getElementById("close-btn");

menuIcon.addEventListener("click", function () {
  sideMenu.classList.add("active");
  document.body.classList.add("menu-open");
});

closeBtn.addEventListener("click", function () {
  sideMenu.classList.remove("active");
  document.body.classList.remove("menu-open");
});
