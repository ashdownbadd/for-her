import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.js';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
export const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
});

const lights = {};

function configureRendererForDevice() {
    const deviceMemory = (navigator && 'deviceMemory' in navigator) ? navigator.deviceMemory : 4;
    const isLowMemoryDevice = deviceMemory && deviceMemory <= 4;
    const maxPixelRatio = isLowMemoryDevice ? 1.25 : 1.75;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);

    renderer.setPixelRatio(pixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

export function initScene() {
    configureRendererForDevice();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;

    document.body.appendChild(renderer.domElement);

    scene.background = new THREE.Color(0x050508);
    scene.fog = new THREE.FogExp2(0x050508, 0.1);

    lights.ambient = new THREE.AmbientLight(0x2a1b3d, 0.2);
    scene.add(lights.ambient);

    lights.main = new THREE.PointLight(0xfafafa, 1.8, 12);
    lights.main.position.set(0, 2.0, 1.0);
    lights.main.castShadow = true;
    lights.main.shadow.bias = -0.0001;
    lights.main.shadow.normalBias = 0.02;
    lights.main.shadow.mapSize.width = 1024;
    lights.main.shadow.mapSize.height = 1024;
    scene.add(lights.main);

    lights.rim = new THREE.DirectionalLight(0xb19cd9, 0.3);
    lights.rim.position.set(-5, 4, -5);
    scene.add(lights.rim);
}

export function setAmbiance(mode) {
    if (mode === 'bright') {
        scene.background.set(0xffe4d1);
        scene.fog.color.set(0xffc0cb);
        scene.fog.density = 0.015;

        lights.ambient.color.set(0xffe0bd);
        lights.ambient.intensity = 0.5;

        lights.main.color.set(0xff9d5c);
        lights.main.intensity = 3.5;
        lights.main.position.set(2, 3, 2);

        lights.rim.color.set(0xfff4e5);
        lights.rim.intensity = 1.8;

        renderer.toneMappingExposure = 1.1;
    } else {
        scene.background.set(0x050508);
        scene.fog.color.set(0x050508);
        scene.fog.density = 0.08;

        lights.ambient.color.set(0x2a1b3d);
        lights.ambient.intensity = 0.5;

        lights.main.intensity = 2.0;

        lights.rim.intensity = 0.6;

        renderer.toneMappingExposure = 0.9;
    }
}