const menuButton = document.getElementById("menu-button");
const navList = document.getElementById("nav-list");

if (menuButton && navList) {
  menuButton.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const revealNodes = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

revealNodes.forEach((node) => revealObserver.observe(node));

const tiltNodes = document.querySelectorAll("[data-tilt]");

const handleTilt = (event) => {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const rotateY = (x - 0.5) * 8;
  const rotateX = (0.5 - y) * 8;

  card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
};

const resetTilt = (event) => {
  event.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
};

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  tiltNodes.forEach((node) => {
    node.style.transition = "transform 220ms ease";
    node.addEventListener("pointermove", handleTilt);
    node.addEventListener("pointerleave", resetTilt);
  });
}

const workToggles = document.querySelectorAll(".exp-toggle");
workToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const panelId = toggle.getAttribute("aria-controls");
    if (!panelId) return;
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    panel.hidden = isOpen;
  });
});

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}
