import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createRingBox(position, rotationY = 0) {
    const boxGroup = new THREE.Group();

    const whiteBoxMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const redVelvetMat = new THREE.MeshStandardMaterial({ color: 0x800020, roughness: 1.0 });
    const roseGoldMat = new THREE.MeshStandardMaterial({ color: 0xb76e79, metalness: 1.0, roughness: 0.1 });
    const rubyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0, transparent: true, opacity: 0.9 });

    const baseGroup = new THREE.Group();
    const baseBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.3), whiteBoxMat);
    baseGroup.add(baseBody);

    const baseInner = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.01, 0.26), redVelvetMat);
    baseInner.position.y = 0.06;
    baseGroup.add(baseInner);

    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.012, 0.03), new THREE.MeshStandardMaterial({ color: 0x4d0012 }));
    slot.position.y = 0.065;
    baseGroup.add(slot);

    baseGroup.position.y = 0.06;
    boxGroup.add(baseGroup);

    const lidGroup = new THREE.Group();
    const lidBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.3), whiteBoxMat);
    lidBody.position.set(0, 0.04, 0.15);
    lidGroup.add(lidBody);

    const lidInner = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.05, 0.26), redVelvetMat);
    lidInner.position.set(0, 0.02, 0.15);
    lidGroup.add(lidInner);

    lidGroup.position.set(0, 0.12, -0.15);
    lidGroup.rotation.x = -Math.PI / 1.7;
    boxGroup.add(lidGroup);

    const ringGroup = new THREE.Group();
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.007, 24, 100), roseGoldMat);
    ringGroup.add(band);

    const heartGroup = new THREE.Group();
    const lobeGeo = new THREE.SphereGeometry(0.01, 16, 16);
    const lobeL = new THREE.Mesh(lobeGeo, rubyMat);
    const lobeR = new THREE.Mesh(lobeGeo, rubyMat);
    lobeL.position.x = -0.006;
    lobeR.position.x = 0.006;
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.013, 0.02, 16), rubyMat);
    point.rotation.x = Math.PI;
    point.position.y = -0.008;
    heartGroup.add(lobeL, lobeR, point);
    heartGroup.position.y = 0.055;
    ringGroup.add(heartGroup);

    ringGroup.position.y = 0.145;
    boxGroup.add(ringGroup);

    boxGroup.position.copy(position);
    boxGroup.rotation.y = rotationY;
    boxGroup.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });

    return boxGroup;
}