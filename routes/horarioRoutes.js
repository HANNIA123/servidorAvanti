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

        res.json({ message: 'viaje agregado correctamente', horarioId: docRef.id});
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
                    horario_iniciado: data.horario_iniciado || ''

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
                horario_status: horarioData.horario_status || '',
                horario_iniciado: horarioData.horario_iniciado || ''

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





//Agregado 10/12/2023 -- obtener los viajes para el pasajero --horario!
horarioRouter.get('/busquedaviajes/:id', async (req, res) => {
    const horarioId = req.params.id;
    console.log(horarioId)
    try {
        const horarioRef = doc(db, 'horario', horarioId);
        const horarioDoc = await getDoc(horarioRef);
        if (horarioDoc.exists()) {
            const horarioData = horarioDoc.data();
            // Guardar los datos en una variable
            const DatosHorario = {
                horario_trayecto: horarioData.horario_trayecto || '',
                horario_dia: horarioData.horario_dia || '',
                horario_hora: horarioData.horario_hora || '',
                horario_destino: horarioData.horario_destino || '',
                horario_origen: horarioData.horario_origen || '',
                usu_id: horarioData.usu_id || '',
                horario_solicitud:  horarioData.horario_solicitud || '',
                horario_iniciado: horarioData.horario_iniciado || ''
            };
            console.log(DatosHorario)
            try {
                // Assuming 'viajes' is your collection name
                let horarioComparar
                if (DatosHorario.horario_trayecto==='0'){
                    horarioComparar='viaje_hora_partida'
                }
                else{
                    horarioComparar='viaje_hora_llegada'

                }
                const viajesRef = collection(db, 'viaje');
                const viajesQuery = query(viajesRef, where('viaje_trayecto', '==',
                        DatosHorario.horario_trayecto),
                    //where(horarioComparar, '==', DatosHorario.horario_hora),
                    where('viaje_dia', '==', DatosHorario.horario_dia),
                );
                const viajesSnapshot = await getDocs(viajesQuery);

                if (viajesSnapshot.docs.length > 0) {
                    // Map the documents to an array of JSON objects
                    const viajesData = viajesSnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            viaje_id: doc.id, // Agregar el Id
                            viaje_destino: data.viaje_destino || '',
                            viaje_origen: data.viaje_origen || '',
                            viaje_hora_llegada: data.viaje_hora_llegada || '',
                            viaje_hora_partida: data.viaje_hora_partida || '',
                            viaje_dia: data.viaje_dia || '',
                            viaje_trayecto: data.viaje_trayecto || '',
                            viaje_num_lugares: data.viaje_num_lugares || '',
                            viaje_status: data.viaje_status || '',
                            viaje_paradas: data.viaje_paradas || '',
                            viaje_iniciado: data.viaje_iniciado || '',
                            usu_id: data.usu_id || '',


                        };
                    });

                    // Send the array of JSON objects as a response
                    console.log("Prueba del viaje: ", viajesData)
                    res.json(viajesData);
                } else {

                    res.status(404).json({ error: 'No se encontraron paradas para el viaje' });
                }
            } catch (error) {
                console.error('Error al obtener documentos desde Firestore:', error);
                res.status(500).json({ error: 'Error al obtener documentos desde Firestore' });
            }


        } else {
            res.status(404).json({ error: 'El id del viaje no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }





});




horarioRouter.put('/modificarsolicitudhorario/:id/:status', async (req, res) => {
    const horarioId = req.params.id;
    const nuevoStatus = req.params.status;

    try {
        const paradaRef = doc(db, 'horario', horarioId);
        const paradaDoc = await getDoc(paradaRef);

        if (paradaDoc.exists()) {
            // Modificar solo el campo status de la parada
            await updateDoc(paradaRef, { horario_solicitud: nuevoStatus });
            console.log("Solicitud en horario modificada ")
            res.json({ message: 'Estado de la solicitud modificado correctamente' });
        } else {
            res.status(404).json({ error: 'El horario no existe' });
        }
    } catch (error) {
        console.error('Error al modificar el estado de la solicitud en Firestore:', error);
        res.status(500).json({ error: 'Error al modificar el estado de la solicitud en Firestore' });
    }
});

horarioRouter.put('/actualizarstatus/:id/:status', async (req, res) => {
    const horarioId = req.params.id;
    const nuevoStatus = req.params.status;
    console.log("id horario ", horarioId)

    try {
        const horarioRef = doc(db, 'horario', horarioId);
        // Actualizar el campo 'viaje_status' del documento del viaje

        await updateDoc(horarioRef, {
            horario_status: nuevoStatus
        });

        // Obtener el campo 'viaje_paradas' de la base de datos
        const horarioDoc = await getDoc(horarioRef);
        const horarioData = horarioDoc.data();
        //const viajeParadas = horarioData.viaje_paradas;

        res.status(200).json({
            message: 'Campo horario_status actualizado correctamente',
            //viaje_paradas: viajeParadas
        });
    } catch (error) {
        console.error('Error al actualizar campo horario_status:', error);
        res.status(500).json({ error: 'Error al actualizar campo horario_status' });
    }
});




module.exports = horarioRouter;
