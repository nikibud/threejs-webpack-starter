import './style.css'

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, get } from "firebase/database";
import { getFirestore, queryEqual, exists, data, GeoPoint, Firestore } from "firebase/firestore";

import { collection, getDocs , addDoc} from "firebase/firestore"; 

const firebaseConfig = {
    // ...
    // The value of `databaseURL` depends on the location of the database
    apiKey: "AIzaSyDHZtE49cI69kCQa-tyw6XlAPHfRf0jiYw",
    authDomain: "cavecar-f1011.firebaseapp.com",
    databaseURL: "https://cavecar-f1011-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cavecar-f1011",
    storageBucket: "cavecar-f1011.appspot.com",
    messagingSenderId: "465966621561",
    appId: "1:465966621561:web:26a21fb466d53acf6fc5a8",
    measurementId: "G-2DQE9E60FM",
    databaseURL: "https://cavecar-f1011-default-rtdb.europe-west1.firebasedatabase.app",

};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storedb = getFirestore(app);

const sampelsRef = ref(db, '/samples');
const driveRef = ref(db, '/startDrive/start')
var cave=[];
var caves;
var allowedUsers=[];
var drive=false,startTime, taken=true;;
var userIn,userId,cavename,lat,long;
checkUser();
set(ref(db, 'startDrive/' ), {
    start:0 ,
})
function checkUser(){
    get(ref(db, "user/")).then((snapshot)=>{
        console.log(snapshot.val())
        userId=snapshot.val().id
        userIn=snapshot.val().in
        if(!userIn){
            title.innerHTML="Please enter to your user";
            document.getElementById("startDriveData").style="display:none"
            document.getElementById("startDriveData").style="display:none"
            document.getElementById("username").style="display:none"
            document.getElementById("share").style="display:none"
            document.getElementById("login").style="display:block";
            document.getElementById("logout").style="display:none";
        }
        else{
            title.innerHTML="Start Drive";
            document.getElementById("startDriveData").style="display:block"
            document.getElementById("startDriveBtn").style="display:block"
            document.getElementById("username").style="display:block"
            document.getElementById("share").style="display:block"
            document.getElementById("login").style="display:none";
            document.getElementById("logout").style="display:block";
        }
    })
    console.log("user is in: " + userIn)
    
}
var title = document.getElementById("title");
document.getElementById("logout").addEventListener("click",()=>{
    console.log("logout")
    
    set(ref(db, 'user/' ), {
        id:0 ,
        in:false
    }).then(checkUser())
});

document.getElementById("share").addEventListener("click",()=>{
    let username=document.getElementById("username").value;
    getDocs(collection(storedb, "users"))
    .then((snapshot)=>{
        snapshot.docs.forEach((doc)=>{
            if(doc.data().name==username){
                if(userId != doc.id)
                {
                    allowedUsers.push(doc.id)
                    console.log("user added")
                }
            }
        })
    })
    .catch((error)=>{
        console.log("the error is: " + error)
    });
})

document.getElementById("startDrive").addEventListener("click",()=>{
   
    cavename = document.getElementById("caveName").value;
    lat= document.getElementById("lat").value;
    long= document.getElementById("lon").value;
    document.getElementById("caveName").value="";
    document.getElementById("lat").value="";
    document.getElementById("lon").value="";
    console.log("the cave name is "+cavename)
    if(cavename=="" || lat=="" || long==""){
        document.getElementById("errorMassege").style="display:block" 
        document.querySelector('#errorMassege h2').textContent="please fill all the inputs"
    }
    else{
        cavenameCheck(cavename)
        
    }
    
    
});

function cavenameCheck(cavename){
    
    getDocs(collection(storedb, "caves/"))
    .then((snapshot)=>{
        caves=[]
        snapshot.docs.forEach((doc)=>{
            caves.push({ ...doc.data(),id:doc.id})
        })
        caves.forEach((cave)=>{
            console.log(cave.usersID)
            cave.usersID.forEach((id)=>{
                if(id==userId)
                {
                    if(cave.name==cavename){
                        document.getElementById("errorMassege").style="display:block" 
                        document.querySelector('#errorMassege h2').textContent="cave name is taken please use different name "
                        taken= false;
                    }
                }

            })
            
        })
        if(taken){
            drive=true;
            set(ref(db, 'startDrive/' ), {
                start:1 ,
            })
            startTime=Date.now()
            title.innerHTML="Drive Data";
            document.getElementById("errorMassege").style="display:none"
            document.getElementById("DriveData").style="display:block"
            document.getElementById("startDriveData").style="display:none"
            document.getElementById("username").style="display:none"
            document.getElementById("share").style="display:none"
            document.getElementById("startDrive").value="stop"
            set(ref(db, 'samples/' ), {
                radius:0 ,
                timesTurned: 0
            })
            Drive()
        }
    })
    .catch((error)=>{
        console.log("the error is: " + error)
    });
    
}

function Drive(){ 
    if(drive){
        console.log("hi")
        onValue(sampelsRef, (snapshot) => {
            cave.push(snapshot.val())
            console.log(cave)
            document.getElementById("samplesPassed").innerHTML=cave.length-1
            document.getElementById("timesTurned").innerHTML=snapshot.val().timesTurned
            
            let nowTime = Date.now()-startTime;
            let sec = Math.floor((nowTime/1000)%60)
            let min = Math.floor((nowTime/(1000*60))%60)
            console.log(Date.now()+" - "+ startTime+ " = ");
            document.getElementById("time").innerHTML=`${min}:${sec}`
        });
        onValue(driveRef,(snapshot)=>{
            if(snapshot.val()==0){
                allowedUsers.push(userId)
                document.getElementById("startDrive").value="start"
                document.getElementById("DriveData").style="display:none"
                document.getElementById("startDriveData").style="display:block"
                document.getElementById("username").style="display:block"
                document.getElementById("share").style="display:block"
                addDoc(collection(storedb, "caves/"), {
                    usersID: allowedUsers,
                    name:cavename,
                    build:cave,
                    location: new GeoPoint(lat,long)
                });
                allowedUsers=[]
            }
        })
    }
    else{
        console.log("finish")
    }
    
}


