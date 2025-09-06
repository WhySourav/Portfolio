// Year update
document.getElementById('year').textContent = new Date().getFullYear();

// Tilt effect
const tilt = document.getElementById('tilt');
tilt.addEventListener('mousemove', (e) => {
  const rect = tilt.getBoundingClientRect();
  const x = e.clientX - rect.left, y = e.clientY - rect.top;
  const rx = ((y / rect.height) - 0.5) * -8;
  const ry = ((x / rect.width) - 0.5) * 14;
  tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
});
tilt.addEventListener('mouseleave', () => {
  tilt.style.transform = 'rotateX(0) rotateY(0)';
});

// Form submission (demo)
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  status.textContent = "Thanks! Your message has been queued.";
  form.reset();
});
// Theme toggle
const toggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'light') {
  document.body.classList.add('light-mode');
  toggleBtn.textContent = '☀️';
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  toggleBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});


// Listen for form submission




