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

// ------------------ 3D Interactive Background with Three.js ------------------

const canvas = document.getElementById('background-canvas');
let scene, camera, renderer, particles;
let particlePositions;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initBackground() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.z = 400;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent background

    const particleCount = 800;
    const geometry = new THREE.BufferGeometry();
    particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i*3] = (Math.random() * 800) - 400;    // x
        particlePositions[i*3 + 1] = (Math.random() * 800) - 400; // y
        particlePositions[i*3 + 2] = (Math.random() * 800) - 400; // z
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const material = new THREE.PointsMaterial({
        color: document.body.classList.contains('light-mode') ? 0x111111 : 0xffffff,
        size: 2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('click', onDocumentClick);

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
    // On click, scatter particles randomly for a brief moment
    for (let i = 0; i < particlePositions.length; i += 3) {
        particlePositions[i] += (Math.random() - 0.5) * 50;
        particlePositions[i + 1] += (Math.random() - 0.5) * 50;
        particlePositions[i + 2] += (Math.random() - 0.5) * 50;
    }
    particles.geometry.attributes.position.needsUpdate = true;
}

function animateBackground() {
    requestAnimationFrame(animateBackground);

    // Slowly rotate the particle field based on mouse position
    particles.rotation.y += 0.001 + (mouseX * 0.00001);
    particles.rotation.x += 0.001 + (-mouseY * 0.00001);

    // Slight floating effect
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.001;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

// Update particle color on theme toggle
function updateParticleColor() {
    if (!particles) return;
    particles.material.color.set(document.body.classList.contains('light-mode') ? 0x111111 : 0xffffff);
}

initBackground();

// ------------------ Interactive Character in "Work With Me" section ------------------

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

// ------------------ 3D Interactive Robot next to Hero Section ------------------

const robotContainer = document.getElementById('robot-container');
let robotScene, robotCamera, robotRenderer, robotMesh;

function initRobot() {
    robotScene = new THREE.Scene();

    robotCamera = new THREE.PerspectiveCamera(45, robotContainer.clientWidth / robotContainer.clientHeight, 0.1, 1000);
    robotCamera.position.z = 5;

    robotRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    robotRenderer.setSize(robotContainer.clientWidth, robotContainer.clientHeight);
    robotContainer.appendChild(robotRenderer.domElement);

    // Simple robot geometry: a box with eyes (spheres)
    const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x7C3AED, metalness: 0.6, roughness: 0.4 });
    robotMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    robotScene.add(robotMesh);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.4, 0.3, 0.51);
    rightEye.position.set(0.4, 0.3, 0.51);
    robotMesh.add(leftEye);
    robotMesh.add(rightEye);

    // Pupils
    const pupilGeometry = new THREE.SphereGeometry(0.07, 16, 16);
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x0b0f1a });
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(0, 0, 0.16);
    rightPupil.position.set(0, 0, 0.16);
    leftEye.add(leftPupil);
    rightEye.add(rightPupil);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    robotScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    robotScene.add(directionalLight);

    // Interaction: rotate robot based on mouse movement inside container
    robotContainer.addEventListener('mousemove', (e) => {
        const rect = robotContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Rotate robot mesh slightly based on cursor position
        robotMesh.rotation.y = (x - 0.5) * 0.6; // left-right rotation
        robotMesh.rotation.x = (y - 0.5) * 0.6; // up-down rotation
    });

    robotContainer.addEventListener('mouseleave', () => {
        // Reset rotation when mouse leaves
        robotMesh.rotation.x = 0;
        robotMesh.rotation.y = 0;
    });

    animateRobot();
}

function animateRobot() {
    requestAnimationFrame(animateRobot);
    // Subtle idle rotation
    robotMesh.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
    robotRenderer.render(robotScene, robotCamera);
}

window.addEventListener('resize', () => {
    if (!robotRenderer) return;
    robotCamera.aspect = robotContainer.clientWidth / robotContainer.clientHeight;
    robotCamera.updateProjectionMatrix();
    robotRenderer.setSize(robotContainer.clientWidth, robotContainer.clientHeight);

    // Also update background canvas size
    onWindowResize();
});



initRobot();





// Toggle button for mobile menu
document.getElementById('toggle-button').addEventListener('click', function() {
  document.getElementById('navbar-links').classList.toggle('active');
});

// Restart animations on scroll using Intersection Observer
const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1; // Fade in
      entry.target.style.transform = 'translateY(0)'; // Smooth entry
    } else {
      entry.target.style.opacity = 0; // Fade out to restart
      entry.target.style.transform = 'translateY(20px)'; // Subtle reset
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  observer.observe(section);
});

// Remove robot on mobile devices
if (window.innerWidth < 768) {
  const robotElement = document.getElementById('robot-follower'); // Assuming this ID for the robot
  if (robotElement) {
    robotElement.style.display = 'none'; // Hide on smaller screens
  }
}

// Make projects clickable with redirects
document.querySelectorAll('.project-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href'); // Get the link
    if (href) {
      window.location.href = href; // Redirect to the project
    }
  });
});