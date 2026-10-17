// ============================================================================
// KONFIGURACJA STRUKTURY KATALOGOWEJ ZDJĘĆ
// Zdjęcia umieszczaj w folderach: photos/<nazwa_kategorii>/<plik.jpg>
// ============================================================================
const GALLERY_FOLDERS = {
  gallery1: [
    "1.jpg",
    "2.jpg"
  ],
  gallery2: [
    "1.jpg",
    "2.jpg",
    "3.jpg"
  ],
  portrait: [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg"
  ],
  plener: [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg"
  ]
};

// ============================================================================
// MENU MOBILNE
// ============================================================================
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

// ============================================================================
// GALERIA KOLAŻOWA ORAZ POWIĘKSZANIE ZDJĘĆ (LIGHTBOX)
// ============================================================================
const galleryModal = document.querySelector("#gallery-modal");
const galleryModalTitle = document.querySelector("#gallery-modal-title");
const collageGrid = document.querySelector("#collage-grid");
const closeGalleryBtn = document.querySelector("#close-gallery");

const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const closeLightboxBtn = document.querySelector("#close-lightbox");

// Otwieranie kolażu po kliknięciu w główny kafelek projektu
document.querySelectorAll(".project").forEach(project => {
  project.addEventListener("click", () => {
    const category = project.dataset.category;
    const title = project.dataset.title || category.toUpperCase();
    const files = GALLERY_FOLDERS[category] || [];

    galleryModalTitle.textContent = title;
    collageGrid.innerHTML = "";

    files.forEach((fileName, index) => {
      const item = document.createElement("div");
      item.className = "collage-item";

      const img = document.createElement("img");
      img.src = `photos/${category}/${fileName}`;
      img.alt = `${title} - zdjęcie ${index + 1}`;
      img.loading = "lazy";

      // Kliknięcie w kafelek w kolażu otwiera zdjęcie na pełnym ekranie
      item.addEventListener("click", () => {
        openLightbox(img.src, img.alt);
      });

      item.appendChild(img);
      collageGrid.appendChild(item);
    });

    galleryModal.classList.add("open");
    galleryModal.setAttribute("aria-hidden", "false");
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
  if (event.target === galleryModal) closeGalleryModal();
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

// ============================================================================
// PRZESUWANIE ZDJĘCIA PROFILOWEGO ZALEŻNIE OD SCROLLA (Z ZATRZYMANIEM)
// ============================================================================
const aboutSection = document.querySelector("#about");
const profileImg = document.querySelector(".about-profile-img");

if (aboutSection && profileImg) {
  function updateProfileImagePosition() {
    const rect = aboutSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionCenter = rect.top + rect.height / 2;

    // --- PARAMETRY DO REGULACJI ŁAGODNOŚCI ---
    const maxOffset = 45;                        // Jak daleko w prawo ucieka zdjęcie w % (było 120 - zmniejszenie najbardziej uspokaja ruch)
    const holdZoneBottom = windowHeight * 0.65;  // Dolna granica zatrzymania
    const holdZoneTop = windowHeight * 0.35;     // Górna granica zatrzymania
    const enterStart = windowHeight * 1.45;      // Im WIĘKSZA liczba (np. 1.5), tym wolniej zdjęcie wjeżdża (było 1.15)
    const exitEnd = -windowHeight * 0.45;        // Im MNIEJSZA liczba (np. -0.5), tym wolniej zdjęcie wyjeżdża (było -0.15)
    // -----------------------------------------

    let progress = 0; // 0 = na miejscu, 1 = schowane

    if (sectionCenter > holdZoneBottom) {
      progress = (sectionCenter - holdZoneBottom) / (enterStart - holdZoneBottom);
    } else if (sectionCenter < holdZoneTop) {
      progress = (holdZoneTop - sectionCenter) / (holdZoneTop - exitEnd);
    }

    // Ograniczenie wartości do przedziału 0 - 1
    progress = Math.min(1, Math.max(0, progress));

    // Zastosowanie krzywej łagodzącej (ease-out), żeby zdjęcie miękko hamowało przed zatrzymaniem
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

// ============================================================================
// AKTUALNY ROK W STOPCE
// ============================================================================
document.querySelector("#year").textContent = new Date().getFullYear();