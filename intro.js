/* =============================================
   INTRO.JS — Gift box opening scene (Strict Countdown Mode)
   ============================================= */

let introStarted = false;
// Kunci target: Tepat tanggal 14 Agustus 2026 jam 00:00:00 waktu lokal device
const TARGET_DATE = new Date('August 14, 2026 00:00:00').getTime();

// Start intro particles immediately
document.addEventListener('DOMContentLoaded', () => {
  window.initIntroParticles();
  spawnIntroSparkles();
  
  // Proteksi awal: Sembunyikan element main site secara mutlak biar gak bocor
  const mainSite = document.getElementById('main-site');
  if (mainSite) {
    mainSite.style.setProperty('display', 'none', 'important');
  }

  updateHintStatus();
});

// Cek status apakah waktu saat ini masih terkunci
function isLocked() {
  const now = new Date().getTime();
  return now < TARGET_DATE;
}

// Logika update teks status petunjuk dan perhitungan mundur real-time
function updateHintStatus() {
  const hint = document.querySelector('.gift-hint');
  const timerElement = document.getElementById('countdown-timer');
  if (!hint || !timerElement) return;

  if (isLocked()) {
    hint.innerHTML = '🔒 Locked until August 14, 00:00 ✨';

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      // Kalkulasi Hari, Jam, Menit, dan Detik
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Render ke layar HTML
      timerElement.innerHTML = `${days} Hari  ${hours} Jam  ${minutes} Menit  ${seconds} Detik`;

      // Jika waktu hitung mundur selesai berjalan (menyentuh jam 00:00)
      if (distance < 0) {
        clearInterval(timer);
        timerElement.style.display = 'none'; 
        hint.innerHTML = '🎂 tap to open your gift ✨';
      }
    }, 1000);
  } else {
    // Jika user membuka web saat waktu target sudah lewat
    timerElement.style.display = 'none';
    hint.innerHTML = '🎂 tap to open your gift ✨';
  }
}

function spawnIntroSparkles() {
  const scene = document.getElementById('intro-scene');
  if (!scene) return;
  const symbols = ['✦', '✧', '⋆', '✸', '✹', '✺', '❋'];
  let count = 0;
  const max = 24;

  const interval = setInterval(() => {
    if (count >= max) { clearInterval(interval); return; }
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.cssText = `
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      color: rgba(255,${Math.floor(Math.random()*80)+140},${Math.floor(Math.random()*60)+160},0.8);
      font-size: ${Math.random() * 16 + 8}px;
      animation-duration: ${Math.random() * 3 + 2}s;
      animation-delay: ${Math.random() * 2}s;
    `;
    scene.appendChild(s);
    count++;
  }, 200);
}

function openGift() {
  // BLOKIR AKSES TOTAL JIKA BELUM JAMNYA
  if (isLocked()) {
    const hint = document.querySelector('.gift-hint');
    const box = document.getElementById('gift-box');
    
    if (box) {
      box.style.animation = 'none';
      box.offsetHeight; // trigger reflow
      box.style.animation = 'gift-shake 0.4s ease';
    }

    if (hint) {
      hint.innerHTML = '🔒 Sabar ya, kadonya belum boleh dibuka... 🌸';
      setTimeout(() => {
        if (isLocked()) hint.innerHTML = '🔒 Locked until August 14, 00:00 ✨';
      }, 2000);
    }
    return; // Potong proses eksekusi di sini agar tidak terbuka
  }

  if (introStarted) return;
  introStarted = true;

  const container = document.getElementById('gift-container');
  const box       = document.getElementById('gift-box');
  const lid       = box.querySelector('.gift-lid');
  const hint      = container.querySelector('.gift-hint');

  // Remove hint
  hint.style.transition = 'opacity 0.3s';
  hint.style.opacity = '0';
  setTimeout(() => hint.remove(), 300);

  // Shake
  box.style.animation = 'gift-shake 0.6s ease';

  setTimeout(() => {
    // Fly lid
    lid.style.animation = 'lid-fly 0.9s cubic-bezier(0.25,0.46,0.45,0.94) forwards';

    // Bloom flowers burst
    setTimeout(() => burstFlowers(), 300);

    // Start petal rain
    setTimeout(() => startPetalRain(), 600);

    // Fade to main site
    setTimeout(() => transitionToMain(), 3200);
  }, 700);
}

const BLOOM_FLOWERS = ['🌸','🌺','🌹','🌷','🌼','🪷','💐','🌸','🌺','🌹','🌸','🌷'];

function burstFlowers() {
  const container = document.getElementById('bloom-container');
  if (!container) return;

  BLOOM_FLOWERS.forEach((flower, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'bloom-flower';
      el.textContent = flower;
      el.style.fontSize = `${Math.random() * 2 + 2}rem`;

      const angle  = (i / BLOOM_FLOWERS.length) * 360 + Math.random() * 30;
      const dist1  = Math.random() * 80 + 60;
      const dist2  = Math.random() * 140 + 100;
      const dist3  = Math.random() * 200 + 160;
      const rad    = (angle * Math.PI) / 180;

      const tx  = Math.cos(rad) * dist1 + 'px';
      const ty  = Math.sin(rad) * dist1 + 'px';
      const tx2 = Math.cos(rad) * dist2 + 'px';
      const ty2 = Math.sin(rad) * dist2 + 'px';
      const tx3 = Math.cos(rad) * dist3 + 'px';
      const ty3 = Math.sin(rad) * dist3 + 'px';
      const rot  = Math.random() * 180 - 90;
      const rot2 = Math.random() * 360 - 180;
      const rot3 = Math.random() * 540 - 270;

      el.style.setProperty('--tx',   tx);
      el.style.setProperty('--ty',   ty);
      el.style.setProperty('--tx2',  tx2);
      el.style.setProperty('--ty2',  ty2);
      el.style.setProperty('--tx3',  tx3);
      el.style.setProperty('--ty3',  ty3);
      el.style.setProperty('--rot',  `${rot}deg`);
      el.style.setProperty('--rot2', `${rot2}deg`);
      el.style.setProperty('--rot3', `${rot3}deg`);
      el.style.animation = 'bloom-burst 2.2s cubic-bezier(0.25,0.46,0.45,0.94) forwards';

      container.appendChild(el);
      setTimeout(() => el.remove(), 2400);
    }, i * 80);
  });
}

const PETAL_SYMBOLS = ['🌸','🌺','🌷','🌼','🌹','🪷','💐'];

function startPetalRain() {
  const rain = document.getElementById('petal-rain-intro');
  if (!rain) return;

  let count = 0;
  const maxPetals = 60;

  const interval = setInterval(() => {
    if (count >= maxPetals) { clearInterval(interval); return; }

    const p = document.createElement('div');
    p.className = 'intro-petal';
    p.textContent = PETAL_SYMBOLS[Math.floor(Math.random() * PETAL_SYMBOLS.length)];

    const left     = Math.random() * 100;
    const duration = Math.random() * 2 + 2;
    const delay    = Math.random() * 1.5;
    const size     = Math.random() * 1.2 + 0.8;

    p.style.cssText = `
      left: ${left}%;
      font-size: ${size}rem;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    rain.appendChild(p);
    setTimeout(() => p.remove(), (duration + delay + 0.5) * 1000);
    count++;
  }, 60);
}

function transitionToMain() {
  const overlay = document.getElementById('intro-overlay');
  const intro   = document.getElementById('intro-scene');
  const main    = document.getElementById('main-site');

  // Lepaskan inline-style pengunci display:none
  if (main) main.style.display = '';

  // Fade white overlay in
  overlay.classList.add('fade-in');

  setTimeout(() => {
    // Show main site
    main.classList.remove('hidden');
    main.classList.add('entering');
    window.initParticles();
    window.initMainSite();

    // Hide intro
    setTimeout(() => {
      intro.style.display = 'none';
    }, 400);
  }, 800);
}
