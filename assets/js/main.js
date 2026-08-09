const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => header.classList.toggle('visible', window.scrollY > 80), { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

// Contagem regressiva
const weddingDate = new Date('2026-09-12T16:00:00-03:00');
const countdown = {
  days: document.getElementById('days'), hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'), seconds: document.getElementById('seconds')
};
function updateCountdown() {
  const diff = weddingDate - new Date();
  if (diff <= 0) { Object.values(countdown).forEach(el => el.textContent = '00'); return; }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff % 86400000 / 3600000);
  const minutes = Math.floor(diff % 3600000 / 60000);
  const seconds = Math.floor(diff % 60000 / 1000);
  countdown.days.textContent = String(days).padStart(2, '0');
  countdown.hours.textContent = String(hours).padStart(2, '0');
  countdown.minutes.textContent = String(minutes).padStart(2, '0');
  countdown.seconds.textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Carrossel da história
const carousel = document.querySelector('.photo-carousel');
if (carousel) {
  const track = carousel.querySelector('.carousel-track');
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dots = carousel.querySelector('.carousel-dots');
  let current = 0;
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir para foto ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
  });
  const dotEls = [...dots.children];
  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dotEls.forEach((d, i) => d.classList.toggle('active', i === current));
  }
  carousel.querySelector('.carousel-prev').addEventListener('click', () => goTo(current - 1));
  carousel.querySelector('.carousel-next').addEventListener('click', () => goTo(current + 1));
  let startX = 0;
  track.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => { const delta = e.changedTouches[0].clientX - startX; if (Math.abs(delta) > 45) goTo(current + (delta < 0 ? 1 : -1)); }, { passive: true });
}

// Autoplay do carrossel
if (carousel) {
  const autoplayInterval = 5000;
  const nextButton = carousel.querySelector('.carousel-next');
  setInterval(() => nextButton.click(), autoplayInterval);
}


// Mensagens para os noivos — Xano
const XANO_MESSAGES_ENDPOINT = 'https://x8ki-letl-twmt.n7.xano.io/api:AhzlN-Et/messages';

const messageForm = document.getElementById('message-form');
if (messageForm) {
  const messageSubmit = document.getElementById('message-submit');
  const messageFeedback = document.getElementById('message-feedback');

  messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('guest-name').value.trim();
    const message = document.getElementById('guest-message').value.trim();

    if (!name || !message) return;

    messageSubmit.disabled = true;
    messageSubmit.textContent = 'Enviando...';
    messageFeedback.textContent = '';
    messageFeedback.className = 'message-feedback';

    try {
      const response = await fetch(XANO_MESSAGES_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, message })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      messageForm.reset();
      messageFeedback.textContent = '❤️ Obrigado pelo carinho! Sua mensagem foi enviada.';
      messageFeedback.className = 'message-feedback success';
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      messageFeedback.textContent = 'Não conseguimos enviar sua mensagem. Tente novamente em instantes.';
      messageFeedback.className = 'message-feedback error';
    } finally {
      messageSubmit.disabled = false;
      messageSubmit.textContent = 'Enviar mensagem';
    }
  });
}
