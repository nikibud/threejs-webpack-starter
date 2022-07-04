import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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
/**
 * Camera
 */
// Base camera
var camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 200 );
var controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0,0,2)
scene.add(camera)
renderer.render(scene,camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true



addEventListener("keydown",position=>{
    console.log(position.code)
    switch(position.code){
        case "KeyW":
            console.log("hi")
            camera.position.z -=0.1
            break;
        case "KeyS":
            camera.position.z +=0.1
            break;
        case "KeyA":
            camera.position.x-=0.1
            break;
        case "KeyD":
            camera.position.x+=0.1
            break;
    
        case "ArrowUp":
            camera.rotation.x+=0.05
            break;
        case "ArrowDown":
            camera.rotation.x-=0.05
            break;
        case "ArrowLeft":
            camera.rotation.y+=0.05
            break;
        case "ArrowRight":
            camera.rotation.y-=0.05
            break;
    }
   
    console.log(camera.position.z)
    renderer.render(scene,camera)
})
























/**
 * Animate
 */
/*
const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
*/