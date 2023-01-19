import './style.css'

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
const firebaseConfig = {
    // ...
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://cavecar-f1011-default-rtdb.europe-west1.firebasedatabase.app",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const sampelsRef = ref(db, 'sampels');
var cave=[];
var drive=false;


document.getElementById("startDrive").addEventListener("click",()=>{
    if(drive){
        document.getElementById("startDrive").value="Start"
        drive=false;
        set(ref(db, 'startDrive/' ), {
            start:false ,
        })
        Drive(drive)
    }
    else{
        document.getElementById("startDrive").value="Stop"
        drive=true;
        set(ref(db, 'startDrive/' ), {
            start:true ,
        })
        Drive(drive)
    }
});

function Drive(drive){ 
    if(drive){
        console.log("hi")
        onValue(sampelsRef, (snapshot) => {
            cave.push(snapshot.val())
            console.log(cave)
        });
          
        window.addEventListener("keydown",(event)=>{
            
            switch ( event.code ) {
        
                case 'ArrowUp':
                case 'KeyW':
                    set(ref(db, 'move/' ), {
                        direction:1 ,
                    })
                    .catch((error) => {
                        console.log("failed")
                    }); break;
        
                case 'ArrowLeft':
                case 'KeyA': 
                    set(ref(db, 'move/' ), {
                        direction:3 ,
                    })
                    .catch((error) => {
                        console.log(error)
                    }); break;
        
                case 'ArrowDown':
                case 'KeyS': 
                    set(ref(db, 'move/' ), {
                        direction:2 ,
                    })
                    .catch((error) => {
                        console.log(error)
                    }); break;
        
                case 'ArrowRight':
                case 'KeyD': 
                    set(ref(db, 'move/' ), {
                        direction:4 ,
                    })
                    .catch((error) => {
                        console.log(error)
                    }); break;
        
            }
        });
        
        window.addEventListener("keyup",()=>{
            
            set(ref(db, 'move/' ), {
                direction:0 ,
            })
            .catch((error) => {
                console.log(error)
            }); 
        });
    }
    else{
        console.log("finish")
    }
    
}




