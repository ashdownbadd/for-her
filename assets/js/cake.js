import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createCake() {
    const cakeGroup = new THREE.Group();
    const spongeMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.9 });
    const dripMat = new THREE.MeshStandardMaterial({
        color: 0xfffafa,
        roughness: 0.1,
        metalness: 0.2
    });

    const frostingMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
    const berryMat = new THREE.MeshStandardMaterial({ color: 0xe0115f, roughness: 0.1 });

    const tiers = [
        { r: 0.45, h: 0.3, y: 0.15 },
        { r: 0.32, h: 0.25, y: 0.42 },
        { r: 0.20, h: 0.2, y: 0.65 }
    ];

    tiers.forEach((tier) => {
        const sponge = new THREE.Mesh(
            new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 64),
            spongeMat
        );
        sponge.position.y = tier.y;
        sponge.castShadow = true;
        cakeGroup.add(sponge);

        const dripGeo = new THREE.CylinderGeometry(tier.r + 0.015, tier.r + 0.015, tier.h * 0.4, 64);
        const drip = new THREE.Mesh(dripGeo, dripMat);
        drip.position.y = tier.y + (tier.h / 2) - (tier.h * 0.15);
        cakeGroup.add(drip);

        const ringGeo = new THREE.TorusGeometry(tier.r, 0.03, 16, 64);
        const creamRing = new THREE.Mesh(ringGeo, dripMat);
        creamRing.rotation.x = Math.PI / 2;
        creamRing.position.y = tier.y + (tier.h / 2);
        cakeGroup.add(creamRing);
    });

    const berry = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), berryMat);
    berry.position.y = 0.78;
    berry.castShadow = true;
    cakeGroup.add(berry);

    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.0, 0.1, 0),
        new THREE.Vector3(0.1, 0.15, 0)
    );

    const stemGeo = new THREE.TubeGeometry(curve, 12, 0.004, 8, false);
    const stemMat = new THREE.MeshStandardMaterial({
        color: 0x2d3a1a,
        roughness: 0.9
    });

    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, 0.78, 0);
    stem.castShadow = true;
    cakeGroup.add(stem);

    return cakeGroup;
}