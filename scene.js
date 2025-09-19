import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. Inicialização
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// 2. Iluminação
const ambientLight = new THREE.AmbientLight(0x404040, 3); // Aumentei a intensidade
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 3. Carregador de Modelo
const loader = new GLTFLoader();
let model; // Variável para armazenar o modelo carregado

loader.load(
    'Atlas.glb', // Nome do seu arquivo
    function (gltf) {
        model = gltf.scene;

        // Material de Wireframe
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00, // Verde-fósforo
            wireframe: true,
        });

        // Aplica o material a todos os meshes do modelo
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = wireframeMaterial;
            }
        });

        // Centraliza o modelo e ajusta a escala
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); // Centraliza o modelo na origem
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim; // Ajusta a escala para caber na cena
        model.scale.set(scale, scale, scale);

        scene.add(model);
    },
    undefined, // Função de progresso (opcional)
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

    // Rotaciona o modelo se ele já foi carregado
    if (model) {
        model.rotation.y += 0.003;
        model.rotation.x += 0.001;
    }

    renderer.render(scene, camera);
}

// 6. Responsividade
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

animate();
