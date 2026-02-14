import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createNapkin(position, rotationY = 0) {
    const napkinGroup = new THREE.Group();

    const size = 0.45;
    const radius = 0.02;
    const thickness = 0.001;
    const x = -size / 2;
    const y = -size / 2;

    const napkinMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 1.0,
        metalness: 0.0,
        side: THREE.DoubleSide
    });

    const shape = new THREE.Shape();
    shape.moveTo(x, y + radius);
    shape.lineTo(x, y + size - radius);
    shape.quadraticCurveTo(x, y + size, x + radius, y + size);
    shape.lineTo(x + size - radius, y + size);
    shape.quadraticCurveTo(x + size, y + size, x + size, y + size - radius);
    shape.lineTo(x + size, y + radius);
    shape.quadraticCurveTo(x + size, y, x + size - radius, y);
    shape.lineTo(x + radius, y);
    shape.quadraticCurveTo(x, y, x, y + radius);

    const extrudeSettings = {
        depth: thickness,
        bevelEnabled: true,
        bevelThickness: 0.002,
        bevelSize: 0.002,
        bevelSegments: 3
    };

    const napkinGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const layer1 = new THREE.Mesh(napkinGeo, napkinMat);
    layer1.rotation.x = Math.PI / 2;
    napkinGroup.add(layer1);

    const layer2 = new THREE.Mesh(napkinGeo, napkinMat);
    layer2.rotation.x = Math.PI / 2;
    layer2.rotation.z = Math.PI / 4;
    layer2.scale.set(0.9, 0.9, 1);
    layer2.position.y = thickness + 0.002;
    napkinGroup.add(layer2);

    napkinGroup.position.copy(position);
    napkinGroup.rotation.y = rotationY;

    napkinGroup.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return napkinGroup;
}