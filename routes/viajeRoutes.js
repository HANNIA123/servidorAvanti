// routes/viajeRoutes.js
const express = require('express');
const {doc, getDoc, collection, addDoc,
    getDocs,updateDoc, query, where} = require('firebase/firestore');
const db = require('../firebase');


const viajeRouter = express.Router();
//Para el pasajero 10/12/2023
viajeRouter.use(express.json());

// Ruta para registrar un viaje- Conductor-- Agregado 13/03/2024
viajeRouter.post('/registrarviaje', async (req, res) => {
    try {
        const nuevoViaje = req.body; // Asumiendo que la solicitud POST contiene los datos del nuevo usuario

        // Agrega un viaje a la coleccion "viaje"
        const viajesCollection = collection(db, 'viaje');
        const docRef = await addDoc(viajesCollection, nuevoViaje);

        res.json({message: 'Viaje agregado correctamente', viajeId: docRef.id});
        //res.json({ message: 'Usuario agregado correctamente', userId: docRef.id });
    } catch (error) {
        console.error('Error al agregar viaje a Firestore:', error);
        res.status(500).json({success: false, message: 'Error al agregar viaje a Firestore'});
    }
});



//Ruta para consultar una coleccion teniendo el id
viajeRouter.get('/obtenerviaje/:id', async (req, res) => {
    // const usuarioId = "hplayasr1700@alumno.ipn.mx";
    const viajeId = req.params.id;

    try {
        const viajeRef = doc(db, 'viaje', viajeId);
        const viajeDoc = await getDoc(viajeRef);

        if (viajeDoc.exists()) {
            const viajeData = viajeDoc.data();

            // Enviar datos como respuesta en formato JSON
            res.json({
                viaje_id: viajeData.viaje_id || '',
                usu_id: viajeData.usu_id || '',
                viaje_destino: viajeData.viaje_destino || '',
                viaje_origen: viajeData.viaje_origen || '',
                viaje_hora_llegada: viajeData.viaje_hora_llegada || '',
                viaje_hora_partida: viajeData.viaje_hora_partida || '',
                viaje_dia: viajeData.viaje_dia || '',
                viaje_trayecto: viajeData.viaje_trayecto || '',
                viaje_status: viajeData.viaje_status || '',
                viaje_num_lugares: viajeData.viaje_num_lugares || '',
                viaje_paradas: viajeData.viaje_paradas || '',
                viaje_iniciado: viajeData.viaje_iniciado || '',
                viaje_num_pasajeros: viajeData.viaje_num_pasajeros || '',
                viaje_num_pasajeros_con: viajeData.viaje_num_pasajeros_con || '',
                viaje_tarifa: viajeData.viaje_tarifa || ''




            });
        } else {
            res.status(404).json({error: 'El id del viaje no existe'});
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({error: 'Error al obtener documento desde Firestore'});
    }
});



// Obtener todos los viajes de un conductor con el id del conductor
viajeRouter.get('/itinerarioviajes/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Assuming 'viajes' is your collection name
        const viajesRef = collection(db, 'viaje');
        const viajesQuery = query(viajesRef, where('usu_id', '==', userId));
        const viajesSnapshot = await getDocs(viajesQuery);

        if (viajesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const viajesData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    viaje_id: doc.id, // Agregar el I
                    viaje_destino: data.viaje_destino || '',
                    viaje_origen: data.viaje_origen || '',
                    viaje_hora_llegada: data.viaje_hora_llegada || '',
                    viaje_hora_partida: data.viaje_hora_partida || '',
                    viaje_dia: data.viaje_dia || '',
                    viaje_trayecto:data.viaje_trayecto || '',
                    viaje_status: data.viaje_status || '',
                    viaje_num_lugares: data.viaje_num_lugares || '',
                    viaje_paradas: data.viaje_paradas|| '',
                    viaje_iniciado: data.viaje_iniciado || '',
                    viaje_num_pasajeros: data.viaje_num_pasajeros || '',
                    viaje_num_pasajeros_con: data.viaje_num_pasajeros_con || '',
                    

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
viajeRouter.put('/actualizarstatus/:id/:status', async (req, res) => {
    const viajeId = req.params.id;
    const nuevoStatus = req.params.status;
    console.log("id viaje ", viajeId)

    try {
        const viajeRef = doc(db, 'viaje', viajeId);
        // Actualizar el campo 'viaje_status' del documento del viaje

        await updateDoc(viajeRef, {
            viaje_status: nuevoStatus
        });

        // Obtener el campo 'viaje_paradas' de la base de datos
        const viajeDoc = await getDoc(viajeRef);
        const viajeData = viajeDoc.data();
        const viajeParadas = viajeData.viaje_paradas;

        res.status(200).json({
            message: 'Campo viaje_status actualizado correctamente',
            viaje_paradas: viajeParadas
        });
    } catch (error) {
        console.error('Error al actualizar campo viaje_status:', error);
        res.status(500).json({ error: 'Error al actualizar campo viaje_status' });
    }
});

// Ruta para actualizar un viaje específico
viajeRouter.put('/editarviaje/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const datosActualizados = req.body; // Asumiendo que la solicitud PUT contiene los datos actualizados del horario

        // Actualiza el viaje en la colección "viaje"
        const horariosCollection = collection(db, 'viaje');
        await updateDoc(doc(horariosCollection, id), datosActualizados);

        res.json({ message: 'Viaje actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar viaje en Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar horario en Firestore'})
    }
});



module.exports = viajeRouter;
