import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createWineSet(position, rotationY = 0) {
    const glassGroup = new THREE.Group();

    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 0.95,
        ior: 1.5,
        thickness: 0.2,
        specularIntensity: 1,
        clearcoat: 1,
        transparent: true,
        depthWrite: false
    });

    const wineMat = new THREE.MeshPhysicalMaterial({
        color: 0x990000,
        emissive: 0x440000,
        emissiveIntensity: 0.5,
        roughness: 0,
        metalness: 0,
        transmission: 0.5,
        thickness: 0.1,
        transparent: true,
        opacity: 0.9
    });

    const points = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.15, 0),
        new THREE.Vector2(0.12, 0.02),
        new THREE.Vector2(0.02, 0.02),
        new THREE.Vector2(0.02, 0.45),
        new THREE.Vector2(0.18, 0.55),
        new THREE.Vector2(0.22, 0.75),
        new THREE.Vector2(0.18, 0.95)
    ];

    const glassGeo = new THREE.LatheGeometry(points, 32);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassGroup.add(glassMesh);

    const winePoints = [
        new THREE.Vector2(0, 0.55),
        new THREE.Vector2(0.17, 0.55),
        new THREE.Vector2(0.21, 0.75),
        new THREE.Vector2(0, 0.75)
    ];

    const wineGeo = new THREE.LatheGeometry(winePoints, 32);
    const wineMesh = new THREE.Mesh(wineGeo, wineMat);
    wineMesh.scale.set(0.95, 0.95, 0.95);
    glassGroup.add(wineMesh);

    glassGroup.position.copy(position);
    glassGroup.rotation.y = rotationY;
    glassGroup.scale.set(0.5, 0.5, 0.5);

    glassGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return glassGroup;
}