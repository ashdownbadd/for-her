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

const hotspotLayer = document.getElementById('hotspots-layer');
const activeHotspots = [];
const friction = 0.95;

let rot = 0;
let velocity = 0;
let targetDist = 2.5;
let dist = 20;
let isDragging = false;

initScene();
initWeather();
initCalendar();

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

const phonePos = new THREE.Vector3(1.5, 0.13, 0.85);
const phoneRotY = Math.PI / 2 - 0.5;
const phone = createPhone();
phone.position.copy(phonePos);
phone.rotation.y = phoneRotY;
scene.add(phone);

const letterPos = new THREE.Vector3(-1.5, 0.11, -1.0);
const letterRotY = Math.PI / 1.5;
const loveLetter = createLoveLetter();
loveLetter.position.copy(letterPos);
loveLetter.rotation.y = letterRotY;
scene.add(loveLetter);

const napkinY = 0.13;
const frontNapkin = createNapkin(new THREE.Vector3(0, napkinY, 2.8), 0);
const backNapkin = createNapkin(new THREE.Vector3(0, napkinY, -2.8), Math.PI);
scene.add(frontNapkin);
scene.add(backNapkin);

const glassY = 0.11;
const frontGlass = createWineSet(new THREE.Vector3(0.6, glassY, 2.6), 0);
const backGlass = createWineSet(new THREE.Vector3(-0.6, glassY, -2.6), Math.PI);
scene.add(frontGlass);
scene.add(backGlass);

const polaroidPos = new THREE.Vector3(-1.45, 0.1, 0.9);
const polaroidRot = { x: 0, y: 0.2, z: 0 };
const polaroid = createPolaroid(polaroidPos, polaroidRot);
scene.add(polaroid);

const radioPos = new THREE.Vector3(2.4, 0.1, -1.6);
const radioRotY = 11.5;
const radio = createRadio(radioPos, radioRotY);
scene.add(radio);

const toyPos = new THREE.Vector3(0, 0.12, -1.8);
const teddy = createToy(toyPos, Math.PI);
teddy.scale.set(0.6, 0.6, 0.6);
scene.add(teddy);

const ring = createRingBox(new THREE.Vector3(0, 0.12, 1.8), 0);
scene.add(ring);

addHotspot(cake, 'fa-solid fa-cake-candles', new THREE.Vector3(0, 1.0, 0));
addHotspot(phone, 'fa-solid fa-mobile-screen-button', new THREE.Vector3(0, 0.4, 0));
addHotspot(loveLetter, 'fa-solid fa-envelope-open-text', new THREE.Vector3(0, 0.2, 0));
addHotspot(polaroid, 'fa-solid fa-camera-retro', new THREE.Vector3(0, 0.2, 0));
addHotspot(radio, 'fa-solid fa-radio', new THREE.Vector3(0, 0.6, 0));
addHotspot(teddy, 'fa-solid fa-paw', new THREE.Vector3(0, 0.6, 0));
addHotspot(ring, 'fa-solid fa-gem', new THREE.Vector3(0, 0.4, 0));

window.openPhotosApp = openPhotosApp;
window.closePhotosApp = closePhotosApp;
window.openPhotoViewer = openPhotoViewer;
window.closePhotoViewer = closePhotoViewer;
window.openClockApp = openClockApp;
window.closeClockApp = closeClockApp;

window.openPhoneUI = function () {
    const wrapper = document.getElementById('phone-wrapper');
    wrapper.style.display = 'block';
    setTimeout(() => {
        wrapper.classList.add('active');
    }, 10);
};

window.closePhoneUI = function () {
    const clockApp = document.getElementById('clock-app-overlay');
    const photosApp = document.getElementById('photos-app-overlay');
    const photoViewer = document.getElementById('photo-viewer');
    const phoneWrapper = document.getElementById('phone-wrapper');

    if (photoViewer && photoViewer.classList.contains('active')) {
        closePhotoViewer();
    } else if (clockApp && clockApp.classList.contains('active')) {
        closeClockApp();
    } else if (photosApp && photosApp.classList.contains('active')) {
        closePhotosApp();
    } else {
        phoneWrapper.classList.remove('active');
        setTimeout(() => {
            phoneWrapper.style.display = 'none';
        }, 500);
    }
};

window.openLetterUI = function () {
    const wrapper = document.getElementById('letter-wrapper');
    wrapper.style.display = 'block';
    setTimeout(() => {
        wrapper.classList.add('active');
    }, 10);
};

window.closeLetterUI = function () {
    const wrapper = document.getElementById('letter-wrapper');
    wrapper.classList.remove('active');
    setTimeout(() => {
        wrapper.style.display = 'none';
    }, 500);
};

function addHotspot(mesh, iconClass, offset) {
    const el = document.createElement('div');
    el.className = 'hotspot';
    el.innerHTML = `<i class="${iconClass}"></i>`;

    el.onclick = () => {
        if (iconClass.includes('fa-mobile-screen-button')) {
            window.openPhoneUI();
        } else if (iconClass.includes('fa-envelope-open-text')) {
            window.openLetterUI();
        } else {
            alert("Clicked!");
        }
    };

    hotspotLayer.appendChild(el);
    activeHotspots.push({ el, mesh, offset });
}

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

    hours = hours % 12;
    hours = hours ? hours : 12;
    clockEl.textContent = `${hours}:${minutes}`;
}

function animate() {
    requestAnimationFrame(animate);

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

document.addEventListener('DOMContentLoaded', () => {
    updateStopwatch();
    initClockButtons();
});

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'b') setAmbiance('bright');
    if (e.key.toLowerCase() === 'm') setAmbiance('moody');
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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