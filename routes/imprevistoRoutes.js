// routes/vehiculoRoutes.js
const express = require('express');
const { doc, getDoc } = require('firebase/firestore');
const db = require('../firebase');

const imprevistoRouter = express.Router();
//REGISTRAR IMPREVISTO
imprevistoRouter.use(express.json());
imprevistoRouter.post('/registrarimprevisto', async (req, res) => {
    try {
        const imprevisto = req.body; // Asumiendo que la solicitud POST contiene los datos del nuevo usuario

        // Agrega un viaje a la coleccion "viaje"
        const imprevistoCollection = collection(db, 'imprevisto');
        const docRef = await addDoc(imprevistoCollection, imprevisto);

        res.json({ message: 'Imprevisto agregado correctamente', userId: docRef.id});

    } catch (error) {
        console.error('Error al agregar el imprevisto a Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al agregar el imprevisto a Firestore'});
    }
});
module.exports = imprevistoRouter;
