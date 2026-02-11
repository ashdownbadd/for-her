import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

const phrases = ['Delicious!', 'Tasty!', 'Yum!', 'Nom nom!', 'Sweet!', 'Amazing!', 'Mmm!', 'Scrumptious!'];
const textEffects = [];
const biteSound = new Audio('assets/audio/bite-sound-effect.wav');
const respawnSound = new Audio('assets/audio/respawn-sound-effect.wav');
const maxBites = 4;

let availablePhrases = [...phrases];
let bitesTaken = 0;
let isAnimating = false;

function createTextEffect(scene, camera, position) {
    const canvas = document.createElement('canvas');
    // High resolution canvas to keep the big font crisp
    canvas.width = 1024;
    canvas.height = 512;

    const ctx = canvas.getContext('2d');

    if (availablePhrases.length === 0) {
        availablePhrases = [...phrases];
    }

    const randomIndex = Math.floor(Math.random() * availablePhrases.length);
    const phrase = availablePhrases.splice(randomIndex, 1)[0];

    // Keeping the big font size you liked
    ctx.font = 'bold 80px "Comic Sans MS", cursive';
    ctx.fillStyle = '#ff69b4';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Aesthetic shadow
    ctx.shadowColor = '#ffb3d9';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Draw exactly in the center of the large canvas
    ctx.fillText(phrase, 512, 256);

    const texture = new THREE.CanvasTexture(canvas);

    // IMPORTANT: Plane width increased to 6 so 80px "Scrumptious!" fits perfectly
    const geometry = new THREE.PlaneGeometry(6, 3);

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });

    const textMesh = new THREE.Mesh(geometry, material);
    textMesh.position.copy(position);
    textMesh.position.y += 0.6; // Slightly higher spawn
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

export function eatCake(cakeGroup, scene, camera) {
    if (isAnimating) return;

    const effectPos = new THREE.Vector3().setFromMatrixPosition(cakeGroup.matrixWorld);
    effectPos.y += 0.5;

    if (bitesTaken >= maxBites) {
        isAnimating = true;
        bitesTaken = 0;

        respawnSound.currentTime = 0;
        respawnSound.play();

        cakeGroup.traverse((child) => {
            child.visible = true;
        });

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