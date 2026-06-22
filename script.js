/* ═══════════════════════════════════════════════════
   CARRÉ D'ART DÉCO — script.js
   • Header scroll effect
   • Mobile nav
   • Reveal on scroll (IntersectionObserver)
   • Smooth anchor scrolling
   • EmailJS form with validation
   ═══════════════════════════════════════════════════ */

// ─── EmailJS init ────────────────────────────────────
emailjs.init("OEUrhXVL8M1csX9IL"); // Public key

// ─── HEADER SCROLL EFFECT ────────────────────────────
const header = document.getElementById("header");

const handleHeaderScroll = () => {
  if (window.scrollY > 60) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
};
window.addEventListener("scroll", handleHeaderScroll, { passive: true });
handleHeaderScroll();

// ─── MOBILE NAV ─────────────────────────────────────
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");
const mobileClose = document.getElementById("mobileClose");
const mobileLinks = mobileNav.querySelectorAll(".mobile-nav__link");

const openMobileNav = () => {
  mobileNav.classList.add("open");
  document.body.style.overflow = "hidden";
};
const closeMobileNav = () => {
  mobileNav.classList.remove("open");
  document.body.style.overflow = "";
};

burger.addEventListener("click", openMobileNav);
mobileClose.addEventListener("click", closeMobileNav);
mobileLinks.forEach((link) => link.addEventListener("click", closeMobileNav));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileNav();
});

// ─── SMOOTH SCROLL ANCHORS ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const id = this.getAttribute("href");
    if (id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 20;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

// ─── REVEAL ON SCROLL ────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// ─── IMAGE LAZY LOADING fallback ─────────────────────
if ("loading" in HTMLImageElement.prototype === false) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imgObserver.unobserve(img);
      }
    });
  });
  images.forEach((img) => imgObserver.observe(img));
}

// ─── FORM VALIDATION & EMAILJS SUBMISSION ────────────
const form = document.getElementById("orderForm");
const submitBtn = document.getElementById("submitBtn");
const submitText = document.getElementById("submitText");
const formSuccess = document.getElementById("formSuccess");

function showError(fieldId, msg) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + "Error");
  if (input) input.classList.add("error");
  if (error) error.textContent = msg;
}

function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + "Error");
  if (input) input.classList.remove("error");
  if (error) error.textContent = "";
}

["nom", "prenom", "telephone"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", () => clearError(id));
});

function validateForm() {
  let valid = true;

  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const telephone = document.getElementById("telephone").value.trim();

  clearError("nom");
  clearError("prenom");
  clearError("telephone");

  if (!nom) {
    showError("nom", "Le nom est obligatoire.");
    valid = false;
  } else if (nom.length < 2) {
    showError("nom", "Le nom doit contenir au moins 2 caractères.");
    valid = false;
  }

  if (!prenom) {
    showError("prenom", "Le prénom est obligatoire.");
    valid = false;
  } else if (prenom.length < 2) {
    showError("prenom", "Le prénom doit contenir au moins 2 caractères.");
    valid = false;
  }

  if (!telephone) {
    showError("telephone", "Le téléphone est obligatoire.");
    valid = false;
  } else if (!/^[\d\s\+\-\(\)]{8,}$/.test(telephone)) {
    showError("telephone", "Veuillez entrer un numéro valide.");
    valid = false;
  }

  return valid;
}

// Form submit
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  submitBtn.disabled = true;
  submitText.textContent = "Envoi en cours…";

  // ✅ CORRECTION : "wilaya" au lieu de "email" (le champ s'appelle wilaya dans le HTML)
  const templateParams = {
    nom: document.getElementById("nom").value.trim(),
    prenom: document.getElementById("prenom").value.trim(),
    telephone: document.getElementById("telephone").value.trim(),
    wilaya: document.getElementById("wilaya").value.trim() || "Non renseignée",
    produit: document.getElementById("produit").value || "Non spécifié",
    dimension: document.getElementById("dimension").value || "Non spécifiée",
    adresse:
      document.getElementById("adresse").value.trim() || "Non renseignée",
    message: document.getElementById("message").value.trim() || "Aucun message",
  };

  try {
    await emailjs.send("service_6b9pu7i", "template_qc3p4rw", templateParams);

    form.reset();
    formSuccess.classList.add("show");
    formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (err) {
    console.error("EmailJS error:", err);
    alert(
      "Une erreur est survenue. Veuillez réessayer ou nous contacter directement par téléphone.",
    );
  } finally {
    submitBtn.disabled = false;
    submitText.textContent = "Envoyer ma commande";
  }
});

// ─── ACTIVE NAV LINK ON SCROLL ───────────────────────
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav__link");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id,
          );
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);

sections.forEach((section) => navObserver.observe(section));
