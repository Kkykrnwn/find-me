const div = document.getElementById("div");
const img = Assets.loadImage("icon.png");
const asciiText =
  "        `.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ";
const binaryText = "01";

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

if (!navigator.getUserMedia) console.error("Error");

let video = document.getElementById("video"),
  track;
video.setAttribute("autoplay", true);

navigator.getUserMedia(
  { video: true, audio: false },
  function (stream) {
    video.srcObject = stream;
    track = stream.getTracks()[0];
  },
  function (e) {
    div.innerHTML = "Error! Izin Akses Kamera Ditolak!";
  }
);
video.onload = () => {
  console.log([video.width, video.height]);
};
width = 24;
height = 32;
dist = 25;
let frame;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, width, height);
  video.pixels = ctx.getImageData(0, 0, width, height).data;
  ctx.fillStyle = "#1e283b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let text = "";
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const colorIndex = j * (width * 4) + i * 4;
      const r = video.pixels[colorIndex + 0];
      const g = video.pixels[colorIndex + 1];
      const b = video.pixels[colorIndex + 2];
      const avg = Math.floor((r + g + b) / 3);
      if (avg !== 0) {
        const asciiIndex = Math.floor(avg * ((asciiText.length - 1) / 255));
        text += asciiText[asciiIndex];
        ctx.font = "28px Courier bold";
        // ctx.fillStyle = `hsl(123,${avg * (100 / 255)}%,50%)`;
        ctx.fillStyle = `hsl(351.4,88.6%,55.1%)`;
        ctx.textAlign = "center";
        ctx.fillText(asciiText[asciiIndex], (1 + i) * dist, (1 + j) * dist);
        // } else {
        //   text += " ";
        // }
      }
    }
    ctx.drawImage(video, 0, 0, width, height);
    //text += ""
  }
  window.requestAnimationFrame(draw);
}

function main() {
  draw();
  //typing(text, 2);
}
