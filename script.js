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





// ------------------Interactive Background Particle Effect -----------_----------

const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -100, y: -100 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: 'rgba(255, 255, 255, 0.2)'
    };
}

function init() {
    particles = [];
    for (let i = 0; i < 150; i++) { 
      // Increase or decrease this number for more/fewer particles
        particles.push(createParticle());
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isLightMode = document.body.classList.contains('light-mode');
    const particleColor = isLightMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Update particle position
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap particles around the screen
        if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
        if (p.y > canvas.height || p.y < 0) p.speedY *= -1;

        // Draw particle
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles near the mouse
        const distance = Math.sqrt((p.x - mouse.x) ** 2 + (p.y - mouse.y) ** 2);
        if (distance < 150) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 150})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
}

// Event Listeners
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
canvas.addEventListener('mouseleave', () => {
    mouse = { x: -100, y: -100 };
});

resizeCanvas();
init();
animate();





// Listen for form submission





