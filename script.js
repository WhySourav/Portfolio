// Year update
document.getElementById('year').textContent = new Date().getFullYear();

// Form submission (demo)
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        statusEl.textContent = "Thanks! Your message has been queued.";
        setTimeout(() => { statusEl.textContent = '' }, 3000);
        form.reset();
    });
}

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

// ------------------Interactive Background: Constellation Effect -----------_----------
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        this.x += this.speedX;
        this.y += this.speedY;
    }
    draw(particleColor) {
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function connectParticles(particleColor) {
    let opacityValue = 1;
    // Connect particles to each other
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let distance = Math.sqrt(
                (particles[a].x - particles[b].x) * (particles[a].x - particles[b].x) +
                (particles[a].y - particles[b].y) * (particles[a].y - particles[b].y)
            );
            if (distance < 100) {
                opacityValue = 1 - (distance / 100);
                let lineColor = particleColor.replace('1)', `${opacityValue})`);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
    // Connect particles to mouse
    if (mouse.x && mouse.y) {
        for (let i = 0; i < particles.length; i++) {
            let distance = Math.sqrt(
                (particles[i].x - mouse.x) * (particles[i].x - mouse.x) +
                (particles[i].y - mouse.y) * (particles[i].y - mouse.y)
            );
            if (distance < 150) {
                opacityValue = 1 - (distance / 150);
                let lineColor = particleColor.replace('1)', `${opacityValue})`);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLightMode = document.body.classList.contains('light-mode');
    const particleColor = isLightMode ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)';

    for (const p of particles) {
        p.update();
        p.draw(particleColor);
    }
    connectParticles(particleColor);
    requestAnimationFrame(animate);
}

// Event Listeners for background
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

resizeCanvas();
initParticles();
animate();

// ------------------Interactive Character in "Work With Me" section -----------_----------
document.addEventListener('DOMContentLoaded', () => {
    const character = document.getElementById('character-container');
    const eyes = document.getElementById('eyes');

    if (character && eyes) {
        const eyeMoveRange = 15; // How far the pupils can move in pixels

        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const rect = character.getBoundingClientRect();

            // Center of the character SVG
            const charX = rect.left + rect.width / 2;
            const charY = rect.top + rect.height / 2;

            // Angle and distance from character to cursor
            const angle = Math.atan2(clientY - charY, clientX - charX);
            const distance = Math.min(eyeMoveRange, Math.hypot(clientX - charX, clientY - charY) / 10);
            
            // Calculate pupil position
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            eyes.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
});