// routes/vehiculoRoutes.js
const express = require('express');
const { doc, getDoc, collection, setDoc} = require('firebase/firestore');
const db = require('../firebase');

const recorridoRouter = express.Router();


//Registra la ubicacion actual del viaje en progreso

recorridoRouter.use(express.json());
recorridoRouter.post('/registrarecorrido', async (req, res) => {
    try {
        const recorrido = req.body;

        // Obtén el ID del recorrido basado en recorrido_id_viaje
        const recorridoIdViaje = recorrido.recorrido_id_viaje;

        // Agrega un viaje a la colección "recorrido" o reemplázalo si ya existe
        const recorridoCollection = collection(db, 'recorrido');
        const docRef = doc(recorridoCollection, recorridoIdViaje);

        await setDoc(docRef, recorrido, { merge: true }); // Utiliza merge: true para reemplazar o combinar campos existentes

        res.json({ message: 'Recorrido agregado o actualizado correctamente', recorridoId: recorridoIdViaje });

    } catch (error) {
        console.error('Error al agregar o actualizar el recorrido en Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al agregar o actualizar el recorrido en Firestore' });
    }
});

//Obtener el recorrido, teniendo el id del viaje
recorridoRouter.get('/consultarecorrido/:id', async (req, res) => {

    const viajeId = req.params.id;
    console.log("Viaje Id_ ", viajeId)

    try {

        const recorridoRef = collection(db, 'recorrido');
        const recorridoQuery = query(recorridoRef, where('recorrido_id_viaje', '==', viajeId));
        const recorridoSnapshot = await getDocs(recorridoQuery);

        if (recorridoSnapshot.docs.length > 0) {
            // Extraer el primer elemento del array resultante
            const data = recorridoSnapshot.docs[0].data();

            // Crear el objeto JSON con las propiedades requeridas
            const recorridoData = {
                recorrido_ubicacion_con: data.recorrido_ubicacion_con || '',
                recorrido_id_viaje: data.recorrido_id_viaje || '',
                recorrido_id_parada: data.recorrido_id_parada || '',
                recorrido_num_parada: data.recorrido_num_parada || '',
                recorrido_total_parada: data.recorrido_id_parada || '',
                recorrido_id_pasajero: data.recorrido_id_pasajero || '',
                recorrido_id_conductor: data.recorrido_id_conductor || '',
                recorrido_hora_actualizada: data.recorrido_hora_actualizada || '',
                recorrido_fecha_actualizada: data.recorrido_fecha_actualizada || '',
            };

            // Enviar el objeto JSON como respuesta
            res.json(recorridoData);
        } else {
            res.status(404).json({ error: 'No se encontraron paradas para el viaje' });
        }
    } catch (error) {
        console.error('Error al obtener documentos desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documentos desde Firestore' });
    }

});


module.exports = recorridoRouter;
