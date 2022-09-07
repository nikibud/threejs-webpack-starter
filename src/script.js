import './style.css'
import * as THREE from 'three'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
var geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

// Materials

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)
// Mesh
var sphere = new THREE.Mesh(geometry,material)
var material1=new THREE.MeshBasicMaterial()
var geometry1 = new THREE.TorusGeometry( .5, .2, 16, 100 );


var camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 200 );
camera.position.set(0,0,2)
scene.add(camera)

for(var i=-1.5;i<2.5;i+=0.25){
    addTunle(i);
}


function addTunle(place){
    if(place%0.5==0){
        material1.color = new THREE.Color(0xfff000)
        sphere = new THREE.Mesh(geometry1,material1)
        sphere.rotation.y= 5
        sphere.position.set(place,0,0)
        scene.add(sphere)
    }
    else{
        sphere = new THREE.Mesh(geometry,material)
        sphere.rotation.y= 5
        sphere.position.set(place,0,0)
        scene.add(sphere)
    }
}
// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

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
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


var controls =new FirstPersonControls(camera, renderer.domElement);
controls.lookSpeed=0.3;
controls.movementSpeed=2.0;
renderer.render(scene,camera)


canvas.addEventListener("keyDown",(event)=>{
    console.log(event.code)
})





/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    

    // Update Orbital Controls
    // controls.update()
    controls.update( clock.getDelta() );
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
