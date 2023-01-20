


//FIREBASE WORKPLACE    
import { initializeApp } from "firebase/app";
import { getFirestore, queryEqual, exists, data } from "firebase/firestore";
import { collection, getDocs , addDoc} from "firebase/firestore"; 
import { getDatabase, ref, set, onValue } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = { 
    apiKey: "AIzaSyDHZtE49cI69kCQa-tyw6XlAPHfRf0jiYw",
    authDomain: "cavecar-f1011.firebaseapp.com",
    databaseURL: "https://cavecar-f1011-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cavecar-f1011",
    storageBucket: "cavecar-f1011.appspot.com",
    messagingSenderId: "465966621561",
    appId: "1:465966621561:web:26a21fb466d53acf6fc5a8",
    measurementId: "G-2DQE9E60FM"
}



//3D modeling
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
var material1=new THREE.MeshBasicMaterial()



dat.GUI.toggleHide()


var camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 200 );
camera.position.set(0,0,2)
scene.add(camera)





function buildTunle(map){
    console.log(map)
    for(var i=1;i<map.length+1;i++){
        addTunle(i,map.hight,map.radius,map.engle);
    }
}



function addTunle(place, hight, radius, engle){
    console.log(place)
    material1.color = new THREE.Color(0xfff000)
    var GeometrySphere = new THREE.TorusGeometry( radius, .2, 16, 100 );
    var GeometryBox= new THREE.BoxGeometry(0.2,radius,(radius-hight))
    var sphere = new THREE.Mesh(GeometrySphere,material1)
    var Box= new THREE.Mesh(GeometryBox,material1)
    sphere.rotation.y= engle
    sphere.position.set(place,0,0)
    //Box.rotation.y= engle
    //Box.position.set(place,0,0)
    scene.add(sphere)
    scene.add(Box)
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
    width: window.innerWidth/2,
    height: window.innerHeight/2
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth/2
    sizes.height = window.innerHeight/2

    // Update camera
    camera.aspect = sizes.width / sizes.height/2
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




















//firebase calls



// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const realTimeDB = getDatabase(app);

let users=[]
let caves=[]

//userinput
var userIn



function checkUser(){ 
    onValue(ref(realTimeDB, "user/"),(snapshot)=>{
        if(snapshot.val().in){
            caveOptions(snapshot.val().id)
        }
    })
}

checkUser()

/*
try {
    
    const docRef = addDoc(collection(db, "users"), {
        name: username,
        password: password,
    });
    console.log("Document written with ID: ", docRef.id);
    } catch (e) {
    console.error("Error adding document: ", e);
    }
*/



function caveOptions(userID){
    getDocs(collection(db, "caves/"))
    .then((snapshot)=>{
        caves=[]
        snapshot.docs.forEach((doc)=>{
            caves.push({ ...doc.data()})
        })
        caves.forEach((cave)=>{
            cave.usersID.forEach((id)=>{
                if(id==userID)
                {
                    let option =document.createElement("option");
                    let caveName=document.createTextNode(cave.name);
                    option.value=cave.id
                    option.appendChild(caveName)
                    console.log(option.value)
                    document.getElementById('caves').appendChild(option)
                }

            })
            
        })
    })
    .catch((error)=>{
        console.log("the error is: " + error)
    });
}


document.getElementById("caves").addEventListener( "change",(selected)=>{
    caves.forEach((cave)=>{
        if(cave.id==selected.target.value){
            buildTunle(cave.build)
        }
    })
});