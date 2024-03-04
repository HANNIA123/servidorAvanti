const express = require('express');
const app = express();
const PORT = 3000;

// Ruta de ejemplo
app.get('/api/mensaje', (req, res) => {
    res.json({ mensaje: '¡Hola desde tu API de Node.js!' });
});

app.listen(PORT, () => {
    console.log(`Servidor Node.js escuchando en http://localhost:${PORT}`);
});




