(function () {
  var button = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  if (!button || !nav) return;

  function setOpen(open) {
    button.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("is-open", open);
  }

  button.addEventListener("click", function () {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setOpen(false);
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setOpen(false);
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 800px)").matches) setOpen(false);
  });
})();
