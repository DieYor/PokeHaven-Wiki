document.addEventListener("DOMContentLoaded", () => {
  const links = [...document.querySelectorAll("a.figure-zoom[data-lightbox]")];
  if (!links.length) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.hidden = true;
  overlay.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Close">×</button>
    <img class="lightbox-img" alt="" />
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector(".lightbox-img");
  const closeBtn = overlay.querySelector(".lightbox-close");

  function open(src, alt) {
    img.src = src;
    img.alt = alt || "";
    overlay.hidden = false;
    document.body.classList.add("lightbox-open");
  }

  function close() {
    overlay.hidden = true;
    img.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
  }

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const thumb = a.querySelector("img");
      open(a.getAttribute("href"), thumb?.alt || "");
    });
  });

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) close();
  });
});
