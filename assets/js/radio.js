import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createRadio(position, rotationY = 0) {
    const radioGroup = new THREE.Group();

    const width = 0.65;
    const height = 0.45;
    const depth = 0.25;

    const woodColor = 0x6d432a;
    const creamColor = 0xebe0d0;
    const darkAccent = 0x3d2314;
    const amberGlow = 0xffaa00;

    const bodyMat = new THREE.MeshPhysicalMaterial({
        color: woodColor,
        roughness: 0.3,
        clearcoat: 0.5
    });

    const creamMat = new THREE.MeshStandardMaterial({
        color: creamColor
    });

    const darkMat = new THREE.MeshStandardMaterial({
        color: darkAccent
    });

    const winMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        emissive: amberGlow,
        emissiveIntensity: 0.4
    });

    const dotMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.2
    });

    const footMat = new THREE.MeshStandardMaterial({
        color: 0x111111
    });

    const shape = new THREE.Shape();
    const x = -width / 2, y = 0, r = 0.08;
    shape.moveTo(x + r, y);
    shape.lineTo(x + width - r, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r);
    shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const bodyGeo = new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: false });
    const radioBody = new THREE.Mesh(bodyGeo, bodyMat);
    radioBody.position.z = -depth / 2;
    radioGroup.add(radioBody);

    const upperFace = new THREE.Mesh(
        new THREE.PlaneGeometry(width - 0.08, height / 2 - 0.04),
        creamMat
    );
    upperFace.position.set(0, height * 0.73, depth / 2 + 0.001);
    radioGroup.add(upperFace);

    const lowerFace = new THREE.Mesh(
        new THREE.PlaneGeometry(width - 0.08, height / 2 - 0.04),
        darkMat
    );
    lowerFace.position.set(0, height * 0.27, depth / 2 + 0.001);
    radioGroup.add(lowerFace);

    const dotGeo = new THREE.CircleGeometry(0.005, 8);
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 6; j++) {
            const dot = new THREE.Mesh(dotGeo, dotMat);
            dot.position.set(-0.2 + (i * 0.035), height * 0.65 + (j * 0.03), depth / 2 + 0.005);
            radioGroup.add(dot);
        }
    }

    const win1 = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.06), winMat);
    win1.position.set(0.18, height * 0.78, depth / 2 + 0.01);
    radioGroup.add(win1);

    const win2 = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.03), winMat);
    win2.position.set(0.18, height * 0.68, depth / 2 + 0.01);
    radioGroup.add(win2);

    const knobGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 32);

    const knobL = new THREE.Mesh(knobGeo, creamMat);
    knobL.rotation.x = Math.PI / 2;
    knobL.position.set(-0.18, height * 0.27, depth / 2 + 0.02);
    radioGroup.add(knobL);

    const knobR = new THREE.Mesh(knobGeo, creamMat);
    knobR.rotation.x = Math.PI / 2;
    knobR.position.set(0.18, height * 0.27, depth / 2 + 0.02);
    radioGroup.add(knobR);

    const footGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.03, 16);
    const footPos = [
        [-0.2, -0.015, 0.08],
        [0.2, -0.015, 0.08],
        [-0.2, -0.015, -0.08],
        [0.2, -0.015, -0.08]
    ];

    footPos.forEach(p => {
        const foot = new THREE.Mesh(footGeo, footMat);
        foot.position.set(p[0], p[1], p[2]);
        radioGroup.add(foot);
    });

    radioGroup.position.copy(position);
    radioGroup.rotation.y = rotationY;

    radioGroup.traverse(c => {
        if (c.isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
        }
    });

    return radioGroup;
}