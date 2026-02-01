import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

function createMarbleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 1024, 1024);

    for (let i = 0; i < 20; i++) {
        ctx.fillStyle = `rgba(200, 200, 200, ${Math.random() * 0.2})`;
        ctx.beginPath();
        ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 400, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.lineWidth = 0.5;
    for (let i = 0; i < 40; i++) {
        ctx.strokeStyle = `rgba(60, 60, 60, ${0.1 + Math.random() * 0.2})`;
        ctx.beginPath();
        let x = Math.random() * 1024;
        let y = Math.random() * 1024;
        ctx.moveTo(x, y);

        for (let j = 0; j < 20; j++) {
            x += (Math.random() - 0.5) * 100;
            y += (Math.random() - 0.5) * 100;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

export function createTable() {
    const group = new THREE.Group();
    const marbleTexture = createMarbleTexture();

    const marbleMaterial = new THREE.MeshStandardMaterial({
        map: marbleTexture,
        roughness: 0.05,
        metalness: 0.1,
        color: 0xffffff
    });

    const top = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 0.2, 64), marbleMaterial);
    top.receiveShadow = true;
    top.castShadow = true;

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 2.5, 32), marbleMaterial);
    pedestal.position.y = -1.25;
    pedestal.castShadow = true;

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.4, 32), marbleMaterial);
    base.position.y = -2.5;
    base.receiveShadow = true;

    group.add(top, pedestal, base);
    return group;
}