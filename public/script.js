const thankModal = document.getElementById("thankModal");
const closeModal = document.getElementById("closeModal");

function showThankModal(message) {
  thankModal.querySelector("p").textContent =
    message || "Tack för din inskickning!";
  thankModal.style.display = "block";
}

// Stäng modalen när man klickar på krysset
closeModal.onclick = () => {
  thankModal.style.display = "none";
};

// Stäng modalen om man klickar utanför innehållet
window.onclick = (event) => {
  if (event.target === thankModal) {
    thankModal.style.display = "none";
  }
};
