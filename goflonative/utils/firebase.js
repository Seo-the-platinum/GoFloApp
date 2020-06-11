import * as firebase from 'firebase'

const firebaseConfig= {
    apiKey: "AIzaSyA1QLChM82Cj2YyTjXYAbfX4EM1sisxBbg",
    authDomain: "goflo-63ff3.firebaseapp.com",
    databaseURL: "https://goflo-63ff3.firebaseio.com",
    projectId: "goflo-63ff3",
    storageBucket: "goflo-63ff3.appspot.com",
    messagingSenderId: "395074825899",
    appId: "1:395074825899:web:f7a28f13e51d013d3d91ee",
    measurementId: "G-75QLVFGNL8",
  }
let app= firebase.initializeApp(firebaseConfig)
export const db= app.database()
export const auth= app.auth()
