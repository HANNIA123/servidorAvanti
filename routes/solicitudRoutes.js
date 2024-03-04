// routes/vehiculoRoutes.js
const express = require('express');
const { doc, getDoc, collection, query, where, getDocs} = require('firebase/firestore');
const db = require('../firebase');

const solicitudRouter = express.Router();

// Middleware para analizar el cuerpo de la solicitud como JSON
solicitudRouter.use(express.json());
//Obtener datos de la solcitud teniendo su id 04/01/202 no server
solicitudRouter.get('/api/obtenersolicitud/:id', async (req, res) => {

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




// Ruta para registrar un viaje
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

//Buscar solicitudes que coincida con un pasajero, de acuerdo a su id del viaje y que sea "Aceptada"
//17/12/2023

solicitudRouter.get('/consultasolicitudes/:iduser/:idhorario/:status', async (req, res) => {
    const horarioId = req.params.idhorario;
    const status = req.params.status;
    const userId = req.params.iduser;

    console.log("Que llega", horarioId, status, userId)
    try {
        // Assuming 'viajes' is your collection name
        const viajesRef = collection(db, 'solicitud');
        const viajesQuery = query(viajesRef, where('pasajero_id', '==', userId),
            where('horario_id', '==', horarioId),  where('solicitud_status', '==', status)
        );
        const viajesSnapshot = await getDocs(viajesQuery);


        if (viajesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const viajesData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {

                    solicitud_id:     doc.id, // Agregar el Id
                    conductor_id: data.conductor_id || '',
                    horario_id: data.horario_id || '',
                    horario_trayecto: data.horario_trayecto || '',
                    parada_id: data.parada_id || '',
                    pasajero_id:data.pasajero_id || '',
                    solicitud_date:data.solicitud_date || '',
                    solicitud_status:data.solicitud_status || '',
                    viaje_id:data.viaje_id || '',
                    solicitud_activa_con:data.solicitud_activa_con || '',
                    solicitud_activa_pas:data.solicitud_activa_pas || '',

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

//Agregado 09/01/2023
//Obtiene las solciitud que coincidan con un id de viaje y es confirmada
solicitudRouter.get('/solciitudesconfirmadascon/:id', async (req, res) => {
    const viajeId = req.params.id;

    try {
        const viajesRef = collection(db, 'solicitud', viajeId);
        const viajesQuery = query(viajesRef,where('solicitud_status', '==', "Aceptada"));
        const viajesSnapshot = await getDocs(viajesQuery);

        if (viajesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const viajesData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    solicitud_id:     doc.id, // Agregar el Id
                    conductor_id: data.conductor_id || '',
                    horario_id: data.horario_id || '',
                    horario_trayecto: data.horario_trayecto || '',
                    parada_id: data.parada_id || '',
                    pasajero_id:data.pasajero_id || '',
                    solicitud_date:data.solicitud_date || '',
                    solicitud_status:data.solicitud_status || '',
                    viaje_id:data.viaje_id || '',
                    solicitud_activa_con:data.solicitud_activa_con || '',
                    solicitud_activa_pas:data.solicitud_activa_pas || '',
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
//Obtener los datos de TODAS las solcitud que coincidan con un viaje
//31/12/2023
solicitudRouter.get('/consultasolicitudesbyviaje/:idviaje/:status', async (req, res) => {
    const viajeId = req.params.idviaje;
    const status = req.params.status;


    try {
        // Assuming 'viajes' is your collection name
        const viajesRef = collection(db, 'solicitud');
        const viajesQuery = query(viajesRef,
            where('viaje_id', '==', viajeId),  where('solicitud_status', '==', status)
        );
        const viajesSnapshot = await getDocs(viajesQuery);


        if (viajesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const viajesData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {

                    solicitud_id:     doc.id, // Agregar el Id
                    conductor_id: data.conductor_id || '',
                    horario_id: data.horario_id || '',
                    horario_trayecto: data.horario_trayecto || '',
                    parada_id: data.parada_id || '',
                    pasajero_id:data.pasajero_id || '',
                    solicitud_date:data.solicitud_date || '',
                    solicitud_status:data.solicitud_status || '',
                    viaje_id:data.viaje_id || '',
                    solicitud_activa_con:data.solicitud_activa_con || '',
                    solicitud_activa_pas:data.solicitud_activa_pas || '',

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


//---------------Agregados despues de subir al git Hannia-----------------------
//Obtener los datos de la solicitu de acuerdo con un id de parada
solicitudRouter.get('/solicitudesparada/:id', async (req, res) => {
    const paradaId = req.params.id;

    try {
        // Assuming 'viajes' is your collection name
        const viajesRef = collection(db, 'solicitud');
        const viajesQuery = query(viajesRef, where('parada_id', '==', paradaId));
        const viajesSnapshot = await getDocs(viajesQuery);

        if (viajesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const viajesData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    solicitud_id:     doc.id, // Agregar el Id
                    conductor_id: data.conductor_id || '',
                    horario_id: data.horario_id || '',
                    horario_trayecto: data.horario_trayecto || '',
                    parada_id: data.parada_id || '',
                    pasajero_id:data.pasajero_id || '',
                    solicitud_date:data.solicitud_date || '',
                    solicitud_status:data.solicitud_status || '',
                    viaje_id:data.viaje_id || '',
                    solicitud_activa_con:data.solicitud_activa_con || '',
                    solicitud_activa_pas:data.solicitud_activa_pas || '',
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


//Aceptar
// Ruta para modificar el status de una parada
solicitudRouter.put('/modificarstatussolicitud/:id/:status', async (req, res) => {
    const paradaId = req.params.id;
    const nuevoStatus = req.params.status;

    try {
        const paradaRef = doc(db, 'solicitud', paradaId);
        const paradaDoc = await getDoc(paradaRef);

        if (paradaDoc.exists()) {
            // Modificar solo el campo status de la parada
            await updateDoc(paradaRef, { solicitud_status: nuevoStatus });
            console.log("Solicitud modificada ")
            res.json({ message: 'Estado de la parada modificado correctamente' });
        } else {
            res.status(404).json({ error: 'La parada no existe' });
        }
    } catch (error) {
        console.error('Error al modificar el estado de la parada en Firestore:', error);
        res.status(500).json({ error: 'Error al modificar el estado de la parada en Firestore' });
    }
});


//Buscar el id en solicitudes 15/12/2023
solicitudRouter.get('/solicitudespasajero/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Assuming 'viajes' is your collection name
        const viajesRef = collection(db, 'solicitud');
        const viajesQuery = query(viajesRef, where('pasajero_id', '==', userId));
        const viajesSnapshot = await getDocs(viajesQuery);

        if (viajesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const viajesData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    solicitud_id:     doc.id, // Agregar el Id
                    conductor_id: data.conductor_id || '',
                    horario_id: data.horario_id || '',
                    horario_trayecto: data.horario_trayecto || '',
                    parada_id: data.parada_id || '',
                    pasajero_id:data.pasajero_id || '',
                    solicitud_date:data.solicitud_date || '',
                    solicitud_status:data.solicitud_status || '',
                    viaje_id:data.viaje_id || '',
                    solicitud_activa_con:data.solicitud_activa_con || '',
                    solicitud_activa_pas:data.solicitud_activa_pas || '',
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


//Buscar el id en solicitudes 15/12/2023
solicitudRouter.get('/solicitudesconductor/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Assuming 'viajes' is your collection name
        const viajesRef = collection(db, 'solicitud');
        const viajesQuery = query(viajesRef, where('conductor_id', '==', userId));
        const viajesSnapshot = await getDocs(viajesQuery);

        if (viajesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const viajesData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    solicitud_id:     doc.id, // Agregar el Id
                    conductor_id: data.conductor_id || '',
                    horario_id: data.horario_id || '',
                    horario_trayecto: data.horario_trayecto || '',
                    parada_id: data.parada_id || '',
                    pasajero_id:data.pasajero_id || '',
                    solicitud_date:data.solicitud_date || '',
                    solicitud_status:data.solicitud_status || '',
                    viaje_id:data.viaje_id || '',
                    solicitud_activa_con:data.solicitud_activa_con || '',
                    solicitud_activa_pas:data.solicitud_activa_pas || '',
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






module.exports = solicitudRouter;
