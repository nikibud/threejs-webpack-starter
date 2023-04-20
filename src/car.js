import './style.css'

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, get } from "firebase/database";
import { doc } from 'firebase/firestore';

const firebaseConfig = {
    // ...
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://cavecar-f1011-default-rtdb.europe-west1.firebasedatabase.app",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


const sampelsRef = ref(db, '/samples');
var cave=[];
var drive=false,startTime;
var userIn,userId,cavename;
get(ref(db, "user/")).then((snapshot)=>{
    if(snapshot.val().in){
        userId=snapshot.val().id
        userIn=snapshot.val().in
        console.log("user is in: " + userIn)
    }
    if(!userIn){
        title.innerHTML="Please enter to your user";
        document.getElementById("startDriveData").style="display:none"
        document.getElementById("startDriveBtn").style="display:none"
    }
    else{
        title.innerHTML="Start Drive";
        document.getElementById("startDriveData").style="display:block"
        document.getElementById("startDriveBtn").style="display:block"
    }
})
console.log("user is in: " + userIn)

var title = document.getElementById("title");

document.getElementById("startDrive").addEventListener("click",()=>{
    cavename = document.getElementById("caveName").value;
    console.log("the cave name is "+cavename)
    if(cavename==""){
        document.getElementById("errorMassege").style="display:block"
    }
    else{
        
        drive=true;
        set(ref(db, 'startDrive/' ), {
            start:1 ,
        })
        startTime=Date.now()
        title.innerHTML="Drive Data";
        document.getElementById("errorMassege").style="display:none"
        document.getElementById("DriveData").style="display:block"
        document.getElementById("startDriveBtn").style="display:none"
        document.getElementById("startDriveData").style="display:none"
        set(ref(db, 'samples/' ), {
            radius:0 ,
            timesTurned: 0
        })
        Drive()
        
    }
});

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

            if(cave.length>=100){
                set(ref(db, 'startDrive/' ), {
                    start:0 ,
                })
                let docRef = addDoc(collection(db, "caves/"), {
                    id: userId,
                    name:cavename,
                    build:cave
                });
            }
        });
    }
    else{
        console.log("finish")
    }
    
}



