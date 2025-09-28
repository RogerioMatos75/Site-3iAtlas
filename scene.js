import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';

// Simple vignette shader
const VignetteShader = {
    uniforms: {
        tDiffuse: { value: null },
        radius: { value: 0.75 },
        darkness: { value: 0.6 }
    },
    vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */`
        uniform sampler2D tDiffuse;
        uniform float radius;
        uniform float darkness;
        varying vec2 vUv;
        
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            float dist = distance(vUv, vec2(0.5));
            float vig = smoothstep(radius, radius - 0.45, dist);
            color.rgb *= mix(1.0, 1.0 - darkness, vig);
            gl_FragColor = color;
        }
    `
};

// 1. Inicialização
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Pós-processamento
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(container.clientWidth, container.clientHeight), 0.55, 0.6, 0.1);
composer.addPass(bloomPass);

const filmPass = new FilmPass(0.35, 0.5, 2048, false);
composer.addPass(filmPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0015; // leve aberração cromática
composer.addPass(rgbShiftPass);

const vignettePass = new ShaderPass(VignetteShader);
vignettePass.uniforms.radius.value = 0.78;
vignettePass.uniforms.darkness.value = 0.55;
composer.addPass(vignettePass);

// 2. Iluminação
const ambientLight = new THREE.AmbientLight(0x404040, 3);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 3. Carregador de Modelo
const loader = new GLTFLoader();
let model; // Variável para armazenar o modelo carregado

loader.load(
    'Atlas.glb',
    function (gltf) {
        model = gltf.scene;

        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
        });

        model.traverse((child) => {
            if (child.isMesh) {
                child.material = wireframeMaterial;
            }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        model.scale.set(scale, scale, scale);

        scene.add(model);
    },
    undefined,
    function (error) {
        console.error('Um erro ocorreu ao carregar o modelo', error);
        const errorElement = document.createElement('p');
        errorElement.textContent = 'Erro ao carregar modelo 3D. Verifique o console.';
        container.appendChild(errorElement);
    }
);

// 4. Posição da Câmera
camera.position.z = 5;

// 5. Loop de Animação
function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.y += 0.003;
        model.rotation.x += 0.001;
    }

    composer.render();
}

// 6. Responsividade
window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
    bloomPass.setSize(w, h);
});

animate();
