import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createPolaroid(position, rotation = { x: 0, y: 0, z: 0 }) {
    const polaroidGroup = new THREE.Group();

    const polaroidFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.02, 0.85),
        new THREE.MeshStandardMaterial({
            color: 0xe8d4c4,
            roughness: 0.8
        })
    );

    polaroidFrame.position.y = 0.01;
    polaroidGroup.add(polaroidFrame);

    const photoArea = new THREE.Mesh(
        new THREE.PlaneGeometry(0.6, 0.65),
        new THREE.MeshStandardMaterial({
            color: 0x3d322a,
            side: THREE.DoubleSide
        })
    );
    photoArea.rotation.x = -Math.PI / 2;
    photoArea.position.y = 0.021;
    photoArea.position.z = -0.05;
    polaroidGroup.add(photoArea);

    polaroidGroup.position.copy(position);
    polaroidGroup.rotation.set(rotation.x, rotation.y, rotation.z);

    polaroidGroup.traverse(c => {
        if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; }
    });

    return polaroidGroup;
}