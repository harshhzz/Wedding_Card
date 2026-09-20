/* =====================================================
   Wedding Invitation V2
   Vanilla JS interactions
   ===================================================== */

// ===== AOS =====
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 900,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
  });
}

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const music = document.getElementById('music');
  const musicToggle = document.getElementById('musicToggle');
  const slideImage = document.getElementById('slide-image');
  const slideTitle = document.getElementById('slide-title');
  const slideText = document.getElementById('slide-text');
  const dotsContainer = document.querySelector('.dots');
  const prevBtn = document.querySelector('.gallery-nav.prev');
  const nextBtn = document.querySelector('.gallery-nav.next');
  const copyAddressBtn = document.querySelector('#venue .btn-ghost');
  const submitBtn = document.querySelector('.submit-btn');

  const slides = [
    {
      src: 'https://drive.google.com/thumbnail?id=1r2qTrvxfncyZjE004eZM2NWscvn0kfF-&sz=w1000',
      title: 'Golden Florals',
      text: 'Soft romantic framing',
    },
    {
      src: 'https://drive.google.com/thumbnail?id=1zDKrKu5yOixGsQTa839ccx5PSd8Fs0Sy&sz=w1000',
      title: 'Mandap Glow',
      text: 'Warm ceremonial light',
    },
    {
      src: 'https://drive.google.com/thumbnail?id=1_ThA4h44ZFOMZc9weNg1z7CKFcqhcDHN&sz=w1000',
      title: 'Couple Silhouette',
      text: 'Elegant evening moment',
    },
    {
      src: 'https://drive.google.com/thumbnail?id=1Ba5KnnJbQtlaiUUt_4ogNmM51I_A4BsF&sz=w1000',
      title: 'Family Blessings',
      text: 'Love from everyone',
    },
    {
      src: 'https://drive.google.com/thumbnail?id=1pFO_i2LkfdKkDq_cQDXvttNgntJ-ntXH&sz=w1000',
      title: 'Celebration Lights',
      text: 'Joyful night memories',
    },
  ];

  let currentSlide = 0;
  let slideTimer = null;
  let musicOn = false; 
  let loaderHidden = false;

  const setLoaderHidden = () => {
    if (loaderHidden || !loader) return;
    loaderHidden = true;
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    loader.style.pointerEvents = 'none';
    startMusic();
  };

  // Hide loader after a short cinematic pause
  window.setTimeout(setLoaderHidden, 2800);
  window.addEventListener('load', setLoaderHidden);

  // ===== Countdown =====
  const weddingDate = new Date('2026-11-21T19:00:00').getTime();
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = Date.now();
    const diff = weddingDate - now;

    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // ===== Gallery =====
  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = index === currentSlide ? 'dot active' : 'dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to image ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlide() {
    if (!slideImage) return;

    slideImage.style.opacity = '0';
    slideImage.style.transform = 'scale(1.01)';

    window.setTimeout(() => {
      const slide = slides[currentSlide];
      slideImage.src = slide.src;
      slideImage.alt = slide.title;
      if (slideTitle) slideTitle.textContent = slide.title;
      if (slideText) slideText.textContent = slide.text;
      slideImage.style.opacity = '1';
      slideImage.style.transform = 'scale(1)';
      renderDots();
    }, 180);
  }

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    updateSlide();
    restartAutoSlide();
  }

  function restartAutoSlide() {
    if (slideTimer) {
      window.clearInterval(slideTimer);
    }
    slideTimer = window.setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlide();
    }, 4500);
  }

  if (slideImage) {
    slideImage.style.transition = 'opacity 240ms ease, transform 700ms ease';
    slideImage.loading = 'eager';
    updateSlide();
    restartAutoSlide();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  }

  // Swipe on mobile
  if (slideImage) {
    let touchStartX = 0;
    let touchEndX = 0;

    slideImage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slideImage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) < 40) return;
      if (diff > 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
    }, { passive: true });
  }

  // ===== Music =====
//   async function toggleMusic() {

//     if (!music) return;

//     if (music.paused) {

//         await music.play();

//         musicOn = true;

//         musicToggle.innerHTML =
//             '<i class="fa-solid fa-pause"></i>';

//     } else {

//         music.pause();

//         musicOn = false;

//         musicToggle.innerHTML =
//             '<i class="fa-solid fa-music"></i>';

//     }

// }
  // Try to start music gently after first user interaction
 // ===== Auto Start Music =====

// ===== Music =====

music.volume = 1;

async function startMusic() {

    if (!music.paused) return;

    try {

        await music.play();

        musicOn = true;

        if (musicToggle) {
            musicToggle.innerHTML =
                '<i class="fa-solid fa-pause"></i>';
        }

    } catch (err) {
        console.log("Autoplay blocked");
    }

}

async function toggleMusic() {

    if (!music) return;

    try {

        if (music.paused) {

            await music.play();

            musicOn = true;

            musicToggle.innerHTML =
                '<i class="fa-solid fa-pause"></i>';

        } else {

            music.pause();

            musicOn = false;

            musicToggle.innerHTML =
                '<i class="fa-solid fa-music"></i>';

        }

    } catch (err) {
        console.log(err);
    }

}

// Button
if (musicToggle) {
    musicToggle.addEventListener("click", toggleMusic);
    // Auto start after first interaction
    document.addEventListener("pointerdown", startMusic, { once: true });
    document.addEventListener("click", startMusic, { once: true });
    document.addEventListener("touchstart", startMusic, { once: true });
    document.addEventListener("scroll", startMusic, { once: true });
}



  // ===== Copy venue address =====
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', async () => {
      const address = 'J P Palace, 56B, RailVihar Ph-2 Colony, Raptinagar Phase -4, Gorakhpur, Uttar Pradesh 273013';
      try {
        await navigator.clipboard.writeText(address);
        copyAddressBtn.textContent = 'Copied!';
        window.setTimeout(() => {
          copyAddressBtn.textContent = 'Copy address';
        }, 1400);
      } catch {
        // Fallback for browsers without clipboard permission
        window.prompt('Copy the venue address:', address);
      }
    });
  }

  // ===== RSVP button =====
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz2yeWTX0Vl1eQlR-YuwttYwD2oLei36QUzv2ci9OWYuio_-fZpeRZGYsamksZX6z2b/exec";

if (submitBtn) {
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();;

    const data = {
      name: document.querySelector("#name").value,
      phone: document.querySelector("#phone").value,
      guests: document.querySelector("#guests").value,
      attendance: document.querySelector("#attendance").value,
      message: document.querySelector("#message").value
    };

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("guests", data.guests);
      formData.append("attendance", data.attendance);
      formData.append("message", data.message);

   const response = await fetch(SCRIPT_URL, {
    method: "POST",
    body: formData
});

const result = await response.text();

if (result === "Success") {
    alert("RSVP submitted successfully ❤️");
    document.getElementById("rsvpForm").reset();
}

      

      if (result.result === "success") {
        alert("❤️ Thank you! Your RSVP has been received.");
        document.getElementById("rsvpForm").reset();
      } else {
        alert("Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to submit RSVP.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send RSVP";
    }
  });
}
});
