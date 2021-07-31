import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'



/**
 * Base
 */


// Debug
const gui = new dat.GUI()
const debugParameter = {
    color: 0xff0000
}

// console.log('dat.gui', gui)


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Models
 */
 const gltfLoader = new GLTFLoader()
 let importedModell;

 gltfLoader.load(
    '/models/building_02_220919_2.gltf',
    (gltf) =>
    {
        console.log('success')
        gltf.scene.name = 'ImportedScene'
        scene.add(gltf.scene)

        gui.add(gltf.scene.position, 'x')
            .min(-3)
            .max(3)
            .step(0.01)
            .name('x-Richtung')
        gui.add(gltf.scene.position, 'y')
            .min(-3)
            .max(3)
            .step(0.01)
            .name('y-Richtung')
        gui.add(gltf.scene.position, 'z')
            .min(-3)
            .max(3)
            .step(0.01)
            .name('z-Richtung')
        gui.add(gltf.scene, 'visible')
        gui.add(gltf.scene.children[2].material , 'wireframe')
        gui.addColor(debugParameter, 'color').onChange(()=>{
            // console.log('Changed')
            gltf.scene.children[2].material.color.set(debugParameter.color)

        })
        console.log('Scene object importedScene: ', gltf.scene)


    },
    (progress) =>
    {
        console.log('progress')
        console.log(progress)
    },
    (error) =>
    {
        console.log('error')
        console.log(error)
    }
)

console.log('Var importedModel', importedModell)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    // width: window.innerWidth,
    // height: window.innerHeight
    width: 800,
    height: 600
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
const camera = new THREE.OrthographicCamera(- 7, 7, 7, -7, 0.01, 1000)
camera.position.set(80, 110, -55)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, 0)
controls.enableDamping = true

// Custom Controls
let increaseValue = 0;
document.getElementById('control-1').addEventListener('click', function() {
    increaseValue +=10; 
    // console.log(camera.position) 
    camera.position.set(160+increaseValue, 110, -55)
}, false);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()
    // console.log(camera.position)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()