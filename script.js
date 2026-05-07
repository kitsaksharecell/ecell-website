const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector(".contact-form");
const albumModal = document.querySelector("#album-modal");
const albumTitle = document.querySelector("#album-title");
const albumPhotos = document.querySelector("#album-photos");
const modalClose = document.querySelector(".modal-close");

const albums = {
  illuminate: {
    title: "Illuminate 2025",
    photos: [
      ["assets/illuminate/1.jpg", "Illuminate event banner"],
      ["assets/illuminate/2.jpg", "IIT Bombay faculty addressing students"],
      ["assets/illuminate/3.jpg", "Guest felicitation"],
      ["assets/illuminate/4.jpg", "Startup learning session"],
      ["assets/illuminate/5.jpg", "Student participation"],
      ["assets/illuminate/6.jpg", "Engaged student audience"],
      ["assets/illuminate/7.jpg", "Student innovation presentation"],
      ["assets/illuminate/8.jpg", "First prize winners"],
      ["assets/illuminate/9.jpg", "Second prize winners"],
      ["assets/illuminate/10.jpg", "Third prize winners"],
      ["assets/illuminate/11.jpg", "Honoring the guest"],
      ["assets/illuminate/12.jpg", "Organizing team with guests"],
      ["assets/illuminate/13.jpg", "Illuminate team moment"],
    ],
  },
  awareness: {
    title: "Awareness for 3rd Years",
    photos: [
      ["assets/awareness-third-years/1.jpeg", "Entrepreneurship awareness session"],
      ["assets/awareness-third-years/2.jpeg", "E-Cell activities explained"],
      ["assets/awareness-third-years/3.jpeg", "Interactive classroom discussion"],
      ["assets/awareness-third-years/4.jpeg", "Student coordinator interaction"],
      ["assets/awareness-third-years/5.jpeg", "Innovation mindset briefing"],
      ["assets/awareness-third-years/6.jpeg", "Classroom outreach"],
    ],
  },
};

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button");
    const originalText = button.textContent;

    button.textContent = "Message Sent ✨";
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      contactForm.reset();
    }, 1800);
  });
}

document.querySelectorAll(".album-card").forEach((card) => {
  card.addEventListener("click", () => {
    const album = albums[card.dataset.album];
    if (!album) return;

    albumTitle.textContent = album.title;
    albumPhotos.innerHTML = album.photos
      .map(
        ([src, alt]) => `
          <figure>
            <img src="${src}" alt="${alt}" />
            <figcaption>${alt}</figcaption>
          </figure>
        `
      )
      .join("");

    albumModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalClose.focus();
  });
});

const closeAlbum = () => {
  albumModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

modalClose.addEventListener("click", closeAlbum);

albumModal.addEventListener("click", (event) => {
  if (event.target === albumModal) {
    closeAlbum();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && albumModal.getAttribute("aria-hidden") === "false") {
    closeAlbum();
  }
});
