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
    setTimeout(updateParticleColor, 300); // Update particle color on theme change
});

// ------------------ Background Particles (Three.js) ------------------

const canvas = document.getElementById('background-canvas');
let scene, camera, renderer, particles;
let particlePositions;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let animationActive = true;
let rafId = null;

function initBackground() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.z = 400;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent background

    // reduced particle count for performance
    const particleCount = 450;
    const geometry = new THREE.BufferGeometry();
    particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i*3] = (Math.random() * 1600) - 800;    // x
        particlePositions[i*3 + 1] = (Math.random() * 800) - 400; // y
        particlePositions[i*3 + 2] = (Math.random() * 800) - 400; // z
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const material = new THREE.PointsMaterial({
        color: document.body.classList.contains('light-mode') ? 0x111111 : 0xffffff,
        size: 1.8,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    window.addEventListener('resize', onWindowResize, { passive: true });
    document.addEventListener('mousemove', onDocumentMouseMove, { passive: true });
    document.addEventListener('click', onDocumentClick, { passive: true });

    animateBackground();
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
}

function onDocumentClick() {
    // subtle scatter, not heavy
    for (let i = 0; i < particlePositions.length; i += 3) {
        particlePositions[i] += (Math.random() - 0.5) * 20;
        particlePositions[i + 1] += (Math.random() - 0.5) * 20;
    }
    particles.geometry.attributes.position.needsUpdate = true;
}

function animateBackground() {
    if (!animationActive) return;
    rafId = requestAnimationFrame(animateBackground);

    // Rotate and subtle motion
    particles.rotation.y += 0.0009 + (mouseX * 0.000002);
    particles.rotation.x += 0.0009 + (-mouseY * 0.000002);

    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.0006;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

// pause/resume based on page visibility for perf
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        animationActive = false;
        if (rafId) cancelAnimationFrame(rafId);
    } else {
        animationActive = true;
        animateBackground();
    }
});

function updateParticleColor() {
    if (!particles) return;
    particles.material.color.set(document.body.classList.contains('light-mode') ? 0x111111 : 0xffffff);
}

initBackground();

// ------------------ Eyes + Character Interaction (kept lightweight) ------------------
document.addEventListener('DOMContentLoaded', () => {
    const character = document.getElementById('character-container');
    const eyes = document.getElementById('eyes');

    if (character && eyes) {
        const eyeMoveRange = 12;
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const rect = character.getBoundingClientRect();
            const charX = rect.left + rect.width / 2;
            const charY = rect.top + rect.height / 2;
            const angle = Math.atan2(clientY - charY, clientX - charX);
            const distance = Math.min(eyeMoveRange, Math.hypot(clientX - charX, clientY - charY) / 10);
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            eyes.style.transform = `translate(${x}px, ${y}px)`;
        }, { passive: true });
    }
});

// ------------------ Typing & Backspacing Loop (cycles and restarts on scroll) ------------------

const typedElement = document.getElementById('typed-text');
const roles = ['Full Stack Developer', 'AI Prompt Engineer', 'Creative Thinker'];
let roleIndex = 0;
let charIndex = 0;
let typingSpeed = 80;   // ms per char (tweakable)
let deletingSpeed = 40;
let pauseAfterTyping = 1400;
let pauseAfterDeleting = 300;
let typingTimer = null;
let typingActive = true;

// Typing loop functions
function startTyping() {
    if (!typedElement) return;
    clearTimeout(typingTimer);
    typingActive = true;
    typeChar();
}

function stopTyping() {
    typingActive = false;
    clearTimeout(typingTimer);
}

function typeChar() {
    if (!typingActive) return;
    const currentRole = roles[roleIndex];
    if (charIndex < currentRole.length) {
        typedElement.textContent += currentRole.charAt(charIndex);
        charIndex++;
        typingTimer = setTimeout(typeChar, typingSpeed);
    } else {
        // finished typing; pause then delete
        typingTimer = setTimeout(() => deleteChar(), pauseAfterTyping);
    }
}

function deleteChar() {
    if (!typingActive) return;
    if (charIndex > 0) {
        typedElement.textContent = typedElement.textContent.slice(0, -1);
        charIndex--;
        typingTimer = setTimeout(deleteChar, deletingSpeed);
    } else {
        // move to next role
        roleIndex = (roleIndex + 1) % roles.length;
        typingTimer = setTimeout(typeChar, pauseAfterDeleting);
    }
}

// Start typing on load
document.addEventListener('DOMContentLoaded', () => {
    // small delay so AOS finishes its initial animation and page has painted
    setTimeout(startTyping, 450);
});

// Restart typing when hero is re-entered using IntersectionObserver
const heroSection = document.getElementById('top');
if (heroSection) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // restart typing loop
                stopTyping();
                typedElement.textContent = '';
                charIndex = 0;
                roleIndex = 0;
                setTimeout(startTyping, 200);
            } else {
                // optionally stop when out of view (less CPU)
                stopTyping();
            }
        });
    }, { root: null, threshold: 0.2 });

    io.observe(heroSection);
}

// ------------------ Clean-up: (removed robot init + interactions to keep page lightweight) --
// (We intentionally do NOT initialize the previous 3D robot to keep performance and to honor the removal request.)
