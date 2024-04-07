// routes/vehiculoRoutes.js
const express = require('express');
const { doc, getDoc, collection, query, where, getDocs} = require('firebase/firestore');
const db = require('../firebase');

const solicitudRouter = express.Router();

// Middleware para analizar el cuerpo de la solicitud como JSON
solicitudRouter.use(express.json());
//Obtener datos de la solcitud teniendo su id 04/01/202 no server
solicitudRouter.get('/obtenersolicitud/:id', async (req, res) => {

    const solicitudId = req.params.id;

    try {
        const solicitudRef = doc(db, 'solicitud', solicitudId);
        const solicitudDoc = await getDoc(solicitudRef);

        if (solicitudDoc.exists()) {
            const solicitudData = solicitudDoc.data();

            // Enviar datos como respuesta en formato JSON
            res.json({

                conductor_id: solicitudData.conductor_id || '',
                horario_id: solicitudData.horario_id || '',
                horario_trayecto: solicitudData.horario_trayecto || '',
                parada_id: solicitudData.parada_id || '',
                pasajero_id:solicitudData.pasajero_id || '',
                solicitud_date:solicitudData.solicitud_date || '',
                solicitud_status:solicitudData.solicitud_status || '',
                viaje_id:solicitudData.viaje_id || '',
                solicitud_activa_con:solicitudData.solicitud_activa_con || '',
                solicitud_activa_pas:solicitudData.solicitud_activa_pas || '',


            });
        } else {
            res.status(404).json({ error: 'La solcitud no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }
});


//Ruta para obtener la solicitud de acuerdo al id del horario
solicitudRouter.get('/obtenersolicitudhorario/:id', async (req, res) => {
    const horarioId = req.params.id;
    console.log("horarioId", horarioId)
    try {
        // Consultar la solicitud con el horario_id proporcionado
        const solicitudQuery = query(collection(db, 'solicitud'), where('horario_id', '==', horarioId));
        const solicitudSnapshot = await getDocs(solicitudQuery);

        // Verificar si se encontró alguna solicitud
        if (!solicitudSnapshot.empty) {

            const solicitudData = solicitudSnapshot.docs[0].data();
        
            // Enviar el horario_id como respuesta en formato JSON
            res.json({ 
                conductor_id: solicitudData.conductor_id || '',
                horario_id: solicitudData.horario_id || '',
                horario_trayecto: solicitudData.horario_trayecto || '',
                parada_id: solicitudData.parada_id || '',
                pasajero_id: solicitudData.pasajero_id || '',
                solicitud_date: solicitudData.solicitud_date || '',
                solicitud_status: solicitudData.solicitud_status || '',
                viaje_id: solicitudData.viaje_id || '',
                solicitud_activa_con: solicitudData.solicitud_activa_con || '',
                solicitud_activa_pas: solicitudData.solicitud_activa_pas || '', 
        });
        } else {
            res.status(404).json({ error: 'La solicitud no existe' });
        }
    } catch (error) {
        console.error('Error al obtener solicitud desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener solicitud desde Firestore' });
    }
});

// Ruta para registrar una solicitud
solicitudRouter.post('/registrarsolicitud', async (req, res) => {
    try {
        const nuevoViaje = req.body; // Asumiendo que la solicitud POST contiene los datos del nuevo usuario

        // Agrega un viaje a la coleccion "viaje"
        const viajesCollection = collection(db, 'solicitud');
        const docRef = await addDoc(viajesCollection, nuevoViaje);

        res.json({ message: 'Solicitud agregado correctamente', userId: docRef.id});
        //res.json({ message: 'Usuario agregado correctamente', userId: docRef.id });
    } catch (error) {
        console.error('Error al agregar solicitud a Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al agregar solicitud a Firestore' });
    }
});


module.exports = solicitudRouter;
