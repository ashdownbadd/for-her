import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';
import { scene, camera, renderer, initScene, setAmbiance } from './world.js';
import { createTable } from './table.js';
import { createPinkTablecloth } from './tablecloth.js';
import { createPlate } from './plate.js';
import { createCake } from './cake.js';
import { createCandles, animateCandles } from './candle.js';
import { createPhone } from './phone.js';
import { createLoveLetter } from './letter.js';
import { createNapkin } from './napkin.js';
import { createWineSet } from './wine.js';
import { createPolaroid } from './polaroid.js';
import { createRadio } from './radio.js';
import { createToy } from './toy.js';
import { createRingBox } from './ring.js';
import { initWeather } from '../../logics/weather.js';
import { initCalendar } from '../../logics/calendar.js';
import { openPhotosApp, closePhotosApp, openPhotoViewer, closePhotoViewer } from '../../logics/photos.js';
import { openClockApp, closeClockApp, updateStopwatch, initClockButtons } from '../../logics/clock.js';
import { openRadioUI } from '../../logics/radio.js';

const hotspotLayer = document.getElementById('hotspots-layer');
const activeHotspots = [];
const friction = 0.95;

let rot = 0;
let velocity = 0;
let targetDist = 2.5;
let dist = 20;
let isDragging = false;

// Initialize
initScene();
initWeather();
initCalendar();

// Add Objects
const table = createTable();
const pinkCloth = createPinkTablecloth();
const plate = createPlate();
const cake = createCake();
const candles = createCandles();

scene.add(table);
scene.add(pinkCloth);
scene.add(plate);
scene.add(cake);
scene.add(candles);

const phone = createPhone();
phone.position.set(1.5, 0.13, 0.85);
phone.rotation.y = Math.PI / 2 - 0.5;
scene.add(phone);

const loveLetter = createLoveLetter();
loveLetter.position.set(-1.5, 0.11, -1.0);
loveLetter.rotation.y = Math.PI / 1.5;
scene.add(loveLetter);

scene.add(createNapkin(new THREE.Vector3(0, 0.13, 2.8), 0));
scene.add(createNapkin(new THREE.Vector3(0, 0.13, -2.8), Math.PI));
scene.add(createWineSet(new THREE.Vector3(0.6, 0.11, 2.6), 0));
scene.add(createWineSet(new THREE.Vector3(-0.6, 0.11, -2.6), Math.PI));

const polaroid = createPolaroid(new THREE.Vector3(-1.45, 0.1, 0.9), { x: 0, y: 0.2, z: 0 });
scene.add(polaroid);

const radio = createRadio(new THREE.Vector3(2.4, 0.1, -1.6), 11.5);
scene.add(radio);

const teddy = createToy(new THREE.Vector3(0, 0.12, -1.8), Math.PI);
teddy.scale.set(0.6, 0.6, 0.6);
scene.add(teddy);

const ring = createRingBox(new THREE.Vector3(0, 0.12, 1.8), 0);
scene.add(ring);

// --- 1. CREATE HEART TEXTURE FIRST ---
const heartCanvas = document.createElement('canvas');
heartCanvas.width = 64;
heartCanvas.height = 64;
const ctx = heartCanvas.getContext('2d');
ctx.fillStyle = '#ffffff';
ctx.beginPath();
ctx.moveTo(32, 48);
ctx.bezierCurveTo(32, 48, 10, 36, 10, 20);
ctx.bezierCurveTo(10, 8, 24, 8, 32, 18);
ctx.bezierCurveTo(40, 8, 54, 8, 54, 20);
ctx.bezierCurveTo(54, 36, 32, 48, 32, 48);
ctx.fill();
const heartTexture = new THREE.CanvasTexture(heartCanvas);

// --- 2. HEART PARTICLE SYSTEM ---
const particleCount = 80; // More particles for better fullscreen spread
const heartPoints = [];
for (let i = 0; i < particleCount; i++) {
    heartPoints.push(new THREE.Vector3(
        (Math.random() - 0.5) * 25, // Wide horizontal spread
        (Math.random() - 0.5) * 15, // Initial vertical spread
        (Math.random() - 0.5) * 20  // Depth spread
    ));
}

const heartGeo = new THREE.BufferGeometry().setFromPoints(heartPoints);
const heartMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.25,             // Small hearts
    map: heartTexture,      // Now heartTexture is defined!
    transparent: true,
    opacity: 0, 
    alphaTest: 0.01,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const heartParticles = new THREE.Points(heartGeo, heartMat);
scene.add(heartParticles);

const velocities = Array.from({ length: particleCount }, () => Math.random() * 0.02 + 0.01);

// --- GLOBAL APP LOGIC ---
window.targetOpacity = 0;
window.openPhotosApp = openPhotosApp;
window.closePhotosApp = closePhotosApp;
window.openPhotoViewer = openPhotoViewer;
window.closePhotoViewer = closePhotoViewer;
window.openClockApp = openClockApp;
window.closeClockApp = closeClockApp;

window.openPhoneUI = () => {
    const wrapper = document.getElementById('phone-wrapper');
    wrapper.style.display = 'block';
    setTimeout(() => wrapper.classList.add('active'), 10);
};

window.closePhoneUI = () => {
    const clockApp = document.getElementById('clock-app-overlay');
    const photosApp = document.getElementById('photos-app-overlay');
    const photoViewer = document.getElementById('photo-viewer');
    const phoneWrapper = document.getElementById('phone-wrapper');

    if (photoViewer?.classList.contains('active')) closePhotoViewer();
    else if (clockApp?.classList.contains('active')) closeClockApp();
    else if (photosApp?.classList.contains('active')) closePhotosApp();
    else {
        phoneWrapper.classList.remove('active');
        setTimeout(() => phoneWrapper.style.display = 'none', 500);
    }
};

window.openLetterUI = () => {
    const wrapper = document.getElementById('letter-wrapper');
    wrapper.style.display = 'block';
    setTimeout(() => wrapper.classList.add('active'), 10);
};

window.closeLetterUI = () => {
    const wrapper = document.getElementById('letter-wrapper');
    wrapper.classList.remove('active');
    setTimeout(() => wrapper.style.display = 'none', 500);
};

// --- HOTSPOTS ---
function addHotspot(mesh, iconClass, offset) {
    const el = document.createElement('div');
    el.className = 'hotspot';
    el.innerHTML = `<i class="${iconClass}"></i>`;
    el.onclick = () => {
        if (iconClass.includes('fa-mobile-screen-button')) window.openPhoneUI();
        else if (iconClass.includes('fa-envelope-open-text')) window.openLetterUI();
        else if (iconClass.includes('fa-radio')) openRadioUI();
        else alert("Clicked!");
    };
    hotspotLayer.appendChild(el);
    activeHotspots.push({ el, mesh, offset });
}

addHotspot(cake, 'fa-solid fa-cake-candles', new THREE.Vector3(0, 1.0, 0));
addHotspot(phone, 'fa-solid fa-mobile-screen-button', new THREE.Vector3(0, 0.4, 0));
addHotspot(loveLetter, 'fa-solid fa-envelope-open-text', new THREE.Vector3(0, 0.2, 0));
addHotspot(polaroid, 'fa-solid fa-camera-retro', new THREE.Vector3(0, 0.2, 0));
addHotspot(radio, 'fa-solid fa-radio', new THREE.Vector3(0, 0.6, 0));
addHotspot(teddy, 'fa-solid fa-paw', new THREE.Vector3(0, 0.6, 0));
addHotspot(ring, 'fa-solid fa-gem', new THREE.Vector3(0, 0.4, 0));

function updateHotspots() {
    camera.updateMatrixWorld();
    activeHotspots.forEach(h => {
        const worldPos = h.offset.clone();
        h.mesh.localToWorld(worldPos);
        worldPos.project(camera);
        const x = (worldPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-worldPos.y * 0.5 + 0.5) * window.innerHeight;
        h.el.style.left = `${x}px`;
        h.el.style.top = `${y}px`;
        h.el.style.display = worldPos.z < 1 ? 'flex' : 'none';
    });
}

function updateClock() {
    const clockEl = document.getElementById('clock');
    if (!clockEl) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    hours = hours % 12 || 12;
    clockEl.textContent = `${hours}:${minutes}`;
}

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    // Heart Opacity LERP
    heartMat.opacity += (window.targetOpacity - heartMat.opacity) * 0.05;

    if (heartMat.opacity > 0.01) {
        const positions = heartGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            // Float UP
            positions[i * 3 + 1] += velocities[i];
            // Swaying effect
            positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.005;

            // Loop reset
            if (positions[i * 3 + 1] > 8) {
                positions[i * 3 + 1] = -5;
                positions[i * 3] = (Math.random() - 0.5) * 25;
            }
        }
        heartGeo.attributes.position.needsUpdate = true;
    }

    // Camera Logic
    if (!isDragging) {
        rot -= velocity;
        velocity *= friction;
        if (Math.abs(velocity) < 0.001) rot += 0.002;
    }

    dist += (targetDist - dist) * 0.025;
    camera.position.x = Math.sin(rot) * dist;
    camera.position.z = Math.cos(rot) * dist;
    camera.position.y = 1.2;
    camera.lookAt(0, 0.4, 0);

    animateCandles(candles);
    updateHotspots();
    renderer.render(scene, camera);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateStopwatch();
    initClockButtons();
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('mousedown', () => (isDragging = true));
window.addEventListener('mouseup', () => (isDragging = false));
window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        velocity = e.movementX * 0.005;
        rot -= velocity;
    }
});
window.addEventListener('wheel', (e) => {
    targetDist = Math.max(2.5, Math.min(15, targetDist + e.deltaY * 0.01));
});

setInterval(updateClock, 1000);
updateClock();
animate();