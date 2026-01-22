// Mobile menu
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
});

// Close menu after click (mobile)
document.querySelectorAll('#navLinks a').forEach(a => {
    a.addEventListener('click', () => {
        if (navLinks.classList.contains("open")) {
            navLinks.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Menü öffnen");
        }
    });
});

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
    });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Form validation + friendly feedback (no backend)
const form = document.getElementById("contactForm");
const toast = document.getElementById("toast");
const submitBtn = document.getElementById("submitBtn");

function setError(id, msg) {
    const el = document.querySelector(`.error[data-for="${id}"]`);
    if (el) el.textContent = msg || "";
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    // reset errors
    ["name","email","message","phone"].forEach(k => setError(k, ""));

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    let ok = true;

    if (name.length < 2) { setError("name", "Bitte Ihren Namen eingeben."); ok = false; }
    if (!isValidEmail(email)) { setError("email", "Bitte eine gültige E-Mail eingeben."); ok = false; }
    if (message.length < 10) { setError("message", "Bitte kurz beschreiben (mind. 10 Zeichen)."); ok = false; }

    // optional phone: only basic length check
    if (phone && phone.replace(/\D/g, "").length < 7) {
        setError("phone", "Telefonnummer wirkt zu kurz (optional).");
        ok = false;
    }

    if (!ok) {
        toast.style.display = "block";
        toast.style.borderColor = "rgba(180,35,24,.25)";
        toast.style.background = "rgba(180,35,24,.08)";
        toast.textContent = "Bitte prüfen Sie die markierten Felder.";
        return;
    }

    // Compose mailto (works without backend)
    const service = document.getElementById("service").value;
    const subject = encodeURIComponent(`Anfrage: ${service} – ${name}`);
    const body = encodeURIComponent(
        `Name: ${name}\nE-Mail: ${email}\nTelefon: ${phone || "-"}\nService: ${service}\n\nNachricht:\n${message}\n`
    );

    // UX: button loading
    submitBtn.disabled = true;
    submitBtn.textContent = "Wird vorbereitet...";

    setTimeout(() => {
        window.location.href = `mailto:info@taue-reinigung.de?subject=${subject}&body=${body}`;

        toast.style.display = "block";
        toast.style.borderColor = "rgba(16,185,129,.25)";
        toast.style.background = "rgba(16,185,129,.10)";
        toast.textContent = "Danke! Ihre Anfrage wird jetzt geöffnet (E-Mail).";

        submitBtn.disabled = false;
        submitBtn.textContent = "Anfrage absenden";
        form.reset();
    }, 450);
});
