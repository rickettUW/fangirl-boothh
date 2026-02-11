
const intro = document.getElementById("intro");
const booth = document.getElementById("booth");
const enterBtn = document.getElementById("enterBtn");
const video = document.getElementById("video");
const snapBtn = document.getElementById("snap");
const countdown = document.getElementById("countdown");

const modeSelect = document.getElementById("mode");
const filterSelect = document.getElementById("filter");
const frameSelect = document.getElementById("frameColor");

let stream;
let photos = [];

enterBtn.onclick = async () => {
  intro.classList.add("hidden");
  booth.classList.remove("hidden");

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false
  });

  video.srcObject = stream;
};

snapBtn.onclick = async () => {
  photos = [];
  const total = modeSelect.value === "strip" ? 4 : 1;

  for (let i = 0; i < total; i++) {
    await runCountdown();
    photos.push(capturePhoto());
  }

  exportPhotos();
};

async function runCountdown() {
  const icons = ["⭐", "🎸", "🥁", "📸"];
  for (let icon of icons) {
    countdown.textContent = icon;
    await wait(700);
  }
  countdown.textContent = "";
}

function capturePhoto() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0);

  applyFilter(ctx, canvas);

  return canvas;
}

function applyFilter(ctx, canvas) {
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i+1], b = d[i+2];

    if (filterSelect.value === "vintage") {
      r *= 1.1; g *= 1.05; b *= 0.9;
    }

    if (filterSelect.value === "sepia") {
      d[i]   = (0.393*r + 0.769*g + 0.189*b);
      d[i+1] = (0.349*r + 0.686*g + 0.168*b);
      d[i+2] = (0.272*r + 0.534*g + 0.131*b);
      continue;
    }

    if (filterSelect.value === "bw") {
      const avg = (r+g+b)/3;
      d[i] = d[i+1] = d[i+2] = avg;
    }

    d[i] = r; d[i+1] = g; d[i+2] = b;
  }

  ctx.putImageData(img, 0, 0);
}

function exportPhotos() {
  if (modeSelect.value === "single") {
    downloadCanvas(photos[0]);
    return;
  }

  const strip = document.createElement("canvas");
  const ctx = strip.getContext("2d");

  const w = photos[0].width;
  const h = photos[0].height;

  strip.width = w + 80;
  strip.height = h * 4 + 100;

  ctx.fillStyle = frameSelect.value;
  ctx.fillRect(0, 0, strip.width, strip.height);

  photos.forEach((p, i) => {
    ctx.drawImage(p, 40, 40 + i * h);
  });

  downloadCanvas(strip);
}

function downloadCanvas(canvas) {
  const link = document.createElement("a");
  link.download = "fangirl-photo.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}let filterIndex = 0;
const video = document.getElementById("video");
const star = document.getElementById("filterStar");
const label = document.getElementById("filterLabel");

function applyFilter() {
  video.style.filter = filters[filterIndex].css;
  label.textContent = filters[filterIndex].name;
  label.style.opacity = 1;

  setTimeout(() => {
    label.style.opacity = 0;
  }, 1200);
}

star.addEventListener("click", () => {
  filterIndex = (filterIndex + 1) % filters.length;
  applyFilter();
});

// apply first filter on load
applyFilter();


const wait = ms => new Promise(r => setTimeout(r, ms));
