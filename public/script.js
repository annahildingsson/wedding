const heroImg = document.querySelector(".header-picture img");
const hero = document.querySelector(".header-picture");

const originalHeight = heroImg.offsetHeight;
window.addEventListener("scroll", () => {
  // Kör bara om fönsterbredden är större än 768px (desktop)
  if (window.innerWidth > 768) {
    const scrollY = window.scrollY;
    const shrink = Math.max(originalHeight - scrollY, originalHeight * 0.5);
    // minsta höjden = 50% av originalet
    heroImg.style.height = `${shrink}px`;
  } else {
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  hamburger.addEventListener("click", () => {
    console.log("Hamburger clicked");
    navMenu.classList.toggle("active");
  });
});
