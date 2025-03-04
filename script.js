const a1 = document.getElementById("a1");
const b2 = a1.getContext("2d");
a1.width = window.innerWidth;
a1.height = window.innerHeight;
const c3 = [];
const d4 = 100;

for (let e5 = 0; e5 < d4; e5++) {
  c3.push({
    x: Math.random() * a1.width,
    y: Math.random() * a1.height,
    r: Math.random() * 4 + 1,
    d: Math.random() * d4
  });
}

function f6() {
  b2.clearRect(0, 0, a1.width, a1.height);
  b2.fillStyle = "rgba(255, 255, 255, 0.8)";
  b2.beginPath();
  for (let e5 = 0; e5 < d4; e5++) {
    const g7 = c3[e5];
    b2.moveTo(g7.x, g7.y);
    b2.arc(g7.x, g7.y, g7.r, 0, Math.PI * 2, true);
  }
  b2.fill();
  h8();
}

function h8() {
  for (let e5 = 0; e5 < d4; e5++) {
    const g7 = c3[e5];
    g7.y += Math.cos(g7.d) + 1 + g7.r / 2;
    g7.x += Math.sin(0) * 2;
    if (g7.x > a1.width + 5 || g7.x < -5 || g7.y > a1.height) {
      if (e5 % 3 > 0) {
        c3[e5] = { x: Math.random() * a1.width, y: -10, r: g7.r, d: g7.d };
      } else {
        if (Math.sin(0) > 0) {
          c3[e5] = { x: -5, y: Math.random() * a1.height, r: g7.r, d: g7.d };
        } else {
          c3[e5] = { x: a1.width + 5, y: Math.random() * a1.height, r: g7.r, d: g7.d };
        }
      }
    }
  }
}

setInterval(f6, 30);

const i9 = document.getElementById("notification");
document.querySelectorAll(".btn").forEach(j10 => {
  j10.addEventListener("click", (k11) => {
    k11.preventDefault();
    const l12 = j10.getAttribute("href");
    window.open(l12, "_blank");
    m13(`Opening ${l12}`);
  });
});

function m13(n14) {
  i9.textContent = n14;
  i9.classList.add("show");
  setTimeout(() => {
    i9.classList.remove("show");
  }, 2000);
}