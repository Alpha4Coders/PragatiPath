  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const closeBtn = document.querySelector(".close-btn");

  hamburger.addEventListener("click", () => {
    document.body.classList.add("show-sidebar");
  });

  closeBtn.addEventListener("click", () => {
    document.body.classList.remove("show-sidebar");
  });

  backdrop.addEventListener("click", () => {
    document.body.classList.remove("show-sidebar");
  });

