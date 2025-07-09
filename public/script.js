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


const buttons = document.querySelectorAll('.text-button');
const container = document.getElementById('content-container');

// Lyssna på klick på knapparna
buttons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault(); // Hindra att sidan laddas om
    const page = btn.getAttribute('data-page');
    loadPage(page);
  });
});

// Ladda startsidan (information) direkt vid laddning
loadPage('information.html');

const uploadForm = document.getElementById('uploadForm');
const gallery = document.getElementById('gallery');
  
document.getElementById('upload-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('/gallery', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('upload-message').textContent = result.message;

      // Lägg till bilden direkt i galleriet
      const img = document.createElement('img');
      img.src = result.url;  // Cloudinary URL
      img.alt = 'Uppladdad bild';
      img.style.maxWidth = '200px';
      img.style.margin = '10px';

      document.getElementById('gallery').appendChild(img);

      form.reset(); // nollställ formuläret
    } else {
      document.getElementById('upload-message').textContent = 'Fel: ' + (result.message || 'Något gick fel');
    }
  } catch (error) {
    document.getElementById('upload-message').textContent = 'Fel vid uppladdning';
    console.error(error);
  }
});
