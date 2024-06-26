// routes/vehiculoRoutes.js
const express = require('express');
const {doc, getDoc, addDoc, updateDoc, collection, query, where, getDocs} = require('firebase/firestore');
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
                solicitud_id: doc.id, // Agregar el Id
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
                solicitud_viaje_iniciado: solicitudData.solicitud_viaje_iniciado || '',
                solicitud_validacion_pasajero: solicitudData.solicitud_validacion_pasajero || '',
                solicitud_validacion_conductor: solicitudData.solicitud_validacion_conductor || '',

            });
        } else {
            res.status(404).json({error: 'La solcitud no existe'});
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({error: 'Error al obtener documento desde Firestore'});
    }
});


//Ruta para obtener la solicitud de acuerdo al id del horario
solicitudRouter.get('/obtenersolicitudhorario/:id', async (req, res) => {
    const horarioId = req.params.id;
    try {
        const SolicitudRef = collection(db, 'solicitud');
        const SolicitudQuery = query(SolicitudRef,
            where('horario_id', '==', horarioId)
        );
        const SolicitudDocument = await getDocs(SolicitudQuery);
        if (SolicitudDocument.docs.length > 0) {
            const solicitudData = SolicitudDocument.docs.map(doc => {
                const data = doc.data();

                return {
                    solicitud_id: doc.id, // Agregar el Id
                    conductor_id: data.conductor_id || '',
                    horario_id: data.horario_id || '',
                    horario_trayecto: data.horario_trayecto || '',
                    parada_id: data.parada_id || '',
                    pasajero_id: data.pasajero_id || '',
                    solicitud_date: data.solicitud_date || '',
                    solicitud_status: data.solicitud_status || '',
                    viaje_id: data.viaje_id || '',
                    solicitud_activa_con: data.solicitud_activa_con || '',
                    solicitud_activa_pas: data.solicitud_activa_pas || '',
                    solicitud_viaje_iniciado: data.solicitud_viaje_iniciado || '',
                    solicitud_validacion_pasajero: data.solicitud_validacion_pasajero || '',
                    solicitud_validacion_conductor: data.solicitud_validacion_conductor || '',
                };
            });
            // Regresar únicamente el primer elemento encontrado
            res.json(solicitudData.find(solicitud => true));
        } else {
            res.status(404).json({error: 'No se encontraron solicitudes para el horario'});
        }
    } catch (error) {
        console.error('Error al obtener documentos desde Firestore:', error);
        res.status(500).json({error: 'Error al obtener documentos desde Firestore'});
    }
});


// Ruta para registrar una solicitud
solicitudRouter.post('/registrarsolicitud', async (req, res) => {
    try {
        const nuevoViaje = req.body; // Asumiendo que la solicitud POST contiene los datos del nuevo usuario

        // Agrega un viaje a la coleccion "viaje"
        const viajesCollection = collection(db, 'solicitud');
        const docRef = await addDoc(viajesCollection, nuevoViaje);
        console.log("Enviadaa")
        res.json({message: 'Solicitud agregado correctamente', userId: docRef.id});
        //res.json({ message: 'Usuario agregado correctamente', userId: docRef.id });
    } catch (error) {
        console.error('Error al agregar solicitud a Firestore:', error);
        res.status(500).json({success: false, message: 'Error al agregar solicitud a Firestore'});
    }
});

//Buscar las solcitudes de un conductor
solicitudRouter.get('/obtenersolicitudesconductor/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Assuming 'viajes' is your collection name
        const solicitudRef = collection(db, 'solicitud');
        const solicitudQuery = query(solicitudRef, where('conductor_id', '==', userId));
        const solicitudSnapshot = await getDocs(solicitudQuery);

        if (solicitudSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const solicitudData = solicitudSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    solicitud_id: doc.id, // Agregar el Id
                    conductor_id: data.conductor_id || '',
                    horario_id: data.horario_id || '',
                    horario_trayecto: data.horario_trayecto || '',
                    parada_id: data.parada_id || '',
                    pasajero_id: data.pasajero_id || '',
                    solicitud_date: data.solicitud_date || '',
                    solicitud_status: data.solicitud_status || '',
                    viaje_id: data.viaje_id || '',
                    solicitud_activa_con: data.solicitud_activa_con || '',
                    solicitud_activa_pas: data.solicitud_activa_pas || '',
                    solicitud_viaje_iniciado: data.solicitud_viaje_iniciado || '',
                    solicitud_validacion_pasajero: data.solicitud_validacion_pasajero || '',
                    solicitud_validacion_conductor: data.solicitud_validacion_conductor || '',
                };
            });

            // Send the array of JSON objects as a response
            res.json(solicitudData);
        } else {
            res.status(404).json({error: 'No se encontraron solicitudes para el conductor'});
        }
    } catch (error) {
        console.error('Error al obtener documentos desde Firestore:', error);
        res.status(500).json({error: 'Error al obtener documentos desde Firestore'});
    }
});

//Buscar las solicitudes del pasajero
solicitudRouter.get('/obtenersolicitudespasajero/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Assuming 'viajes' is your collection name
        const solicitudRef = collection(db, 'solicitud');
        const solicitudQuery = query(solicitudRef, where('pasajero_id', '==', userId));
        const solicitudSnapshot = await getDocs(solicitudQuery);

        if (solicitudSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const solicitudData = solicitudSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    solicitud_id: doc.id, // Agregar el Id
                    conductor_id: data.conductor_id || '',
                    horario_id: data.horario_id || '',
                    horario_trayecto: data.horario_trayecto || '',
                    parada_id: data.parada_id || '',
                    pasajero_id: data.pasajero_id || '',
                    solicitud_date: data.solicitud_date || '',
                    solicitud_status: data.solicitud_status || '',
                    viaje_id: data.viaje_id || '',
                    solicitud_activa_con: data.solicitud_activa_con || '',
                    solicitud_activa_pas: data.solicitud_activa_pas || '',
                };
            });

            // Send the array of JSON objects as a response
            res.json(solicitudData);
        } else {
            res.status(404).json({error: 'No se encontraron solicitudes para el conductor'});
        }
    } catch (error) {
        console.error('Error al obtener documentos desde Firestore:', error);
        res.status(500).json({error: 'Error al obtener documentos desde Firestore'});
    }
});

solicitudRouter.put('/modificarstatussolicitud/:id/:status', async (req, res) => {
    const paradaId = req.params.id;
    const nuevoStatus = req.params.status;

    try {
        const paradaRef = doc(db, 'solicitud', paradaId);
        const paradaDoc = await getDoc(paradaRef);

        if (paradaDoc.exists()) {
            // Modificar solo el campo status de la parada
            await updateDoc(paradaRef, {solicitud_status: nuevoStatus});
            console.log("Solicitud en status ")
            res.json({message: 'Estado de la solicitud modificado correctamente'});
        } else {
            console.log("Solicitud en no modif ")
            res.status(404).json({error: 'La parada no existe'});
        }
    } catch (error) {
        console.error('Error al modificar el estado de la solicitud en Firestore:', error);
        res.status(500).json({error: 'Error al modificar el estado de la parada en Firestore'});
    }
});


//Obtener los datos de TODAS las solcitud que coincidan con un viaje
//31/12/2023
solicitudRouter.get('/solicitudesbyviaje/:id/:status', async (req, res) => {
    const viajeId = req.params.id;
    const status = req.params.status;

    try {
        const viajesRef = collection(db, 'solicitud');
        const viajesQuery = query(viajesRef,
            where('viaje_id', '==', viajeId), where('solicitud_status', '==', status)
        );
        const viajesSnapshot = await getDocs(viajesQuery);


        if (viajesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const viajesData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    solicitud_id: doc.id, // Agregar el Id
                    conductor_id: data.conductor_id || '',
                    horario_id: data.horario_id || '',
                    horario_trayecto: data.horario_trayecto || '',
                    parada_id: data.parada_id || '',
                    pasajero_id: data.pasajero_id || '',
                    solicitud_date: data.solicitud_date || '',
                    solicitud_status: data.solicitud_status || '',
                    viaje_id: data.viaje_id || '',
                    solicitud_activa_con: data.solicitud_activa_con || '',
                    solicitud_activa_pas: data.solicitud_activa_pas || '',
                    solicitud_viaje_iniciado: data.solicitud_viaje_iniciado || '',

                    solicitud_validacion_pasajero: data.solicitud_validacion_pasajero || '',
                    solicitud_validacion_conductor: data.solicitud_validacion_conductor || '',

                };
            });
            console.log("solicitudes!! ")
            res.json(viajesData);
        } else {
            res.status(404).json({error: 'No se encontraron solicitudes para el viaje'});
        }
    } catch (error) {
        console.error('Error al obtener documentos desde Firestore:', error);
        res.status(500).json({error: 'Error al obtener documentos desde Firestore'});
    }
});


solicitudRouter.get('/solicitudesbyhorario/:id/:status', async (req, res) => {
    const solicitudId = req.params.id;
    const status = req.params.status;

    try {
        const SolicitudRef = collection(db, 'solicitud');
        const SolicitudQuery = query(SolicitudRef,
            where('horario_id', '==', solicitudId), where('solicitud_status', '==', status)
        );
        const SolicitudesSnapshot = await getDocs(SolicitudQuery);


        if (SolicitudesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const solicitudData = SolicitudesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    solicitud_id: doc.id, // Agregar el Id
                    conductor_id: data.conductor_id || '',
                    horario_id: data.horario_id || '',
                    horario_trayecto: data.horario_trayecto || '',
                    parada_id: data.parada_id || '',
                    pasajero_id: data.pasajero_id || '',
                    solicitud_date: data.solicitud_date || '',
                    solicitud_status: data.solicitud_status || '',
                    viaje_id: data.viaje_id || '',
                    solicitud_activa_con: data.solicitud_activa_con || '',
                    solicitud_activa_pas: data.solicitud_activa_pas || '',
                    solicitud_viaje_iniciado: data.solicitud_viaje_iniciado || '',

                    solicitud_validacion_pasajero: data.solicitud_validacion_pasajero || '',
                    solicitud_validacion_conductor: data.solicitud_validacion_conductor || '',

                };
            });

            res.json(solicitudData);
        } else {
            res.status(404).json({error: 'No se encontraron solicitudes para el viaje'});
        }
    } catch (error) {
        console.error('Error al obtener documentos desde Firestore:', error);
        res.status(500).json({error: 'Error al obtener documentos desde Firestore'});
    }
});

module.exports = solicitudRouter;
