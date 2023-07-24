
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

/*Contact */
// Setting a cookie with SameSite=None; Secure
// Set the cookie with SameSite=None; Secure attributes
document.cookie = "yourCookieName=yourCookieValue; SameSite=None; Secure";
document.cookie = "your_cookie_name=your_cookie_value; SameSite=None; Secure";
document.cookie = "your_cookie_name=your_cookie_value; SameSite=Strict";


document.addEventListener('DOMContentLoaded', () => {
  const mountainLeft = document.querySelector('.mountain_left');
  const mountainRight = document.querySelector('.mountain_right');
  const cloud1 = document.querySelector('.clouds_1');
  const cloud2 = document.querySelector('.clouds_2');
  const text = document.querySelector('.text');
  const man = document.querySelector('.man');

  window.addEventListener('scroll',()=>{
    let value = scrollY;
    if (mountainLeft) {
      mountainLeft.style.left = `-${value/0.7}px`;
    }
    if (cloud2) {
      cloud2.style.left = `-${value*2}px`;
    }
    if (mountainRight) {
      mountainRight.style.left = `${value/0.7}px`;
    }
    if (cloud1) {
      cloud1.style.left = `${value*2}px`;
    }
    if (text) {
      text.style.bottom = `-${value}px`;
    }
    if (man) {
      man.style.height = `${window.innerHeight - value}px`;
    }
  });
});

/*END CONTA */

const signToDir = { '1': 'next', '-1': 'prev' };
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

const cursorF = document.createElement('div');
cursorF.className = 'cursor-f';
cursor.appendChild(cursorF);




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
    function go(direction) {
      console.log("Ratón moviéndose hacia", direction);
    }
    var startY = 100; // Coordenada Y de inicio
    var endY = 50; // Coordenada Y de fin
    var signToDir = {
      '-1': 'arriba',
      '0': 'ninguna dirección',
      '1': 'abajo'
    };
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



