const functions = require('firebase-functions');
const express = require('express');
const { initializeApp } = require('firebase/app');
const {
    getFirestore,
    doc,
    getDoc,
} = require('firebase/firestore');

const firebaseConfig = {
    // Tu configuración de Firebase aquí
    apiKey: 'tu-api-key',
    authDomain: 'tu-auth-domain',
    projectId: 'tu-project-id',
    storageBucket: 'tu-storage-bucket',
    messagingSenderId: 'tu-messaging-sender-id',
    appId: 'tu-app-id',
    measurementId: 'tu-measurement-id',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const server = express();

// Ruta para la función helloWorld
server.get('/helloWorld', (req, res) => {
    res.send('Hello from Firebase!');
});

// Ruta para consultar un usuario por ID
server.get('/api/usuario/:id', async (req, res) => {
    const usuarioId = req.params.id;
    try {
        const usuarioRef = doc(db, 'usuario', usuarioId);
        const usuarioDoc = await getDoc(usuarioRef);
        if (usuarioDoc.exists()) {
            const usuarioData = usuarioDoc.data();
            res.json({
                usu_boleta: usuarioData.usu_boleta || '',
                usu_foto: usuarioData.usu_foto || '',
                usu_nombre: usuarioData.usu_nombre || '',
                usu_nombre_usuario: usuarioData.usu_nombre_usuario || '',
                usu_primer_apellido: usuarioData.usu_primer_apellido || '',
                usu_segundo_apellido: usuarioData.usu_segundo_apellido || '',
                usu_status: usuarioData.usu_status || '',
                usu_telefono: usuarioData.usu_telefono || '',
                usu_tipo: usuarioData.usu_tipo || '',
            });
        } else {
            res.status(404).json({ error: 'El usuario no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }
});

// Exportar como función de Cloud Function
exports.app = functions.https.onRequest(server);
