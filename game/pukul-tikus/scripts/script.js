const difficultyButton = document.getElementById("difficulty");
const modeButton = document.getElementById("mode");
const tikus = [...document.querySelectorAll(".tikus")];
let minMuncul = 1600;
let maxMuncul = 2400;
let sumMuncul = 0;
let game = false;
let scoreTxt = 0;
let loaded = 0;
let totalGambar = 6;
let highScoreTxt = localStorage.getItem("tikusHighScore")
  ? parseInt(localStorage.getItem("tikusHighScore"))
  : 0;
let level = localStorage.getItem("tikusLevel")
  ? parseInt(localStorage.getItem("tikusLevel"))
  : 0;
let mode = localStorage.getItem("tikusMode")
  ? parseInt(localStorage.getItem("tikusMode"))
  : 0;
highScore.innerHTML = `High Score: ${highScoreTxt}`;

gantiLevel(level);
gantiMode(mode);
document.body.addEventListener("click", function (e) {
  if (e.target.classList.contains("active")) {
    click(e.clientX, e.clientY, "6px solid salmon");
    navigator.vibrate(100);
    Math.random() > 0.5
      ? playSound("sounds/punch1.mp3", 0.8)
      : playSound("sounds/punch2.mp3", 0.4);
    clearTimeout(e.target.timeout);
    if (Math.random() > 0.7) {
      setTimeout(
        munculTikus,
        Math.random() * (maxMuncul * 1.2 - minMuncul * 1.2) + minMuncul * 1.2
      );
    }
    e.target.classList.toggle("idle");
    e.target.classList.remove("active", "idle");
    scoreTxt++;
    score.innerHTML = scoreTxt;
    akurasi.innerHTML = `Akurasi: ${Math.round((scoreTxt / sumMuncul) * 100)}%`;
  } else {
    click(e.clientX, e.clientY, "3px solid yellow");
  }
});
function munculTikus() {
  if (game) {
    let totalMuncul = 0;
    tikus.forEach((t) => {
      if (t.classList.contains("active") == true) totalMuncul++;
    });
    if (totalMuncul < Math.ceil(Math.random() * 3)) {
      let active = Math.floor(Math.random() * 6);
      if (!tikus[active].classList.contains("active")) {
        tikus[active].classList.add("active");
        sumMuncul++;
        if (Math.random() > 0.5) tikus[active].classList.toggle("idle");
      } else {
        return munculTikus();
      }
      tikus[active].timeout = setTimeout(() => {
        if (tikus[active].classList.contains("active")) {
          tikus[active].classList.remove("active", "idle");
        }
        setTimeout(
          munculTikus,
          Math.random() * (maxMuncul - minMuncul) + minMuncul
        );
      }, Math.random() * (maxMuncul - minMuncul) + minMuncul);
    }
    setTimeout(
      munculTikus,
      Math.random() * (maxMuncul * 0.75 - minMuncul * 0.75) + minMuncul * 0.75
    );
    akurasi.innerHTML = `Akurasi: ${Math.round((scoreTxt / sumMuncul) * 100)}%`;
  }
}

function click(x, y, border) {
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
  cursor.style.border = border;
  document.body.appendChild(cursor);
  setTimeout(() => cursor.remove(), 400);
}

function mulai() {
  let waktu = 25;
  game = true;
  scoreTxt = 0;
  sumMuncul = 0;
  clicked = 0;
  score.innerHTML = scoreTxt;
  akurasi.innerHTML = `Akurasi: 0%`;
  munculTikus();
  start.innerHTML = `${waktu}detik`;
  start.disabled = true;
  difficultyButton.disabled = true;
  modeButton.disabled = true;
  const interval = setInterval(function () {
    waktu--;
    start.innerHTML = `${waktu}detik`;
  }, 1000);
  setTimeout(function () {
    clearInterval(interval);
    score.classList.add("selesai");
    akurasi.classList.add("selesai");
    if (scoreTxt > highScoreTxt) {
      highScoreTxt = scoreTxt;
      localStorage.setItem("tikusHighScore", highScoreTxt);
      highScore.innerHTML = `High Score: ${highScoreTxt}`;
    }
    setTimeout(() => {
      score.classList.remove("selesai");
      akurasi.classList.remove("selesai");
    }, 700);
    playSound("sounds/boom.mp3");
    start.innerHTML = "Mulai";
    start.disabled = false;
    difficultyButton.disabled = false;
    modeButton.disabled = false;
    game = false;
    tikus.forEach((t) => t.classList.remove("active", "idle"));
  }, waktu * 1000);
}
function gantiLevel(e) {
  localStorage.setItem("tikusLevel", e);
  difficultyButton.selectedIndex = e;
  switch (parseInt(e)) {
    case 0:
      // easy
      minMuncul = 1800;
      maxMuncul = 2400;

      break;
    case 1:
      // medium
      minMuncul = 1200;
      maxMuncul = 1700;

      break;
    case 2:
      // hard
      playSound("sounds/boom.mp3");
      minMuncul = 600;
      maxMuncul = 1400;

      break;
  }
}
function gantiMode(e) {
  localStorage.setItem("tikusMode", e);
  modeButton.selectedIndex = e;
  let selected = "tanah";
  switch (parseInt(e)) {
    case 0:
      // tanah
      selected = "tanah";
      document.body.className = "tanah-mode";
      document.querySelector(".judul").innerHTML = "Pukul Tikus";

      break;
    case 1:
      // kantor
      selected = "kantor";
      document.body.className = "kantor-mode";
      document.querySelector(".judul").innerHTML = "Pukul Puan";
      playSound("sounds/boom.mp3", 0.5);
      playSound("sounds/uwogh.mp3");
      setTimeout(() => playSound("sounds/omg.mp3", 0.4), 70);
      break;
  }
  document.querySelectorAll(".kotak").forEach((k) => {
    loaded = 0;
    k.children[0].src = `./img/${selected}/tikus.png`;
    k.children[1].src = `./img/${selected}/tanah.png`;
  });
}
function playSound(src, volume = 1) {
  const sound = new Audio(src);
  sound.volume = volume;
  sound.play();
  setTimeout(() => 
    sound.remove()
  , sound.duration);
}

function loading() {
  loaded++;
  loader.children[0].innerHTML = `${Math.round((loaded / totalGambar) * 100)}%`;
  loader.children[1].children[0].style.width = `${Math.round(
    (loaded / totalGambar) * 100
  )}%`;
  loader.style.display = loaded == totalGambar ? "none" : "flex";
  if (loaded >= totalGambar) loader.style.display = "none";
}
tikus.forEach((t) => {
  t.onload = loading;
  t.nextSibling.onload = loading;
});
document.body.onload = () => (loader.style.display = "none");
