const heroImg = document.querySelector('.header-picture img');
const hero = document.querySelector('.header-picture');

const originalHeight = heroImg.offsetHeight;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const shrink = Math.max(originalHeight - scrollY, originalHeight * 0.5);
  // 0.6 = minsta höjden (60 % av originalet)

  heroImg.style.height = `${shrink}px`;
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  
  hamburger.addEventListener("click", () => {
    console.log("Hamburger clicked");
    navMenu.classList.toggle("active");
  });
});