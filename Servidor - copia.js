const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, getDoc, updateDoc,setDoc, addDoc, getDocs,deleteDoc, where, query } = require('firebase/firestore');

const firebaseConfig = {
    // Tu configuración de Firebase aquí
    apiKey: "AIzaSyDSb9KMlW3DDNFtuIytiz3NEqVy8R7yBTE",
    authDomain: "avanti-c4ba7.firebaseapp.com",
    projectId: "avanti-c4ba7",
    storageBucket: "avanti-c4ba7.appspot.com",
    messagingSenderId: "361833868381",
    appId: "1:361833868381:web:7e6d65d13283ef957031b4",
    measurementId: "G-F9QSKG795F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const server = express();
const port = 3000;



server.listen(port, () => {
    console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});
