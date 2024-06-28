function randomColor() {
  r = Math.floor(Math.random() * 255);
  g = Math.floor(Math.random() * 255);
  b = Math.floor(Math.random() * 255);
  return { r, g, b };
}

function toRad(deg) {
  return deg * (Math.PI / 180.0);
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2);
}

// get percent between 2 number
function getPercent(input, min, max) {
  return ((input - min) * 100) / (max - min) / 100;
}

//main
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = document.getElementById("canvas").width;
const height = document.getElementById("canvas").height;

const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;

let items = document.getElementsByTagName("textarea")[0].value.split("\n");

let currentDeg = 0;
let step = 360 / items.length;
let colors = [];
let itemDegs = {};

for (let i = 0; i < items.length + 1; i++) {
  colors.push(randomColor());
}

function createWheel() {
  items = document.getElementsByTagName("textarea")[0].value.split("\n");
  step = 360 / items.length;
  colors = [];
  for (let i = 0; i < items.length + 1; i++) {
    colors.push(randomColor());
  }
  draw();
}
draw();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
  ctx.fillStyle = `rgb(${255},${255},${255})`;
  ctx.lineTo(centerX, centerY);
  ctx.fill();

  let startDeg = currentDeg;
  const gapDeg = 2; // 2 degrees gap
  for (let i = 0; i < items.length; i++, startDeg += step) {
    let endDeg = startDeg + step - gapDeg;

    let color = colors[i];

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRad(startDeg), toRad(endDeg));
    let colorStyle2 = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;
    ctx.fillStyle = colorStyle2;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    //Draw the white gap
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRad(endDeg), toRad(endDeg + gapDeg));
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.lineTo(centerX, centerY);
    ctx.stroke();

    // Draw text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(toRad((startDeg + endDeg) / 2));
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.font = "16px Georgia";
    ctx.fillText(items[i], 100, 10);
    ctx.restore();

    itemDegs[items[i]] = {
      startDeg: startDeg,
      endDeg: endDeg,
    };

    // Check winner
    if (
      startDeg % 360 < 360 &&
      startDeg % 360 > 270 &&
      endDeg % 360 > 0 &&
      endDeg % 360 < 90
    ) {
      document.getElementById(
        "winnerName"
      ).innerText = `"${items[i]}" is Winner!`;
    }
  }
}

let speed = 0;
let maxRotation = randomRange(360 * 3, 360 * 6);
let pause = false;
function animate() {
  if (pause) {
    return;
  }
  speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
  if (speed <= 0.01) {
    speed = 0;
    pause = true;
    showPopup(); // Show the popup when spinning stops
  }
  currentDeg += speed;
  draw();
  window.requestAnimationFrame(animate);
}

function spin() {
  if (speed != 0) {
    return;
  }

  maxRotation = 0;
  currentDeg = 0;
  createWheel();
  draw();

  maxRotation = randomRange(360 * 3, 360 * 6);
  itemDegs = {};
  console.log("max", maxRotation);
  console.log(itemDegs);
  pause = false;
  window.requestAnimationFrame(animate);
}

function showPopup() {
  const winnerPopup = document.getElementById("winnerPopup");
  winnerPopup.style.display = "block";
}

function closePopup() {
  const winnerPopup = document.getElementById("winnerPopup");
  winnerPopup.style.display = "none";
}
