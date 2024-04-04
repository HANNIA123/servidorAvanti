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


horarioRouter.get('/obtenerhorario/:id', async (req, res) => {
    // const usuarioId = "hplayasr1700@alumno.ipn.mx";
    const horarioId = req.params.id;

    try {
        const viajeRef = doc(db, 'horario', horarioId);
        const viajeDoc = await getDoc(viajeRef);

        if (viajeDoc.exists()) {
            const horarioData = viajeDoc.data();

            // Enviar datos como respuesta en formato JSON
            res.json({
                horario_trayecto: horarioData.horario_trayecto || '',
                horario_dia: horarioData.horario_dia || '',
                horario_hora: horarioData.horario_hora || '',
                horario_destino: horarioData.horario_destino || '',
                horario_origen: horarioData.horario_origen || '',
                usu_id: horarioData.usu_id || '',
                horario_solicitud: horarioData.horario_solicitud || '',
                horario_status: horarioData.horario_status || ''

            });
            console.log("finalemente")
        } else {
            res.status(404).json({ error: 'El id del viaje no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }
});

//Pedneintes para Git 03/04/24
horarioRouter.get('/busquedaviajes/:id', async (req, res) => {
    const horarioId = req.params.id;
    try {
        const horarioRef = doc(db, 'horario', horarioId);
        const horarioDoc = await getDoc(horarioRef);

        //primero obtiene el horario registrado por el pasajero de acuerdo al id
        if (!horarioDoc.exists()) {
            return res.status(404).json({ error: 'El id del viaje no existe' });
        }

        const horarioData = horarioDoc.data();
        const datosHorarioUsuario = {
            horario_trayecto: horarioData.horario_trayecto || '',
            horario_dia: horarioData.horario_dia || '',
            horario_hora: horarioData.horario_hora || '',
            horario_destino: horarioData.horario_destino || '',
            horario_origen: horarioData.horario_origen || '',
            usu_id: horarioData.usu_id || '',
            horario_solicitud: horarioData.horario_solicitud || '',
        };

        const viajesRef = collection(db, 'viaje');
        const viajesQuery = query(
            viajesRef,
            where('viaje_trayecto', '==', datosHorarioUsuario.horario_trayecto),
            where('viaje_dia', '==', datosHorarioUsuario.horario_dia)
        );

        const viajesSnapshot = await getDocs(viajesQuery);

        if (viajesSnapshot.docs.length > 0) {
            const viajesData = viajesSnapshot.docs.map(doc => ({
                viaje_id: doc.id,
                ...doc.data(),
            }));

            console.log("Prueba del viaje: ", viajesData);
            res.json(viajesData);
        } else {
            console.log("no se encontro viaje")
            res.status(404).json({ error: 'No se encontro viajes para este horario' });
        }
    } catch (error) {
        console.error('Error al obtener documentos desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documentos desde Firestore' });
    }
});






module.exports = horarioRouter;
