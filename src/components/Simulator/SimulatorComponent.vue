<template>
  <div>
    <!-- Formulaire pour ajouter un rang -->
    <form @submit.prevent="onAddSlice" class="form-slice">
      <label>
        Nombre de mailles :
        <input type="number" v-model.number="newNb" min="1" required />
      </label>
      <label>
        Couleur :
        <input type="color" v-model="newColor" required />
      </label>
      <button type="submit">Ajouter un rang</button>
    </form>

    <div ref="container" class="three-container"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const container = ref<HTMLDivElement | null>(null)

interface TriangleItem {
  mesh: THREE.Mesh
  hitMesh: THREE.Mesh
  edges: THREE.LineSegments
}

interface Slice {
  nombre: number
  couleurs: string[]
}

const slices: Slice[] = reactive([]) // tableau vide au départ
const triangleItems: TriangleItem[] = []

const newNb = ref(6)
const newColor = ref('#ff5555')

// --------- Three.js objets ---------
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera
let cameraDistance = 1
const minDistance = 0.3
const maxDistance = 3
const group = new THREE.Group()

// --------- Ajouter un rang ---------
const onAddSlice = () => {
  const couleurs = Array(newNb.value).fill(newColor.value)
  slices.push({ nombre: newNb.value, couleurs })
  rebuildMesh()
}

// --------- Fonction pour créer un triangle ---------
const createTriangle = (
  startAngle: number,
  endAngle: number,
  radius: number,
  thickness: number,
  color: THREE.Color,
  borderColor: number,
  group: THREE.Group,
  triangleItems: TriangleItem[],
  yOffset: number
) => {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.absarc(0, 0, radius, startAngle + 0.01, endAngle - 0.01, false)
  shape.lineTo(0, 0)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSize: radius * 0.05,
    bevelSegments: 2,
    bevelThickness: thickness * 0.5
  })
  const material = new THREE.MeshStandardMaterial({ color })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = yOffset
  group.add(mesh)

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.ShapeGeometry(shape)),
    new THREE.LineBasicMaterial({ color: borderColor })
  )
  edges.rotation.x = -Math.PI / 2
  edges.position.y = yOffset
  group.add(edges)

  const hitMesh = new THREE.Mesh(
    new THREE.ShapeGeometry(shape),
    new THREE.MeshBasicMaterial({ visible: false })
  )
  hitMesh.rotation.x = -Math.PI / 2
  hitMesh.position.y = yOffset
  group.add(hitMesh)

  triangleItems.push({ mesh, edges, hitMesh })
}

// --------- Rebuild Mesh ---------
const rebuildMesh = () => {
  if (!scene) return
  group.clear()
  triangleItems.length = 0

  let yOffset = 0
  const baseRadius = 0.05
  const baseNb = 6

  slices.forEach((slice, index) => {
    const nb = slice.nombre
    // Rayon proportionnel mais moins agressif
    const radius = (nb / baseNb) / 4 * baseRadius

    // Épaisseur selon rang précédent
    let thickness = 0.008
    if (index > 0) {
      if (nb === slices[index - 1].nombre) thickness = 0.018
      else if (nb < slices[index - 1].nombre) thickness = 0.008
    }

    for (let i = 0; i < nb; i++) {
      const startAngle = (i / nb) * Math.PI * 2
      const endAngle = ((i + 1) / nb) * Math.PI * 2
      createTriangle(
        startAngle,
        endAngle,
        radius,
        thickness,
        new THREE.Color(slice.couleurs[i]),
        0x000000,
        group,
        triangleItems,
        yOffset
      )
    }

    // Décalage vertical proportionnel
    yOffset += thickness + radius * 0.02
  })

  const totalHeight = yOffset
  group.position.y = -totalHeight / 2
}

// --------- Initialisation Three.js ---------
onMounted(() => {
  if (!container.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  camera = new THREE.PerspectiveCamera(60, container.value.clientWidth / container.value.clientHeight, 0.1, 5)
  camera.position.set(0, 0, cameraDistance)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(1, 2, 2)
  scene.add(light)
  scene.add(new THREE.AmbientLight(0xffffff, 0.5))

  scene.add(group)

  // Pivot pour rotation
  const pivotY = new THREE.Object3D()
  const pivotX = new THREE.Object3D()
  scene.add(pivotY)
  pivotY.add(pivotX)
  pivotX.add(group)

  let previousX = 0
  let previousY = 0
  renderer.domElement.addEventListener('pointerdown', (e) => {
    previousX = e.clientX
    previousY = e.clientY
    const onMove = (ev: PointerEvent) => {
      const deltaX = ev.clientX - previousX
      const deltaY = ev.clientY - previousY
      pivotY.rotation.y += deltaX * 0.01
      pivotX.rotation.x += deltaY * 0.01
      previousX = ev.clientX
      previousY = ev.clientY
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  })

  // Zoom
  renderer.domElement.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault()
    cameraDistance += e.deltaY * 0.001
    cameraDistance = Math.min(Math.max(cameraDistance, minDistance), maxDistance)
    camera.position.set(0, 0, cameraDistance)
    camera.lookAt(0, 0, 0)
  })

  // Sélection d’un triangle
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  renderer.domElement.addEventListener('click', (event: MouseEvent) => {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(triangleItems.map(t => t.hitMesh))
    if (intersects.length > 0) {
      const hit = intersects[0].object
      const item = triangleItems.find(t => t.hitMesh === hit)
      if (item) {
        const newColor = prompt('Nouvelle couleur (hex ou nom CSS) ?') || '#00ff00'
        ;(item.mesh.material as THREE.MeshStandardMaterial).color.set(newColor)
      }
    }
  })

  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene!, camera)
  }
  animate()

  const handleResize = () => {
    if (!container.value) return
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  }
  window.addEventListener('resize', handleResize)

  onBeforeUnmount(() => {
    renderer.dispose()
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 500px;
  touch-action: none;
}
.form-slice {
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
