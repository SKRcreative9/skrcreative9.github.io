const GALLERY_FOLDERS = {
  gallery1: [
    "1", "2", "3", "4", "5", "6", "7"
  ],
  gallery2: [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"
  ],
  gallery3: [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"
  ],
  gallery4: [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"
  ]
};

const menuButton = document.querySelector("#menu-button");
const menu = document.querySelector("#menu");

menuButton.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.textContent = isOpen ? "×" : "☰";
});

menu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "☰";
  });
});

const galleryModal = document.querySelector("#gallery-modal");
const galleryModalTitle = document.querySelector("#gallery-modal-title");
const galleryModalBody = document.querySelector(".gallery-modal-body");
const collageGrid = document.querySelector("#collage-grid");
const closeGalleryBtn = document.querySelector("#close-gallery");

const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const closeLightboxBtn = document.querySelector("#close-lightbox");

document.querySelectorAll(".project").forEach(project => {
  const category = project.dataset.category;
  const files = GALLERY_FOLDERS[category] || [];
  const coverImg = project.querySelector("img");

  if (coverImg && files.length > 0) {
    // Domyślne zdjęcie okładkowe to pierwszy element z tablicy (indeks 0). Aby ustawić inne, zmień files[0] np. na files[2] lub wpisz nazwę pliku na sztywno.
    coverImg.src = `photos/${category}/${files[0]}.webp`;
    // Wymuszenie dekodowania w tle
    if (coverImg.decode) {
      coverImg.decode().catch(() => {});
    }
  }

  project.addEventListener("click", () => {
    const title = project.dataset.title || category.toUpperCase();

    galleryModalTitle.textContent = title;
    collageGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    files.forEach((fileBaseName, index) => {
      const item = document.createElement("div");
      item.className = "collage-item";

      const img = document.createElement("img");
      img.src = `photos/${category}/${fileBaseName}.webp`;
      img.alt = `${title} - zdjęcie ${index + 1}`;
      img.decoding = "async";

      if (img.decode) {
        img.decode().catch(() => {});
      }

      item.addEventListener("click", () => {
        openLightbox(`photos/${category}/${fileBaseName}.jpg`, img.alt);
      });

      item.appendChild(img);
      fragment.appendChild(item);
    });

    collageGrid.appendChild(fragment);
    galleryModal.classList.add("open");
    galleryModal.setAttribute("aria-hidden", "false");
    galleryModalBody.scrollTop = 0;
    document.body.style.overflow = "hidden";
  });
});

function closeGalleryModal() {
  galleryModal.classList.remove("open");
  galleryModal.setAttribute("aria-hidden", "true");
  collageGrid.innerHTML = "";
  document.body.style.overflow = "";
}

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

closeGalleryBtn.addEventListener("click", closeGalleryModal);
closeLightboxBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

galleryModal.addEventListener("click", event => {
  if (event.target === galleryModal || event.target === galleryModalBody) {
    closeGalleryModal();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (lightbox.classList.contains("open")) {
      closeLightbox();
    } else if (galleryModal.classList.contains("open")) {
      closeGalleryModal();
    }
  }
});

const aboutSection = document.querySelector("#about");
const profileImg = document.querySelector(".about-profile-img");

if (aboutSection && profileImg) {
  function updateProfileImagePosition() {
    const rect = aboutSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionCenter = rect.top + rect.height / 2;

    const maxOffset = 45;
    const holdZoneBottom = windowHeight * 0.65;
    const holdZoneTop = windowHeight * 0.35;
    const enterStart = windowHeight * 1.45;
    const exitEnd = -windowHeight * 0.45;

    let progress = 0;

    if (sectionCenter > holdZoneBottom) {
      progress = (sectionCenter - holdZoneBottom) / (enterStart - holdZoneBottom);
    } else if (sectionCenter < holdZoneTop) {
      progress = (holdZoneTop - sectionCenter) / (holdZoneTop - exitEnd);
    }

    progress = Math.min(1, Math.max(0, progress));

    const smoothProgress = Math.pow(progress, 1.35);

    const offsetPercent = smoothProgress * maxOffset;
    const opacity = 1 - smoothProgress;

    profileImg.style.transform = `translate3d(${offsetPercent.toFixed(2)}%, 0, 0)`;
    profileImg.style.opacity = opacity.toFixed(3);
  }

  let isTicking = false;
  window.addEventListener("scroll", () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        updateProfileImagePosition();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", updateProfileImagePosition);
  updateProfileImagePosition();
}

document.querySelector("#year").textContent = new Date().getFullYear();