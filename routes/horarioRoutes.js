// routes/vehiculoRoutes.js
const express = require('express');
const { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc} = require('firebase/firestore');
const db = require('../firebase');

const horarioRouter = express.Router();

horarioRouter.use(express.json());

// Ruta para registrar un viaje -pasajero
horarioRouter.post('/registrarhorario', async (req, res) => {
    try {
        const nuevoViaje = req.body; // Asumiendo que la solicitud POST contiene los datos del nuevo usuario

        // Agrega un viaje a la coleccion "viaje"
        const viajesCollection = collection(db, 'horario');
        const docRef = await addDoc(viajesCollection, nuevoViaje);

        res.json({ message: 'viaje agregado correctamente', userId: docRef.id});
        //res.json({ message: 'Usuario agregado correctamente', userId: docRef.id });
    } catch (error) {
        console.error('Error al agregar viaje a Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al agregar horario a Firestore' });
    }
});

//Ruta para obtener el itinerario del pasajero
horarioRouter.get('/itinerarioviajespasajero/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Assuming 'viajes' is your collection name
        const viajesRef = collection(db, 'horario');
        const viajesQuery = query(viajesRef, where('usu_id', '==', userId));
        const viajesSnapshot = await getDocs(viajesQuery);

        if (viajesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const viajesData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    horario_id: doc.id, // Agregar el I
                    horario_destino: data.horario_destino || '',
                    horario_origen: data.horario_origen || '',
                    horario_hora: data.horario_hora || '',
                    horario_dia: data.horario_dia || '',
                    horario_trayecto:data.horario_trayecto || '',
                    horario_solicitud:data.horario_solicitud || '',
                    horario_status: data.horario_status || '',

                };
            });

            // Send the array of JSON objects as a response
            res.json(viajesData);
        } else {
            res.status(404).json({ error: 'No se encontraron paradas para el viaje' });
        }
    } catch (error) {
        console.error('Error al obtener documentos desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documentos desde Firestore' });
    }
});







module.exports = horarioRouter;
