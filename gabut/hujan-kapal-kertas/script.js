var HEIGHT,WIDTH;
var lake = document.getElementById("lake");
window.addEventListener('resize', handleResize, false);
handleResize();

function handleResize(){
  HEIGHT = window.innerHeight,
  WIDTH = window.innerWidth;
}

onmousedown = function(event){
  createRipples(event.pageX, event.pageY);
}

function createRipples(x,y){
  var tx = x || Math.random()*WIDTH;
  var ty = y || (Math.random()+.5)*HEIGHT*.5;
  var spltch = document.getElementById("sploutch");
  var cln = spltch.cloneNode(true);
  cln.style.left=(tx-150) +"px";
  cln.style.top=(ty-150) +"px";
  lake.appendChild(cln);
  // remove it from the dom after a while
  setTimeout(function(){
    lake.removeChild(cln);
  }, 4000);
}

setInterval(createRipples, 300);