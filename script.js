const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarsePointer = window.matchMedia("(hover: none)").matches;

/* ---------- name letter reveal ---------- */

const lettersContainer = document.querySelector(".letters");
const nameText = "ySixx";

nameText.split("").forEach((char) => {
  const span = document.createElement("span");
  span.className = "letter";
  span.textContent = char;
  lettersContainer.appendChild(span);
});

/* ---------- star field ---------- */

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const count = Math.floor((canvas.width * canvas.height) / 9000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.2,
    speed: Math.random() * 0.05 + 0.01,
    phase: Math.random() * Math.PI * 2,
  }));
}

function drawStars(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const star of stars) {
    const twinkle = 0.4 + Math.sin(time * 0.001 * star.speed * 20 + star.phase) * 0.35;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245, 245, 245, ${Math.max(twinkle, 0.05)})`;
    ctx.fill();
    star.y -= star.speed;
    if (star.y < -5) {
      star.y = canvas.height + 5;
      star.x = Math.random() * canvas.width;
    }
  }
  requestAnimationFrame(drawStars);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
if (!prefersReducedMotion) {
  requestAnimationFrame(drawStars);
} else {
  drawStars(0);
}

/* ---------- cursor spotlight + orb parallax + trail ---------- */

const spotlight = document.querySelector(".spotlight");
const orbs = document.querySelectorAll(".orb");
let lastTrailTime = 0;

function spawnTrailDot(x, y) {
  const dot = document.createElement("span");
  dot.className = "trail-dot";
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  document.body.appendChild(dot);
  dot.addEventListener("animationend", () => dot.remove());
}

if (!prefersReducedMotion && !isCoarsePointer) {
  window.addEventListener("mousemove", (event) => {
    const xPct = (event.clientX / window.innerWidth) * 100;
    const yPct = (event.clientY / window.innerHeight) * 100;
    spotlight.style.setProperty("--x", `${xPct}%`);
    spotlight.style.setProperty("--y", `${yPct}%`);

    const offsetX = (event.clientX / window.innerWidth - 0.5) * 20;
    const offsetY = (event.clientY / window.innerHeight - 0.5) * 20;
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 0.6;
      orb.style.transform = `translate(${offsetX * depth}px, ${offsetY * depth}px)`;
    });

    const now = performance.now();
    if (now - lastTrailTime > 45) {
      spawnTrailDot(event.clientX, event.clientY);
      lastTrailTime = now;
    }
  });
}

/* ---------- 3D card tilt ---------- */

const card = document.querySelector(".card");

if (!prefersReducedMotion && !isCoarsePointer) {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateY = relX * 8;
    const rotateX = -relY * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
}

/* ---------- magnetic buttons ---------- */

const buttons = document.querySelectorAll(".btn");

if (!prefersReducedMotion && !isCoarsePointer) {
  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (event) => {
      const rect = btn.getBoundingClientRect();
      const relX = event.clientX - rect.left - rect.width / 2;
      const relY = event.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${relX * 0.06}px, ${relY * 0.25}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
}

/* ---------- ripple + open link + toast ---------- */

const notification = document.getElementById("notification");
const notificationText = notification.querySelector(".notification-text");
let toastTimeout;

function showToast(message) {
  clearTimeout(toastTimeout);
  notificationText.textContent = message;
  notification.classList.add("show");
  toastTimeout = setTimeout(() => {
    notification.classList.remove("show");
  }, 2200);
}

function spawnRipple(btn, x, y) {
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const size = Math.max(rect.width, rect.height) * 1.4;
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x - rect.left}px`;
  ripple.style.top = `${y - rect.top}px`;
  btn.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

buttons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    spawnRipple(btn, event.clientX, event.clientY);
    const url = btn.getAttribute("href");
    const label = btn.querySelector(".btn-label").textContent;
    window.open(url, "_blank", "noopener");
    showToast(`Abrindo ${label}`);
  });
});
