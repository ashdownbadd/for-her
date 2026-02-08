import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

// --- STATE VARIABLES ---
let bitesTaken = 0;
const maxBites = 4;
let isAnimating = false;

// --- AUDIO ASSETS ---
const biteSound = new Audio('assets/audio/bite-sound-effect.wav');
const respawnSound = new Audio('assets/audio/respawn-sound-effect.wav');

// --- TEXT EFFECT ASSETS ---
const phrases = ['Delicious!', 'Tasty!', 'Yum!', 'Nom nom!', 'Sweet!', 'Amazing!', 'Mmm!', 'Scrumptious!'];
const textEffects = [];

function createTextEffect(scene, camera, position) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    ctx.font = 'bold 60px "Comic Sans MS", cursive';
    ctx.fillStyle = '#ff69b4';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#ffb3d9';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(phrase, 128, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.PlaneGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });
    const textMesh = new THREE.Mesh(geometry, material);

    textMesh.position.copy(position);
    textMesh.position.y += 0.5;

    // Sync with camera for billboarding
    textMesh.quaternion.copy(camera.quaternion);

    scene.add(textMesh);
    textEffects.push({
        mesh: textMesh,
        life: 1,
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.05, 0.08, 0)
    });
}

export function updateTextEffects(scene, camera) {
    for (let i = textEffects.length - 1; i >= 0; i--) {
        const effect = textEffects[i];
        effect.mesh.quaternion.copy(camera.quaternion);
        effect.mesh.position.add(effect.velocity);
        effect.life -= 0.02;
        effect.mesh.material.opacity = effect.life;
        effect.mesh.scale.multiplyScalar(1.02);

        if (effect.life <= 0) {
            scene.remove(effect.mesh);
            textEffects.splice(i, 1);
        }
    }
}

// --- MAIN INTERACTION LOGIC ---
export function eatCake(cakeGroup, scene, camera) {
    if (isAnimating) return;

    const effectPos = new THREE.Vector3().setFromMatrixPosition(cakeGroup.matrixWorld);
    effectPos.y += 0.5;

    // --- RESET CYCLE (5th Click) ---
    if (bitesTaken >= maxBites) {
        isAnimating = true;
        bitesTaken = 0;

        respawnSound.currentTime = 0;
        respawnSound.play();

        // createTextEffect is REMOVED from here

        cakeGroup.traverse((child) => { child.visible = true; });
        cakeGroup.scale.set(0.01, 0.01, 0.01);

        let currentScale = 0.01;
        const respawnInterval = setInterval(() => {
            currentScale += 0.15;
            if (currentScale >= 1.1) {
                cakeGroup.scale.set(1, 1, 1);
                isAnimating = false;
                clearInterval(respawnInterval);
            } else {
                cakeGroup.scale.set(currentScale, currentScale, currentScale);
            }
        }, 16);
        return;
    }

    // --- EATING CYCLE (Clicks 1-4) ---
    let target;
    if (bitesTaken === 0) {
        target = cakeGroup.getObjectByName("berry_decoration");
    } else {
        const tierIndex = 3 - bitesTaken;
        target = cakeGroup.getObjectByName(`tier${tierIndex}`);
    }

    if (target) {
        isAnimating = true;
        biteSound.currentTime = 0;
        biteSound.play();

        // Text effect only triggers during the eating stages
        createTextEffect(scene, camera, effectPos);

        let currentScale = 1.0;
        const shrinkInterval = setInterval(() => {
            currentScale -= 0.2;
            if (currentScale <= 0.1) {
                target.visible = false;
                target.scale.set(1, 1, 1);
                bitesTaken++;
                isAnimating = false;
                clearInterval(shrinkInterval);
            } else {
                target.scale.set(currentScale, currentScale, currentScale);
            }
        }, 16);
    }
}