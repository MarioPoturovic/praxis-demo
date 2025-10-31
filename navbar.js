// navbar.js
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");

  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  // Close menu when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
      if (!menu.classList.contains("lg:flex")) {
        menu.classList.add("hidden");
      }
    }
  });
});
