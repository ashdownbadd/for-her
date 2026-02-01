import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createPlate() {
    const mainGroup = new THREE.Group();

    const porcelainMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.1,
        side: THREE.DoubleSide,
        emissive: 0xffffff,
        emissiveIntensity: 0.15
    });

    const goldMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.1,
        metalness: 1.0
    });

    function buildSinglePlate(scale = 1.0) {
        const singlePlateGroup = new THREE.Group();

        const points = [];
        points.push(new THREE.Vector2(0, 0));
        points.push(new THREE.Vector2(0.8, 0.02));
        points.push(new THREE.Vector2(1.15, 0.1));
        points.push(new THREE.Vector2(1.2, 0.12));

        const plateBodyGeo = new THREE.LatheGeometry(points, 64);
        const plateBody = new THREE.Mesh(plateBodyGeo, porcelainMat);
        singlePlateGroup.add(plateBody);

        const rimGeo = new THREE.TorusGeometry(1.18, 0.015, 16, 100);
        const goldRim = new THREE.Mesh(rimGeo, goldMat);
        goldRim.rotation.x = Math.PI / 2;
        goldRim.position.y = 0.115;
        singlePlateGroup.add(goldRim);

        const innerRimGeo = new THREE.TorusGeometry(0.85, 0.005, 16, 100);
        const innerGoldRim = new THREE.Mesh(innerRimGeo, goldMat);
        innerGoldRim.rotation.x = Math.PI / 2;
        innerGoldRim.position.y = 0.03;
        singlePlateGroup.add(innerGoldRim);
        singlePlateGroup.scale.set(scale, scale, scale);
        singlePlateGroup.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return singlePlateGroup;
    }

    const cakePlate = buildSinglePlate(1.0);
    mainGroup.add(cakePlate);

    const plate1 = buildSinglePlate(0.4);
    plate1.position.z = 2.8;
    mainGroup.add(plate1);

    const plate2 = buildSinglePlate(0.4);
    plate2.position.z = -2.8;
    mainGroup.add(plate2);

    mainGroup.position.y = 0.11;
    return mainGroup;
}