// Gör så att bildbandet dupliceras för loop
const slider = document.querySelector('.mySlides');
slider.innerHTML += slider.innerHTML;

let slideshow = document.querySelector('.mySlides');
let lastScroll = sessionStorage.getItem('scrollX');

if (lastScroll) {
    slideshow.style.transform = `translateX(${lastScroll}px)`;
}

setInterval(() => {
    let style = window.getComputedStyle(slideshow);
    let matrix = new WebKitCSSMatrix(style.transform);
    sessionStorage.setItem('scrollX', matrix.m41);
}, 1000);



const thankModal = document.getElementById('thankModal');
const closeModal = document.getElementById('closeModal');

function showThankModal(message) {
    thankModal.querySelector('p').textContent = message || 'Tack för din inskickning!';
    thankModal.style.display = 'block';
}

// Stäng modalen när man klickar på krysset
closeModal.onclick = () => {
    thankModal.style.display = 'none';
}

// Stäng modalen om man klickar utanför innehållet
window.onclick = (event) => {
    if (event.target === thankModal) {
        thankModal.style.display = 'none';
    }
}
