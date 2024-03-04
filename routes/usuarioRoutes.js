// routes/usuarioRoutes.js
const express = require('express');
const { doc, getDoc } = require('firebase/firestore');
const db = require('../firebase');

const usuarioRouter = express.Router();

usuarioRouter.get('/obtener/:id', async (req, res) => {
    // const usuarioId = "hplayasr1700@alumno.ipn.mx";
    const usuarioId = req.params.id;
    try {
        const usuarioRef = doc(db, 'usuario', usuarioId);
        const usuarioDoc = await getDoc(usuarioRef);
        if (usuarioDoc.exists()) {
            const usuarioData = usuarioDoc.data();
            // Enviar datos como respuesta en formato JSON
            res.json({
                usu_boleta: usuarioData.usu_boleta || '',
                usu_foto: usuarioData.usu_foto || '',
                usu_nombre: usuarioData.usu_nombre || '',
                usu_nombre_usuario: usuarioData.usu_nombre_usuario || '',
                usu_primer_apellido: usuarioData.usu_primer_apellido || '',
                usu_segundo_apellido: usuarioData.usu_segundo_apellido || '',
                usu_status: usuarioData.usu_status || '',
                usu_telefono: usuarioData.usu_telefono || '',
                usu_tipo: usuarioData.usu_tipo || '',
                usu_token:usuarioData.usu_token || '',
            });
        } else {
            res.status(404).json({ error: 'El usuario no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }

});



module.exports = usuarioRouter;
