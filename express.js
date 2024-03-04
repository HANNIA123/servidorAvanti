// express.js
const express = require('express');
const bodyParser = require('body-parser');  // Si lo necesitas para parsear el cuerpo de las solicitudes
const usuarioRoutes = require('./routes/usuarioRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const viajeRoutes = require('./routes/viajeRoutes');
const paradaRoutes = require('./routes/paradaRoutes');
const horarioRoutes = require('./routes/horarioRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const imprevistoRoutes = require('./routes/imprevistoRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');
const recorridoRoutes = require('./routes/recorridoRoutes');



const server = express();

// Middleware para analizar el cuerpo de la solicitud como JSON
server.use(express.json());

// Rutas
server.use('/api/usuario', usuarioRoutes);
server.use('/api/vehiculo', vehiculoRoutes);
server.use('/api/viaje', viajeRoutes);
server.use('/api/parada', paradaRoutes);
server.use('/api/horario', horarioRoutes);
server.use('/api/solicitud', solicitudRoutes);
server.use('/api/reporte', reporteRoutes);
server.use('/api/imprevisto', imprevistoRoutes);
server.use('/api/notificacion', notificacionRoutes);
server.use('/api/recorrido', recorridoRoutes);


module.exports = server;
