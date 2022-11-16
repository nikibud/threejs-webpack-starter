import './style.css'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
const firebaseConfig = {
    // ...
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://cavecar-f1011-default-rtdb.europe-west1.firebasedatabase.app",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

set(ref(db, 'move/' ), {
  direction:1 ,
})
.then(() => {
  console.log("success")
})
.catch((error) => {
    console.log("failed")
});

window.addEventListener("keydown",(event)=>{
    
    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            set(ref(db, 'move/' ), {
                direction:1 ,
            })
            .then(() => {
                console.log("success")
            })
            .catch((error) => {
                console.log("failed")
            }); break;

        case 'ArrowLeft':
        case 'KeyA': 
            set(ref(db, 'move/' ), {
                direction:3 ,
            })
            .then(() => {
                console.log("success")
            })
            .catch((error) => {
                console.log(error)
            }); break;

        case 'ArrowDown':
        case 'KeyS': 
            set(ref(db, 'move/' ), {
                direction:2 ,
            })
            .then(() => {
                console.log("success")
            })
            .catch((error) => {
                console.log(error)
            }); break;

        case 'ArrowRight':
        case 'KeyD': 
            set(ref(db, 'move/' ), {
                direction:4 ,
            })
            .then(() => {
                console.log("success")
            })
            .catch((error) => {
                console.log(error)
            }); break;

    }
});

window.addEventListener("keyup",(event)=>{
    
    set(ref(db, 'move/' ), {
        direction:0 ,
    })
    .then(() => {
        console.log("success")
    })
    .catch((error) => {
        console.log(error)
    }); 
});



