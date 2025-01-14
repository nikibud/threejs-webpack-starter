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
let email,secPassword,username,password,check=false
let users=[]
checkUserIN()

document.getElementById("loginBtn").addEventListener("click",()=>{
    username=document.getElementById("username").value
    password=document.getElementById("password").value
    document.getElementById("username").value=''
    document.getElementById("password").value=''
    users=[]
    checkUser(username,password,true)
    
})

document.getElementById("registerBtn").addEventListener("click",()=>{
    document.getElementById("register").style.display="block"
    document.getElementById("registerBtn").style.display="none"
    document.getElementById("login").style.display="none"
})

document.getElementById("rSubmit").addEventListener("click",()=>{
    username=document.getElementById("rUsername").value
    password=document.getElementById("rPassword").value
    users=[]
    checkUser(username,password,false)
})




function loginCheck(users,username,password){
    for(let i=0;i<users.length;i++){
        if(users[i].name == username && users[i].password==password){
            set(ref(realTimeDB, 'user/' ), {
                in:true,
                id:users[i].id
            })
            .catch((error) => {
                console.log(error)
            }); 
            break;
        }
        else{
            check=false
        }
    }
    checkUserIN()
    window.location.href = "home.html";
}

function registerCheck(users,username,password){
    for(let i=0;i<users.length;i++){
        if(users[i].name == username ){
            document.getElementById("usernameError").style.display="block"
            check=false
            document.getElementById("rUsername").value=''
            document.getElementById("rPassword").value=''
            document.getElementById("rSecPassword").value=''
            document.getElementById("email").value=''
            return;
        }
    }
    secPassword=document.getElementById("rSecPassword").value
    email=document.getElementById("email").value
    if(password == secPassword & password != ''){ 
        check=true
        let docRef = addDoc(collection(db, "users"), {
            name: username,
            password: password,
            email:email
        });
        console.log("Document written with ID: ", docRef.id);
        document.getElementById("register").style.display="none"
        document.getElementById("registerBtn").style.display="block"
        document.getElementById("login").style.display="block"
    }
    else{
        check=false
        document.getElementById("rUsername").value=''
        document.getElementById("rPassword").value=''
        document.getElementById("rSecPassword").value=''
        document.getElementById("email").value=''
    }
    console.log(check)
}



function checkUser(username,password,checkType){ 
    getDocs(collection(db, "users"))
    .then((snapshot)=>{
        snapshot.docs.forEach((doc)=>{
            users.push({ ...doc.data(),id: doc.id})
        })
        if(checkType)
            loginCheck(users,username,password);
        else    
            registerCheck(users,username,password)
    })
    .catch((error)=>{
        console.log("the error is: " + error)
    });

}

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

/*else{
    try {
        
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}*/


function printUsers(){
    getDocs(collection(db, "users"))
    .then((snapshot)=>{
        users=[]
        snapshot.docs.forEach((doc)=>{
            users.push({ ...doc.data(),id: doc.id})
        })
        console.log(users)
    })
    .catch((error)=>{
        console.log("the error is: " + error)
    });
}