import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export function createPhone() {
    const phoneGroup = new THREE.Group();

    function createRoundedRectShape(width, height, radius) {
        const shape = new THREE.Shape();
        const x = -width / 2;
        const y = -height / 2;
        shape.moveTo(x, y + radius);
        shape.lineTo(x, y + height - radius);
        shape.absarc(x + radius, y + height - radius, radius, Math.PI, Math.PI / 2, true);
        shape.lineTo(x + width - radius, y + height);
        shape.absarc(x + width - radius, y + height - radius, radius, Math.PI / 2, 0, true);
        shape.lineTo(x + width, y + radius);
        shape.absarc(x + width - radius, y + radius, radius, 0, -Math.PI / 2, true);
        shape.lineTo(x + radius, y);
        shape.absarc(x + radius, y + radius, radius, -Math.PI / 2, -Math.PI, true);
        return shape;
    }

    const phoneDepth = 0.04;

    const phoneShape = createRoundedRectShape(0.35, 0.65, 0.05);
    const phoneGeometry = new THREE.ExtrudeGeometry(phoneShape, { depth: phoneDepth, bevelEnabled: false });
    const phoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1410,
        metalness: 0.9,
        roughness: 0.2
    });

    const phone = new THREE.Mesh(phoneGeometry, phoneMaterial);
    phone.rotation.x = Math.PI / 2;
    phone.position.y = phoneDepth;
    phone.castShadow = true;
    phoneGroup.add(phone);

    const screenShape = createRoundedRectShape(0.32, 0.62, 0.04);
    const screenGeometry = new THREE.ExtrudeGeometry(screenShape, { depth: 0.005, bevelEnabled: false });

    const screenMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        emissive: 0x88aaee,
        emissiveIntensity: 0.8,
        roughness: 0.05,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        reflectivity: 1.0
    });

    const phoneScreen = new THREE.Mesh(screenGeometry, screenMaterial);
    phoneScreen.rotation.x = Math.PI / 2;
    phoneScreen.position.y = phoneDepth + 0.001;
    phoneGroup.add(phoneScreen);

    const screenGlow = new THREE.PointLight(0x88aaee, 0.3, 1.5);
    screenGlow.position.set(0, phoneDepth + 0.1, 0);
    phoneGroup.add(screenGlow);

    const notch = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.015, 0.04, 4, 8),
        new THREE.MeshStandardMaterial({ color: 0x0a0805, roughness: 1.0 })
    );
    notch.rotation.z = Math.PI / 2;
    notch.position.set(0, phoneDepth + 0.005, -0.26);
    phoneGroup.add(notch);

    return phoneGroup;
}