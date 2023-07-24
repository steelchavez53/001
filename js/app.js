const hamburger = document.querySelector('.header .nav-bar .nav-list .hamburger');
const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul');
const menu_item = document.querySelectorAll('.header .nav-bar .nav-list ul li a');
const header = document.querySelector('.header.container');

hamburger.addEventListener('click', () => {
	hamburger.classList.toggle('active');
	mobile_menu.classList.toggle('active');
});

document.addEventListener('scroll', () => {
	var scroll_position = window.scrollY;
	if (scroll_position > 250) {
		header.style.backgroundColor = '';
	} else {
		header.style.backgroundColor = 'transparent';
	}
});

menu_item.forEach((item) => {
	item.addEventListener('click', () => {
		hamburger.classList.toggle('active');
		mobile_menu.classList.toggle('active');
	});
});




const main = document.querySelector('main');
const bg = document.querySelector('.bg-main');
const circle = document.querySelector('.bg-circle');
const btns = document.querySelector('.btns');

const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

const cursorF = document.createElement('div');
cursorF.className = 'cursor-f';
cursor.appendChild(cursorF);

let images = ['../img/mountains.png',
              'https://images.unsplash.com/photo-1575402770603-8915aa0d5eab?auto=format&fit=crop&w=2978', 
              'https://images.unsplash.com/photo-1575402758837-d55c2158c7fc?auto=format&fit=crop&w=2704',
            ];
let current = 0;

bg.querySelector('.bg-main-img').style.setProperty('--img', `url(${images[0]})`);
circle.querySelector('.bg-circle-img').style.setProperty('--img', `url(${images[0]})`);

let bgCurrent, bgNext, circleCurrent, circleNext, playing = false;

let dirToSign = {next: 1, prev: -1};
let signToDir = {'1': 'next', '-1': 'prev'};

function go(dir = 'next') {
  if (!playing) {
    playing = true;
    btns.classList.add('hidden');
    cursorF.style.animationPlayState = 'running';
    current += dirToSign[dir];
    if (current < 0) current = images.length - 1;
    else if (current >= images.length) current = 0;

    let animOptions = {delay: .3, duration: 1.5, ease: Power3.easeInOut};

    circleCurrent = circle.querySelector('.bg-circle-img');
    circleNext = document.createElement('div');
    circleNext.style.setProperty('--img', `url(${images[current]})`);
    circleNext.className = 'bg-circle-img';

    bgCurrent = bg.querySelector('.bg-main-img');
    bgNext = document.createElement('div');
    bgNext.style.setProperty('--img', `url(${images[current]})`);
    bgNext.className = 'bg-main-img';

    let timeline = gsap.timeline({
      onComplete: function () {
        circleCurrent.remove();
        bgCurrent.remove();
        gsap.to(circleNext, {duration: 0, rotation: 0, y: 0});
        gsap.to(bg, {duration: 0, y: 0});
        cursorF.style.animationPlayState = 'paused';
        btns.classList.remove('hidden');
        playing = false;
      }, paused: false
    });

    if (dir === 'prev') {
      circle.appendChild(circleNext);
      bg.prepend(bgNext);
      gsap.to(bg, {duration: 0, y: -main.offsetHeight});

      timeline.to([circleCurrent, circleNext], {...animOptions, rotation: -180});
      timeline.to([circleCurrent, circleNext], {...animOptions, y: -circle.offsetHeight});
      timeline.to(bg, {...animOptions, y: 0}, 1.8);
      timeline.to(circleNext, {...animOptions, rotation: -360});
    }

    else {
      circle.prepend(circleNext);
      gsap.to([circleNext, circleCurrent], {duration: 0, y: -circle.offsetHeight});
      bg.appendChild(bgNext);

      timeline.to([circleCurrent, circleNext], {...animOptions, rotation: 180});
      timeline.to([circleCurrent, circleNext], {...animOptions, y: 0});
      timeline.to(bg, {...animOptions, y: -main.offsetHeight}, 1.8);
      timeline.to(circleNext, {...animOptions, rotation: 360});
    }
  }
}

let cursorX = 0;
let cursorY = 0;
let pageX = 0;
let pageY = 0;

function lerp(start, end, amount) {
  return (1-amount)*start+amount*end
}

if ('ontouchstart' in window) {
  cursor.style.display = 'none';
  cursorF.style.display = 'none';
}

document.addEventListener('mouseleave', function() {
  cursor.classList.add('hidden');
});
document.addEventListener('mouseenter', function() {
  cursor.classList.remove('hidden');
});

let clicked = false;
let startY, endY;

function mousedown(e) {
  cursor.classList.add('clicked');

  clicked = true;
  startY = e.clientY || e.touches[0].clientY || e.targetTouches[0].clientY;
}
function mouseup(e) {
  cursor.classList.remove('clicked');

  endY = e.clientY || endY;
  if (clicked && startY && Math.abs(startY - endY) >= 40) {
    go(signToDir[Math.sign(startY - endY)]);
    clicked = false;
    startY = null;
    endY = null;
  }
}
window.addEventListener('mousedown', mousedown, false);
window.addEventListener('touchstart', mousedown, false);
window.addEventListener('touchmove', function(e) {
  if (clicked) {
    endY = e.touches[0].clientY || e.targetTouches[0].clientY;
  }
}, false);
window.addEventListener('touchend', mouseup, false);
window.addEventListener('mouseup', mouseup, false);

window.addEventListener('mousemove', function(e) {
  pageX = e.clientX;
  pageY = e.clientY;
  gsap.to(cursor, {duration: .01, left: e.clientX-4, top: e.clientY-4});
});

function loop() {
  if (cursorX !== pageX || cursorY !== pageY) {
    cursorX = lerp(cursorX, pageX, .2);
    cursorY = lerp(cursorY, pageY, .2);
    gsap.to(cursorF, {duration: .01, left: cursorX - 15, top: cursorY - 15});
  }
  requestAnimationFrame(loop);
}

loop();

window.addEventListener('keydown', function(e) {
  if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
    go('next');
  }

  else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
    go('prev');
  }
});

let scrollTimeout;
function wheel(e) {
  let dir = signToDir[Math.sign(e.deltaY)];
  clearTimeout(scrollTimeout);

  setTimeout(function() {
    if (e.deltaY >= 40 || e.deltaY <= -40) go(dir);
  }, 100)
}
window.addEventListener('mousewheel', wheel, false);
window.addEventListener('wheel', wheel, false);
// Resto del código existente...

let autoChangeInterval;

function startAutoChange() {
  autoChangeInterval = setInterval(() => {
    go('next');
  }, 4000);
}

function stopAutoChange() {
  clearInterval(autoChangeInterval);
}

// Evento al hacer clic en el botón previo (anterior)
btns.querySelector('.arrow.prev').addEventListener('click', () => {
  stopAutoChange();
  go('prev');
  startAutoChange();
});

// Evento al hacer clic en el botón siguiente
btns.querySelector('.arrow.next').addEventListener('click', () => {
  stopAutoChange();
  go('next');
  startAutoChange();
});

// Iniciar el cambio automático al cargar la página
startAutoChange();
