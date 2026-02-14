import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createLoveLetter() {
    const letterGroup = new THREE.Group();

    const width = 0.55;
    const height = 0.35;
    const paperThickness = 0.008;

    const parchmentMat = new THREE.MeshStandardMaterial({
        color: 0xfaf4e1,
        roughness: 0.8,
        metalness: 0.02
    });

    const innerPaperMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9
    });

    const waxSealMat = new THREE.MeshPhysicalMaterial({
        color: 0x8b0000,
        roughness: 0.2,
        metalness: 0.3,
        clearcoat: 1.0
    });

    const paperGeo = new THREE.BoxGeometry(width, paperThickness, height);

    const basePaper = new THREE.Mesh(paperGeo, parchmentMat);
    basePaper.position.y = paperThickness / 2;
    letterGroup.add(basePaper);

    const innerPaper = new THREE.Mesh(paperGeo, innerPaperMat);
    innerPaper.scale.set(0.98, 1, 0.98);
    innerPaper.position.y = paperThickness + 0.002;
    letterGroup.add(innerPaper);

    const topFold = new THREE.Mesh(paperGeo, parchmentMat);
    topFold.position.set(0, paperThickness * 2 + 0.005, 0.01);
    topFold.rotation.x = 0.03;
    letterGroup.add(topFold);

    const sealBaseGeo = new THREE.CylinderGeometry(0.05, 0.055, 0.012, 12);
    const sealBase = new THREE.Mesh(sealBaseGeo, waxSealMat);
    sealBase.position.set(0, paperThickness * 3 + 0.01, 0);
    letterGroup.add(sealBase);

    const stampRingGeo = new THREE.TorusGeometry(0.035, 0.005, 12, 24);
    const stampRing = new THREE.Mesh(stampRingGeo, waxSealMat);
    stampRing.rotation.x = Math.PI / 2;
    stampRing.position.set(0, paperThickness * 3 + 0.02, 0);
    letterGroup.add(stampRing);

    letterGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return letterGroup;
}