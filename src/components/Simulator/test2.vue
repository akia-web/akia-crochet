<template>
  <div ref="container" style="width: 100%; height: 100vh;"></div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted, ref } from "vue";

// Référence du conteneur
const container = ref(null);

// Fonction pour créer une courbe elliptique représentant une maille
class MailleCurve extends THREE.Curve {
  constructor(radiusX = 0.3, radiusY = 0.2) {
    super();
    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }
  getPoint(t) {
    const angle = t * Math.PI * 2;
    const x = this.radiusX * Math.cos(angle);
    const y = this.radiusY * Math.sin(angle);
    const z = 0;
    return new THREE.Vector3(x, y, z);
  }
}

onMounted(() => {
  if (!container.value) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 8);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.value.appendChild(renderer.domElement);

  // Lumières
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  // Matériau
  const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });

  const nbMailles = 6;
  const radiusX = 0.3;
  const radiusY = 0.2;
  const tubeRadius = 0.05;
  const offset = 0.5; // distance entre mailles

  let prevPosition = new THREE.Vector3(0, 0, 0);
  let prevRotation = 0;

  for (let i = 0; i < nbMailles; i++) {
    // Courbe elliptique pour le tube
    const curve = new MailleCurve(radiusX, radiusY);
    const geometry = new THREE.TubeGeometry(curve, 64, tubeRadius, 8, true);
    const mesh = new THREE.Mesh(geometry, material);

    // Positionner la maille
    mesh.position.copy(prevPosition);
    mesh.position.x += offset;
    mesh.position.y += 0.05 * (i % 2 === 0 ? 1 : -1);
    mesh.position.z += 0.05 * (i % 2 === 0 ? 1 : -1);

    // Rotation légère pour effet crochet
    mesh.rotation.z = prevRotation + (Math.PI / 6) * (i % 2 === 0 ? 1 : -1);
    prevRotation = mesh.rotation.z;

    // Mettre à jour position pour prochaine maille
    prevPosition = mesh.position.clone();

    scene.add(mesh);
  }

  // Animation
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();

  // Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
</script>
