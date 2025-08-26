function fn0() {
  appendToDisplay(0);
}
function fn1() {
  appendToDisplay(1);
}
function fn2() {
  appendToDisplay(2);
}
function fn3() {
  appendToDisplay(3);
}
function fn4() {
  appendToDisplay(4);
}
function fn5() {
  appendToDisplay(5);
}
function fn6() {
  appendToDisplay(6);
}
function fn7() {
  appendToDisplay(7);
}
function fn8() {
  appendToDisplay(8);
}
function fn9() {
  appendToDisplay(9);
}

function appendToDisplay(value) {
  let display = document.getElementById("display");
  if (display.value === "0") display.value = "";
  display.value += value;
}

let firstsave = 0;
let op = 0;

function add() {
  storeFirstValue(1);
}
function ngv() {
  storeFirstValue(2);
}
function mul() {
  storeFirstValue(3);
}
function dv() {
  storeFirstValue(4);
}

function storeFirstValue(operation) {
  firstsave = parseFloat(document.getElementById("display").value);
  document.getElementById("display").value = "";
  op = operation;
}

function eq() {
  let secondsave = parseFloat(document.getElementById("display").value);
  let result;

  switch (op) {
    case 1:
      result = firstsave + secondsave;
      break;
    case 2:
      result = firstsave - secondsave;
      break;
    case 3:
      result = firstsave * secondsave;
      break;
    case 4:
      result = firstsave / secondsave;
      break;
    default:
      result = "Invalid Input";
  }

  document.getElementById("display").value = result;
}

function feraser() {
  let display = document.getElementById("display");
  display.value = display.value.slice(0, -1);
}

function ac() {
  document.getElementById("display").value = "";
  op = 0;
}

// Tambahkan efek pressed ke semua tombol saat ditekan
document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.classList.add("pressed");
        setTimeout(() => {
            btn.classList.remove("pressed");
        }, 200); // 200ms nanti balik ke normal
    });
});
