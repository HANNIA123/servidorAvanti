const express = require('express');
const { doc, getDoc, collection, query, where, getDocs} = require('firebase/firestore');
const db = require('../firebase');

const reporteRouter = express.Router();
//REGISTRAR REPORTES
reporteRouter.use(express.json());
reporteRouter.post('/registrarreporte', async (req, res) => {
    try {
        const reporte = req.body; // Asumiendo que la solicitud POST contiene los datos del nuevo usuario

        // Agrega un viaje a la coleccion "viaje"
        const reporteCollection = collection(db, 'reporte');
        const docRef = await addDoc(reporteCollection, reporte);

        res.json({ message: 'Reporte agregado correctamente', userId: docRef.id});

    } catch (error) {
        console.error('Error al agregar reporte a Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al agregar reporte a Firestore' });
    }
});



module.exports = reporteRouter;

