// routes/vehiculoRoutes.js
const express = require('express');
const { doc, getDoc, collection, addDoc} = require('firebase/firestore');
const db = require('../firebase');

const notificacionRouter = express.Router();

//Para el token
const admin = require('firebase-admin');
const serviceAccount = {
    "type": "service_account",
    "project_id": "avanti-c4ba7",
    "private_key_id": "9d63b76e44996a2d4e46ff5552508597c274ff33",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDIK7h0Kv9kOraj\nA9ilcGsubStGlWCgULdaZqz63+HUXMoGHV4uLZ06fMaGJlMGivZYtEFGD3+gPLPJ\nPqyL7rfWcPzsv3yLWo9MeRyeyhSAixfbUWOzJPX+nQTbE/qghTBNCcWxmhayY3er\ndwTF3MkhASg54gco1cKW87tUkRYj/2Vh1R3WN14x724RpK7vk0u0bO254eKdFxg3\nHGTKLw+IkAOTabdsI3IeSSIQ1DDdP6aRdUFZswegBvYykcQaqI1LxYtjMOBkz0Ng\nyJyxIIxKa7hGhc5NqxxoFfBahoImKqa53v7amXgcaiYRNvJ/cT/3E5SH9RxBQ0gd\nFzdqaqwFAgMBAAECggEABlduP03qa+Y5SYZSa4FZf+3I+HI8jq+n82b71XHY0XXE\nF7f/9xYOXF8+Gdtmd3dZERva0omkqTKrHnXMGR3NuK85MBXr7+1FS26t07ECv8TI\nU3QrZK5H1dJrKDakksfNbS9hUjxXujyQ+r9pSQxy2ccT22uX/vjwsoATv/zdtvOu\nyLYMOkGJxOnHCfl3XVTDx/ETzeV1+lvdstkOB3LfNftVUQKXk+l3W2nxnCtwbCXu\nZpRO2pr8dygJgao2vNKJZJtpo82A8nhgFZLEC1yt7pX4ktJ8bviZoOtuhVC/bZF5\n9kf5G2SvBa0ZXdOosVojhI/puTQXlZHYQIR6gT9qyQKBgQDvWZNcNcpCrL6e8ih4\npFRngptAaeyZbcu3/rg/QBoN4HoGDH5x8r7yjG6hrIqNWpOgSHcJ7aHZ8Ja2CF7f\nHbjNfdpez8J3jZuKG9MJJ7WHMXwfwVjO4kFl6PZ+VpCiwvKuVV+EGKZSHI8/ff/g\nZ5jE65PEJyRdYJB5KjtOgAgSTQKBgQDWGG4HQNYnw4M9kWm8rynqrFWTq1oRUlSl\npGagtwGJTcOHLdi8HkzCyFhy4GHbC8SV/TMuhkHPrtJYjZzKKn4aOgOuIwa+6B2t\nYJjHdfiH+kb25oNePfE02FKHiBLBmkiUxBAXrB7uGbujmhX+RXyzTmXLH6TI6Brs\n/TAPDHysmQKBgCJN81nm97tAqP189aH844AGbxv3UorW+ri/UEb4eAN/Jd4SEllg\nkk+PIxgW87C4x6nUWQNaRLVIz0D9yCMwTlldbVvjaRrbd+x+emu4fkMHK6QdgQ39\nzaO+lP2ciJRbXo7v+4WiRsxD/Z/6/h56mqG2pfIaLhMYEPzcua1RmlaNAoGACYhQ\n7dW/M0oLP+SHlrUd4qsFrGuGuRq3ViC5yRIc6WYi/JPYAJhAxrNw7Lx83unpONxr\nOPkVWQ/pobO8dWvq7XQD0e8RT9K574xLgSYJiNRl8HxXAQ00/itbkVlHrIMYFDee\nl888GVHf/urPa+DgKoOlGKQyDBf5iu/DAgiGTJECgYAXl2JLd0CpELf73IQhRKvC\nrembMkBXnkwa9IJPM1gbLpJpLMtmS0CbhdTvHpfYFi8Ti1DC4QiDTGKvGql6ZtQR\nkebftWCw05fGamI/+BnVpve0XlI5BQ0RWak7PTfqXyRHUZSmzd8RMzzqruS8rqDQ\ndefhCByTjUYkozxylSKjZg==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fwlrc@avanti-c4ba7.iam.gserviceaccount.com",
    "client_id": "113539490105609553997",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fwlrc%40avanti-c4ba7.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

//////////


notificacionRouter.use(express.json());

//Ya implementado, no borrar
notificacionRouter.post('/registrarnotificacion', async (req, res) => {
    try {
        const notificacion = req.body;


        const imprevistoCollection = collection(db, 'notificacion');
        const docRef = await addDoc(imprevistoCollection, notificacion);

        res.json({ message: 'Notificacion agregada correctamente', userId: docRef.id});
        console.log("regustardo ")

    } catch (error) {
        console.error('Error al agregar el notificacion a Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al agregar el imprevisto a Firestore'});
    }
});

//Obtener todas las notificaciones del usuario
//05/01/2023
notificacionRouter.get('/obtenernotificaciones/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Assuming 'viajes' is your collection name
        const notificacionesRef = collection(db, 'notificacion');
        const notificacionesQuery = query(notificacionesRef, where('notificacion_usu_destino', '==', userId));
        const notificacionesSnapshot = await getDocs(notificacionesQuery);

        if (notificacionesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const notData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    notificacion_id: doc.id, // Agregar el I
                    notificacion_tipo: data.notificacion_tipo || '',
                    notificacion_usu_origen: data.notificacion_usu_origen || '',
                    notificacion_usu_destino: data.notificacion_usu_destino || '',
                    notificacion_id_viaje: data.notificacion_id_viaje || '',
                    notificacion_id_solicitud: data.notificacion_id_solicitud || '',
                    notificacion_fecha:data.notificacion_fecha || '',

                }
            });

            // Send the array of JSON objects as a response
            res.json(notData);
        } else {
            res.status(404).json({ error: 'No se encontraron notificaciones' });
        }
    } catch (error) {
        console.error('Error al obtener documentos desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documentos desde Firestore' });
    }
});


//Token
notificacionRouter.post('/enviarnotificacionserver/:token/:titulo/:cuerpo/:userId', async (req, res) => {
    const token = req.params.token;
    const titulo = req.params.titulo;
    const cuerpo = req.params.cuerpo;
    const userId = req.params.userId;
    console.log('RECIBE TOKEN', token)
    console.log('USERID', userId)

    // Ejemplo de enviar notificación a un dispositivo específico
    try {
        const message = {
            notification: {
                title: titulo,
                body: cuerpo
            },
            data: {
                userId: userId
            },
            token: token,
        };

        const response = await admin.messaging().send(message);
        console.log('Notificación enviada exitosamente:', response);
        res.sendStatus(200); // Responder con un código 200 OK
    } catch (error) {
        console.error('Error al enviar la notificación:', error);
        res.status(500).send('Error interno del servidor');
    }

    //res.sendStatus(200); // Responder con un código 200 OK
});


module.exports = notificacionRouter;
