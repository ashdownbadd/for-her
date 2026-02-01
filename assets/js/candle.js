import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createCandles() {
    const candleGroup = new THREE.Group();

    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.15,
        transmission: 0.7,
        transparent: true,
        opacity: 0.5,
        thickness: 0.5,
        ior: 1.5,
    });

    const waxMat = new THREE.MeshStandardMaterial({ color: 0xfffdfa });

    const flameMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff6600,
        emissiveIntensity: 1.5
    });

    const candleCount = 6;
    const radius = 1.6;

    for (let i = 0; i < candleCount; i++) {
        const angle = (i / candleCount) * Math.PI * 2;
        const container = new THREE.Group();

        const glass = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.1, 0.25, 32),
            glassMat
        );
        glass.position.y = 0.125;
        glass.castShadow = true;
        glass.receiveShadow = true;

        const rimGeo = new THREE.TorusGeometry(0.12, 0.005, 16, 100);
        const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.2 });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.y = 0.25;

        const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.1, 16), waxMat);
        wax.position.y = 0.05;

        const flame = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), flameMat);
        flame.scale.set(1, 2.5, 1);
        flame.position.y = 0.15;
        flame.name = "flame";

        const light = new THREE.PointLight(0xff9933, 0.4, 3);
        light.position.y = 0.16;
        light.name = "candleLight";

        container.add(glass, rim, wax, flame, light);

        container.position.set(Math.cos(angle) * radius, 0.105, Math.sin(angle) * radius);
        candleGroup.add(container);
    }

    return candleGroup;
}

export function animateCandles(candleGroup) {
    if (!candleGroup) return;
    candleGroup.children.forEach(candle => {
        const flame = candle.getObjectByName("flame");
        const light = candle.getObjectByName("candleLight");
        if (flame && light) {
            const flicker = Math.random() * 0.05;
            flame.scale.y = 2.5 + flicker;
            light.intensity = 0.35 + (Math.random() * 0.1);
        }
    });
}