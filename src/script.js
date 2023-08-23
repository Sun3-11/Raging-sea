import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'


/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Water
 */

// Water geometry
const waterGeometry = new THREE.PlaneGeometry(16, 12, 512, 512);

// Add foam attribute
const count = waterGeometry.attributes.position.count;
const foamPositions = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
    const vertexIndex = i * 3;
    const position = waterGeometry.attributes.position.array.slice(vertexIndex, vertexIndex + 3);
    const foamIntensity = Math.random() * 0.2; 
    foamPositions[vertexIndex] = position[0];
    foamPositions[vertexIndex + 3] = position[1];
    foamPositions[vertexIndex + 2] = foamIntensity;
}
waterGeometry.setAttribute('foamPosition', new THREE.BufferAttribute(foamPositions, 3));
// Colors
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'
debugObject.FoamColor = '#ffffff';
debugObject.fogColor = '#66707a'; 


// Material
const waterMaterial = new THREE.ShaderMaterial({
    
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        uniforms:
    {
        uTime: { value: 0 },

        //vertex
        uBigWavesElevation: { value: 0.479 }, 
        uBigWavesFrequency: { value: new THREE.Vector2(1.052, 1.052) },//1.595
        uBigWavesSpeed: { value: 0.73 },


        uSmallWavesElevation: { value: 0.268 },
        uSmallWavesFrequency: { value: 1.069 },
        uSmallWavesSpeed: { value: 0.235 },
        uSmallIterations: { value: 1 },

        //fragment
        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.036 },
        uColorMultiplier: { value: 1.207 },

        uFoamIntensity: { value: 2.344}, 
        uFoamColor: { value: new THREE.Color(debugObject.FoamColor)},

        fogColor: { value: new THREE.Color(debugObject.fogColor) },
        uFogDensity: { value: 5.0 }, 
        uFogNear: { value: 0.400 }, 
        uFogFar: { value: 2.692 } 
    
    }
    
})

//Debug
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')

gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')

//foam Debug
gui.addColor(debugObject, 'FoamColor').onChange(() => { waterMaterial.uniforms.uFoamColor.value.set(debugObject.FoamColor) })
gui.add(waterMaterial.uniforms.uFoamIntensity, 'value').min(0).max(5).step(0.001).name('uFoamIntensity')

//fog Debug
gui.addColor(debugObject, 'fogColor').onChange(() => { waterMaterial.uniforms.fogColor.value.set(debugObject.fogColor) })
gui.add(waterMaterial.uniforms.uFogDensity, 'value').min(0).max(5).step(0.001).name('FogDensity')
gui.add(waterMaterial.uniforms.uFogNear, 'value').min(0).max(5).step(0.001).name('FogNear')
gui.add(waterMaterial.uniforms.uFogFar, 'value').min(0).max(5).step(0.001).name('FogFar')


// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 2, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Water
    waterMaterial.uniforms.uTime.value = elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()