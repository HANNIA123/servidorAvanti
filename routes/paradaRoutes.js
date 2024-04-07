// routes/vehiculoRoutes.js
const express = require('express');
const { doc, getDoc, collection, addDoc, query, where, getDocs} = require('firebase/firestore');
const db = require('../firebase');

const paradaRouter = express.Router();



paradaRouter.use(express.json());
// Ruta para registrar las paradas
paradaRouter.post('/registrarparada', async (req, res) => {
    try {
        const nuevaParada = req.body; // Asumiendo que la solicitud POST contiene los datos del nuevo usuario

        // Agrega el nuevo usuario a la colección 'usuario' en Firestore
        const paradasCollection = collection(db, 'parada');
        const docRef = await addDoc(paradasCollection, nuevaParada);

        res.json({ message: 'Parada agregado correctamente', userId: docRef.id});
        //res.json({ message: 'Usuario agregado correctamente', userId: docRef.id });
    } catch (error) {
        console.error('Error al agregar viaje a Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al agregar viaje a Firestore' });
    }
});


//Consulta para obtener una lista de paradas de acuerdo al id de un viaje

paradaRouter.get('/obtenerlistaparadas/:id', async (req, res) => {
    const viajeId = req.params.id;

    try {
        // Assuming 'viajes' is your collection name
        const paradasRef = collection(db, 'parada');
        const paradasQuery = query(paradasRef, where('viaje_id', '==', viajeId));
        const paradasSnapshot = await getDocs(paradasQuery);

        if (paradasSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const paradasData = paradasSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    par_id: doc.id, // Agregar el I
                    viaje_id: data.viaje_id || '',
                    par_hora: data.par_hora || '',
                    par_nombre: data.par_nombre || '',
                    par_ubicacion: data.par_ubicacion || '',
                    user_id: data.user_id || ''

                };
            });

            // Send the array of JSON objects as a response
            res.json(paradasData);
        } else {
            res.status(404).json({ error: 'No se encontraron paradas para el viaje' });
        }
    } catch (error) {
        console.error('Error al obtener documentos desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documentos desde Firestore' });
    }
});



//Ruta para consultar la parada, de acuerdo a su id
paradaRouter.get('/obtenerparada/:id', async (req, res) => {
    // const usuarioId = "hplayasr1700@alumno.ipn.mx";
    const paradaId = req.params.id;
    try {
        const paradaRef = doc(db, 'parada', paradaId);
        const paradaDoc = await getDoc(paradaRef);
        if (paradaDoc.exists()) {
            const data = paradaDoc.data();
            // Enviar datos como respuesta en formato JSON
            res.json({
                par_id: doc.id, // Agregar el I
                viaje_id: data.viaje_id || '',
                par_hora: data.par_hora || '',
                par_nombre: data.par_nombre || '',
                par_ubicacion: data.par_ubicacion || '',
                user_id: data.user_id || '',

            });
        } else {
            res.status(404).json({ error: 'La parada no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }
});


// Ruta para actualizar una parada específica
paradaRouter.put('/editarparada/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const datosActualizados = req.body; // Asumiendo que la solicitud PUT contiene los datos actualizados del horario

        // Actualizar parada
        const paradaCollection = collection(db, 'parada');
        await updateDoc(doc(paradaCollection, id), datosActualizados);

        res.json({ message: 'Parada actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar parada en Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar parada en Firestore'})
    }
});


paradaRouter.get('/busquedaparadas/:id', async (req, res) => {
    const listaViajeIds = req.params.id.split(',');

    try {
        // Assuming 'paradas' is your collection name
        const paradasRef = collection(db, 'parada');
        const paradasQuery = query(paradasRef, where('viaje_id', 'in', listaViajeIds));
        const paradasSnapshot = await getDocs(paradasQuery);

        if (paradasSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const paradasData = paradasSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    par_id: doc.id, // Agregar el I
                    viaje_id: data.viaje_id || '',
                    par_hora: data.par_hora || '',
                    par_nombre: data.par_nombre || '',
                    par_ubicacion: data.par_ubicacion || '',
                    user_id: data.user_id || '',
                };
            });

            // Send the array of JSON objects as a response
            res.json(paradasData);
            console.log("Prueba de parasas: ", paradasData)
        } else {
            res.status(404).json({ error: 'No se encontraron paradas para los viajes proporcionados' });
        }
    } catch (error) {
        console.error('Error al obtener documentos desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documentos desde Firestore' });
    }
});









module.exports = paradaRouter;
