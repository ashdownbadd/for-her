import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createCake() {
    const cakeGroup = new THREE.Group();

    const spongeMat = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        roughness: 0.9
    });

    const dripMat = new THREE.MeshStandardMaterial({
        color: 0xfffafa,
        roughness: 0.1,
        metalness: 0.2
    });

    const berryMat = new THREE.MeshStandardMaterial({
        color: 0xe0115f,
        roughness: 0.1
    });

    const tiers = [
        { r: 0.45, h: 0.3, y: 0.15 },
        { r: 0.32, h: 0.25, y: 0.42 },
        { r: 0.20, h: 0.2, y: 0.65 }
    ];

    tiers.forEach((tier, index) => {
        const tierGroup = new THREE.Group();
        tierGroup.name = `tier${index}`;

        const sponge = new THREE.Mesh(
            new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 64),
            spongeMat
        );
        sponge.position.y = tier.y;
        sponge.castShadow = true;

        const drip = new THREE.Mesh(
            new THREE.CylinderGeometry(tier.r + 0.015, tier.r + 0.015, tier.h * 0.4, 64),
            dripMat
        );
        drip.position.y = tier.y + (tier.h / 2) - (tier.h * 0.15);

        const creamRing = new THREE.Mesh(
            new THREE.TorusGeometry(tier.r, 0.03, 16, 64),
            dripMat
        );
        creamRing.rotation.x = Math.PI / 2;
        creamRing.position.y = tier.y + (tier.h / 2);

        tierGroup.add(sponge);
        tierGroup.add(drip);
        tierGroup.add(creamRing);
        cakeGroup.add(tierGroup);
    });

    const berryGroup = new THREE.Group();
    berryGroup.name = "berry_decoration";

    const berry = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 16),
        berryMat
    );
    berry.position.y = 0.78;
    berry.castShadow = true;

    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.0, 0.1, 0),
        new THREE.Vector3(0.1, 0.15, 0)
    );

    const stem = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 12, 0.004, 8, false),
        new THREE.MeshStandardMaterial({
            color: 0x2d3a1a,
            roughness: 0.9
        })
    );
    stem.position.set(0, 0.78, 0);

    berryGroup.add(berry);
    berryGroup.add(stem);
    cakeGroup.add(berryGroup);

    return cakeGroup;
}