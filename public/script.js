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

window.addEventListener('DOMContentLoaded', () => {
  console.log("script loaded");
  loadGalleryImages();
  const uploadForm = document.getElementById('upload-form');
  const gallery = document.getElementById('gallery');
  const uploadMessage = document.getElementById('upload-message');

  if (uploadForm) {
    uploadForm.addEventListener('submit', async function (e) {
      e.preventDefault(); // ✅ Hindra sidladdning

      const formData = new FormData(uploadForm);

      try {
        const response = await fetch('/gallery', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (response.ok) {
          uploadMessage.textContent = result.message;

          const img = document.createElement('img');
          img.src = result.url;
          img.alt = 'Uppladdad bild';
          gallery.appendChild(img);

          uploadForm.reset();
        } else {
          uploadMessage.textContent = 'Fel: ' + (result.message || 'Något gick fel');
        }
      } catch (error) {
        console.error(error);
        uploadMessage.textContent = 'Fel vid uppladdning';
      }
    });
  }
});

async function loadGalleryImages() {
  try {
    const response = await fetch('/api/gallery');
    const images = await response.json();

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Töm galleriet först

    images.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Uppladdad bild';
      gallery.appendChild(img);
    });
  } catch (error) {
    console.error('Kunde inte ladda bilder:', error);
  }
}