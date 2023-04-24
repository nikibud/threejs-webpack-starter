


//FIREBASE WORKPLACE    
import { initializeApp } from "firebase/app";
import { getFirestore, queryEqual, exists, data } from "firebase/firestore";
import { collection, getDocs , addDoc} from "firebase/firestore"; 
import { getDatabase, ref, set, onValue ,get } from "firebase/database";

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

const rockTexture = new THREE.TextureLoader().load();
//map:rockTexture
const material = new THREE.MeshBasicMaterial({color: 0xffff00})


dat.GUI.toggleHide()


var camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 200 );
camera.position.set(0,0,14)
camera.rotateX=0.5
//camera.rotateY=0.5
scene.add(camera)







function buildTunle(map){
    console.log(map)
    for(var i=0;i<map.length;i++){
        addTunle(i*-0.3,map[i].hight,map[i].radius,map[i].angle);
        
    }
}



function addTunle(place, hight, radius, angle){

    
    var GeometryTorus = new THREE.TorusGeometry( radius, .2 , 16, 100,3.3 );
    var GeometryBox= new THREE.BoxGeometry(radius*2,(hight),1)
    var Torus = new THREE.Mesh(GeometryTorus,material)

    var Box= new THREE.Mesh(GeometryBox,material)
    console.log(angle)
    Torus.rotation.y= (angle)*0.1
    Torus.position.set(0,0.5,place)
    Box.rotation.y= angle*0.1
    Box.position.set(0,0,place)
    console.log(Box.position  )
    console.log(camera.position)

    scene.add(Torus)
    scene.add(Box)
    var pointLight = new THREE.PointLight(0xffffff, 0.1)
    pointLight.position.x = place
    pointLight.position.y = place+1
    pointLight.position.z = place+2
    scene.add(pointLight)
    tick()
}
// Lights



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
checkUserIN()

function checkUserIN(){
    get(ref(realTimeDB, "user/")).then((snapshot)=>{
        console.log(snapshot.val())
        if(!snapshot.val().in){
            document.getElementById("login").style="display:block";
            document.getElementById("logout").style="display:none";
        }
        else{
            document.getElementById("login").style="display:none";
            document.getElementById("logout").style="display:block";
        }
    })
}

document.getElementById("logout").addEventListener("click",()=>{
    console.log("logout")
    
    set(ref(realTimeDB, 'user/' ), {
        id:0 ,
        in:false
    }).then(checkUserIN())
});

function checkUser(){ 
    onValue(ref(realTimeDB, "user/"),(snapshot)=>{
        if(snapshot.val().in){
            console.log(snapshot.val().id)
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
            console.log(cave)
            scene.remove.apply(scene, scene.children);
            buildTunle(cave.build)
        }
    })
});