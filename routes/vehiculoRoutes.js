// routes/vehiculoRoutes.js
const express = require('express');
const { doc, getDoc } = require('firebase/firestore');
const db = require('../firebase');

const vehiculoRouter = express.Router();

vehiculoRouter.get('/obtener/:id', async (req, res) => {

    // Agrega la lógica de tu ruta de vehículo aquí...
    const vehiculoId = req.params.id;

    try {
        const vehiculoRef = doc(db, 'vehículo', vehiculoId);
        const vehiculoDoc = await getDoc(vehiculoRef);

        if (vehiculoDoc.exists()) {
            const vehiculoData = vehiculoDoc.data();

            // Enviar datos como respuesta en formato JSON
            res.json({
                vehi_color: vehiculoData.vehi_color || '',
                vehi_marca: vehiculoData.vehi_marca || '',
                vehi_modelo: vehiculoData.vehi_modelo || '',
                vehi_placas: vehiculoData.vehi_placas || '',
                vehi_poliza: vehiculoData.vehi_poliza || '',

            });
        } else {
            res.status(404).json({ error: 'El usuario no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }

});

module.exports = vehiculoRouter;
