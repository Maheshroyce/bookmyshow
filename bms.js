// --------------- Modal ---------------
function toggleModal(id, show) {
  document.getElementById(id).style.display = show ? 'block' : 'none';
}

// Connect banner buttons to slideshow object
function showSlide(n) {
  slideshow.show(n);
}

function openLocationModal() {
  toggleModal('locationModal', true);
}

function closeLocationModal() {
  toggleModal('locationModal', false);
}

function openSigninModal() {
  toggleModal('signinModal', true);
}

function closeSigninModal() {
  toggleModal('signinModal', false);
  document.getElementById('signinForm').reset();
}

// --------------- Location ---------------
document.querySelectorAll('.popular-cities span').forEach(tag => {
  tag.addEventListener('click', () => {
    document.querySelector('.location').textContent = tag.textContent + " ▼";
    toggleModal('locationModal', false);
  });
});

function detectLocation() {
  alert("Detecting your location...");
}

// --------------- Slideshow ---------------
const slideshow = {
  index: 0,
  start() {
    const slides = document.querySelectorAll(".slide");
    if (!slides.length) return;
    this.slides = slides;
    this.show(0);
    this.timer = setInterval(() => this.show(1), 4000);
  },
  show(n) {
    this.index = (this.index + n + this.slides.length) % this.slides.length;
    this.slides.forEach((s, i) => s.style.display = i === this.index ? 'block' : 'none');
  }
};

// --------------- Count Utilities ---------------
const CountUtils = {
  parse(text) {
    const num = parseFloat(text.replace('k', ''));
    return text.includes('k') ? num * 1000 : num;
  },
  format(num) {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
  }
};

// --------------- Like / Vote Handlers ---------------
function setupCountToggles(type) {
  const spans = document.querySelectorAll(`.${type}`);
  spans.forEach(span => {
    const title = span.closest('.movie-card')?.querySelector('.title')?.textContent.trim();
    if (!title) return;

    const key = `${title}-${type}d`;
    const textNode = span.lastChild;
    const saved = localStorage.getItem(key) === 'true';

    if (saved) span.classList.add('active');

    span.addEventListener('click', () => {
      const count = CountUtils.parse(textNode.textContent.trim());
      const isActive = span.classList.toggle('active');
      const newCount = Math.max(0, count + (isActive ? 1 : -1));

      localStorage.setItem(key, isActive);
      textNode.textContent = ' ' + CountUtils.format(newCount);

      // Feedback
      span.style.transform = 'scale(1.2)';
      span.style.transition = 'transform 0.2s ease';
      setTimeout(() => span.style.transform = '', 200);
    });
  });
}

// --------------- Movie Navigation ---------------
const currentGroups = {};

function showMovieGroup(direction, sectionId) {
  const section = document.getElementById(sectionId);
  const cards = section.querySelectorAll('.movie-card');
  const prevBtn = section.querySelector('.movie-prev');
  const nextBtn = section.querySelector('.movie-next');

  if (!currentGroups[sectionId]) currentGroups[sectionId] = 0;
  const totalGroups = Math.ceil(cards.length / 5);

  currentGroups[sectionId] = (currentGroups[sectionId] + direction + totalGroups) % totalGroups;

  cards.forEach((card, i) => {
    card.style.display = (i >= currentGroups[sectionId] * 5 && i < (currentGroups[sectionId] + 1) * 5) ? 'block' : 'none';
  });

  prevBtn?.classList.toggle('hidden', currentGroups[sectionId] === 0);
  nextBtn?.classList.toggle('hidden', currentGroups[sectionId] === totalGroups - 1);
}

// --------------- Section Navigation ---------------
function showSection(sectionId) {
  const sections = document.querySelectorAll('.recommended');
  sections.forEach(section => {
    section.style.display = section.id === sectionId ? 'block' : 'none';
  });
}

// --------------- On DOM Load ---------------
document.addEventListener("DOMContentLoaded", () => {
  slideshow.start();
  setupCountToggles('like');
  setupCountToggles('vote');
  showMovieGroup(0, 'recommended1');
  showMovieGroup(0, 'recommended2');
  showMovieGroup(0, 'recommended3');
  showMovieGroup(0, 'recommended4');
  showMovieGroup(0, 'recommended5');

  const signinForm = document.getElementById('signinForm');
  if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('emailInput').value.trim();
      const password = document.getElementById('passwordInput').value.trim();
      if (email && password) {
        alert(`Signed in successfully with email: ${email}`);
        closeSigninModal();
      } else {
        alert('Please enter both email and password.');
      }
    });
  }
});
