import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd2d7d9);
scene.add(new THREE.AxesHelper(100));

// Objects
const torusKnotGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
// const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const coneGeometry = new THREE.ConeGeometry(8, 20, 40);
const planeGeometry = new THREE.PlaneGeometry(200, 200);

//Textures
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/textures/normalMap.jpg');
const crystalNormTexture = textureLoader.load('/textures/crystalMetalNorm.jpg');

// Materials
const material = new THREE.MeshStandardMaterial();
material.normalMap = normalTexture;
material.color = new THREE.Color(0xd8ebf2);

const materialCrystal = new THREE.MeshStandardMaterial();
materialCrystal.normalMap = crystalNormTexture;
materialCrystal.color = new THREE.Color(0x81a6a6);

const planeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x2a3a40,
    // side: THREE.DoubleSide,
    roughness: 0.3,
    metalness: 0.46,
    reflectivity: 0.35,
    clearcoat: 0.49,
    clearcoatRoughness: 0.56,
});

// Mesh
const torusKnot = new THREE.Mesh(torusKnotGeometry, material);
torusKnot.position.set(0, 40, 0);

// const cube = new THREE.Mesh(cubeGeometry, materialCrystal);
// cube.position.set(30, 5, 0);

const cone = new THREE.Mesh(coneGeometry, materialCrystal);
cone.position.set(0, 10, 0);

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(-Math.PI * 0.5);

const group = new THREE.Group();
group.add(torusKnot);
// group.add(cube);
group.add(cone);
group.add(plane);

scene.add(group);

// Lights

//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

//hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x2a3a40, 1);
// hemisphereLight.position.set(2, 3, 4);
scene.add(hemisphereLight);

//directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1000, 1000, 0);
scene.add(directionalLight);

const dlHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    5,
    0xff0000
);
scene.add(dlHelper);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
);
camera.position.set(10, 25, 100);
scene.add(camera);

// GUI camera
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'x', -500, 500).step(5);
cameraFolder.add(camera.position, 'y', -500, 500).step(5);
cameraFolder.add(camera.position, 'z', 0, 500).step(5);
cameraFolder.open();

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,

    // Scene
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    torusKnot.rotation.y = 0.5 * elapsedTime;

    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);

    // Scene
};

tick();
