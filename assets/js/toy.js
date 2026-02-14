import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createToy(position, rotationY = 0) {
    const toyGroup = new THREE.Group();

    const teddyFurMat = new THREE.MeshStandardMaterial({ color: 0xf5f5dc, roughness: 1.0 });
    const teddySkinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 1.0 });
    const teddyEyesMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0a, roughness: 0.2 });
    const sparkleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0.5 });
    const pawMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 1.0 });

    const eyeGeo = new THREE.SphereGeometry(0.03, 16, 16);
    const sparkleGeo = new THREE.SphereGeometry(0.012, 8, 8);
    const earGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const armGeo = new THREE.CapsuleGeometry(0.15, 0.2, 4, 16);
    const toeGeo = new THREE.CircleGeometry(0.025, 16);

    const createEye = (side) => {
        const eyeUnit = new THREE.Group();
        const eyeBall = new THREE.Mesh(eyeGeo, teddyEyesMat);
        eyeUnit.add(eyeBall);

        const sparkle = new THREE.Mesh(sparkleGeo, sparkleMat);
        sparkle.position.set(0.015, 0.015, 0.02);
        eyeUnit.add(sparkle);

        eyeUnit.position.set(0.1 * side, 0.78, 0.26);
        return eyeUnit;
    };

    const createEar = (side) => {
        const ear = new THREE.Mesh(earGeo, teddyFurMat);
        ear.position.set(0.25 * side, 0.95, 0);
        ear.scale.set(1, 1, 0.4);
        return ear;
    };

    const createArm = (side) => {
        const armGroup = new THREE.Group();
        const arm = new THREE.Mesh(armGeo, teddyFurMat);
        armGroup.add(arm);
        armGroup.position.set(0.4 * side, 0.40, 0.05);
        armGroup.rotation.z = 0.2 * side;
        return armGroup;
    };

    const createLeg = (side) => {
        const legGroup = new THREE.Group();

        const legFur = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.25, 32), teddyFurMat);
        legFur.rotation.x = Math.PI / 2;
        legGroup.add(legFur);

        const legBack = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), teddyFurMat);
        legBack.position.z = -0.1;
        legGroup.add(legBack);

        const footPad = new THREE.Mesh(new THREE.CircleGeometry(0.16, 32), teddySkinMat);
        footPad.position.set(0, 0, 0.126);
        legGroup.add(footPad);

        const mainPad = new THREE.Mesh(new THREE.CircleGeometry(0.06, 24), pawMat);
        mainPad.position.set(0, -0.02, 0.127);
        legGroup.add(mainPad);

        const toePositions = [
            [-0.06, 0.05, 0.127],
            [0, 0.08, 0.127],
            [0.06, 0.05, 0.127]
        ];

        toePositions.forEach(pos => {
            const toe = new THREE.Mesh(toeGeo, pawMat);
            toe.position.set(...pos);
            legGroup.add(toe);
        });

        legGroup.position.set(0.28 * side, 0.1, 0.25);
        return legGroup;
    };

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 24), teddyFurMat);
    body.scale.set(1, 1, 0.8);
    body.position.y = 0.3;
    toyGroup.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), teddyFurMat);
    head.position.set(0, 0.75, 0);
    toyGroup.add(head);

    const face = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), teddySkinMat);
    face.position.set(0, 0.65, 0.22);
    face.scale.set(1, 0.8, 0.8);
    toyGroup.add(face);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), teddyEyesMat);
    nose.position.set(0, 0.68, 0.35);
    toyGroup.add(nose);

    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), teddyFurMat);
    tail.position.set(0, 0.1, -0.3);
    toyGroup.add(tail);

    toyGroup.add(
        createEye(-1),
        createEye(1),
        createEar(-1),
        createEar(1),
        createArm(-1),
        createArm(1),
        createLeg(-1),
        createLeg(1)
    );

    toyGroup.position.copy(position);
    toyGroup.rotation.y = rotationY;

    toyGroup.traverse(c => {
        if (c.isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
        }
    });

    return toyGroup;
}