import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createPinkTablecloth() {
    const group = new THREE.Group();

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffb6c1';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(255, 192, 203, 0.3)';
    ctx.lineWidth = 2;
    ctx.translate(256, 256);

    for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.ellipse(100, 0, 80, 40, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(180, 0, 30, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.strokeStyle = 'rgba(0,0,0,0.03)';
    for (let i = 0; i < 512; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i < 512; i += 4) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
    }

    const fabricTexture = new THREE.CanvasTexture(canvas);
    fabricTexture.wrapS = THREE.RepeatWrapping;
    fabricTexture.wrapT = THREE.RepeatWrapping;
    fabricTexture.repeat.set(1, 1);

    const clothMaterial = new THREE.MeshStandardMaterial({
        map: fabricTexture,
        roughness: 0.9,
        metalness: 0.05
    });

    const threadMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1.0
    });

    const radius = 2.4;
    const geo = new THREE.CylinderGeometry(radius, radius, 0.015, 64);
    const baseCloth = new THREE.Mesh(geo, clothMaterial);
    group.add(baseCloth);

    const stitchGeo = new THREE.TorusGeometry(0.05, 0.005, 8, 16, Math.PI);
    const stitchCount = 100;

    for (let i = 0; i < stitchCount; i++) {
        const angle = (i / stitchCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const s = new THREE.Mesh(stitchGeo, threadMat);
        s.position.set(x, 0.008, z);
        s.rotation.x = Math.PI / 2;
        s.rotation.z = angle + Math.PI / 2;

        group.add(s);
    }

    group.position.y = 0.105;

    group.traverse((child) => {
        if (child.isMesh) {
            child.receiveShadow = true;
            child.castShadow = true;
        }
    });

    return group;
}