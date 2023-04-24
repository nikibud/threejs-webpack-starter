import './style.css'

import { initializeApp } from "firebase/app";
import { getFirestore, queryEqual, exists, data } from "firebase/firestore";
import { collection, getDocs , addDoc} from "firebase/firestore"; 

import { getDatabase, ref, set, onValue ,get } from "firebase/database";


const firebaseConfig = { 
    apiKey: "AIzaSyDHZtE49cI69kCQa-tyw6XlAPHfRf0jiYw",
    authDomain: "cavecar-f1011.firebaseapp.com",
    databaseURL: "https://cavecar-f1011-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cavecar-f1011",
    storageBucket: "cavecar-f1011.appspot.com",
    messagingSenderId: "465966621561",
    appId: "1:465966621561:web:26a21fb466d53acf6fc5a8",
    measurementId: "G-2DQE9E60FM",
    databaseURL: "https://cavecar-f1011-default-rtdb.europe-west1.firebasedatabase.app",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const realTimeDB = getDatabase(app);
//userinput

checkUserIN()





function checkUserIN(){
    get(ref(realTimeDB, "user/")).then((snapshot)=>{
        if(!snapshot.val().in){
            document.getElementById("login").style="display:block";
            document.getElementById("logout").style="display:none";
        }
        else{
            document.getElementById("login").style="display:none";
            document.getElementById("logout").style="display:block";
            getDocs(collection(db, "users"))
            .then((snapshotFirestore)=>{
                
                snapshotFirestore.docs.forEach((doc)=>{
                    console.log(doc.data())
                    if(doc.id==snapshot.val().id){
                        document.getElementById("welcom").innerHTML=`${doc.data().name} welcom to cave car nasa project `;
                        //break;
                    }
                })

            })
            
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