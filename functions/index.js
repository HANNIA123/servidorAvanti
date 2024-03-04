const functions = require("firebase-functions");
const express = require('express');
const { initializeApp } = require('@firebase/app');
//const { getFirestore, collection, doc, getDoc, updateDoc,addDoc, getDocs,deleteDoc, where, query } = require('@firebase/firestore');
const { getFirestore, collection, doc, getDoc, updateDoc,setDoc, addDoc, getDocs,deleteDoc, where, query } = require('@firebase/firestore');

const firebaseConfig = {
    // Tu configuración de Firebase aquí
    apiKey: "AIzaSyDSb9KMlW3DDNFtuIytiz3NEqVy8R7yBTE",
    authDomain: "avanti-c4ba7.firebaseapp.com",
    projectId: "avanti-c4ba7",
    storageBucket: "avanti-c4ba7.appspot.com",
    messagingSenderId: "361833868381",
    appId: "1:361833868381:web:7e6d65d13283ef957031b4",
    measurementId: "G-F9QSKG795F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const server = express();
const port = 3000;

//Ruta para consultar una coleccion teniendo el id
server.get('/api/usuario/:id', async (req, res) => {
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
            });
        } else {
            res.status(404).json({ error: 'El usuario no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }
});

//Ruta para consultar una coleccion teniendo el id
server.get('/api/vehiculo/:id', async (req, res) => {

    const usuarioId = req.params.id;

    try {
        const usuarioRef = doc(db, 'vehículo', usuarioId);
        const usuarioDoc = await getDoc(usuarioRef);

        if (usuarioDoc.exists()) {
            const vehiculoData = usuarioDoc.data();

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



//Agregado 22/11/2023 -Hannia -ya
// Middleware para analizar el cuerpo de la solicitud como JSON
server.use(express.json());
// Ruta para registrar un viaje
server.post('/api/registrarviaje', async (req, res) => {
    try {
        const nuevoViaje = req.body; // Asumiendo que la solicitud POST contiene los datos del nuevo usuario

        // Agrega un viaje a la coleccion "viaje"
        const viajesCollection = collection(db, 'viaje');
        const docRef = await addDoc(viajesCollection, nuevoViaje);

        res.json({ message: 'Viaje agregado correctamente', userId: docRef.id});
        //res.json({ message: 'Usuario agregado correctamente', userId: docRef.id });
    } catch (error) {
        console.error('Error al agregar viaje a Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al agregar viaje a Firestore' });
    }
});

//Para el pasajero 10/12/2023
server.use(express.json());
// Ruta para registrar un viaje
server.post('/api/registrarhorario', async (req, res) => {
    try {
        const nuevoViaje = req.body; // Asumiendo que la solicitud POST contiene los datos del nuevo usuario

        // Agrega un viaje a la coleccion "viaje"
        const viajesCollection = collection(db, 'horario');
        const docRef = await addDoc(viajesCollection, nuevoViaje);

        res.json({ message: 'viaje agregado correctamente', userId: docRef.id});
        //res.json({ message: 'Usuario agregado correctamente', userId: docRef.id });
    } catch (error) {
        console.error('Error al agregar viaje a Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al agregar horario a Firestore' });
    }
});


//Agregado 22/11/2023 -Hannia
// Middleware para analizar el cuerpo de la solicitud como JSON
server.use(express.json());
// Ruta para registrar las paradas
server.post('/api/registrarparada', async (req, res) => {
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

//Agregado 02/12/2023 -- modificado 10/12/2023 -ya

//Ruta para consultar una coleccion teniendo el id
server.get('/api/viaje/:id', async (req, res) => {
    // const usuarioId = "hplayasr1700@alumno.ipn.mx";
    const viajeId = req.params.id;

    try {
        const viajeRef = doc(db, 'viaje', viajeId);
        const viajeDoc = await getDoc(viajeRef);

        if (viajeDoc.exists()) {
            const viajeData = viajeDoc.data();

            // Enviar datos como respuesta en formato JSON
            res.json({
                viaje_id:viajeData.viaje_id || '',
                usu_id: viajeData.usu_id || '',
                viaje_destino: viajeData.viaje_destino || '',
                viaje_origen: viajeData.viaje_origen || '',
                viaje_hora_llegada: viajeData.viaje_hora_llegada || '',
                viaje_hora_partida: viajeData.viaje_hora_partida || '',
                viaje_dia: viajeData.viaje_dia || '',
                viaje_trayecto: viajeData.viaje_trayecto || '',
                viaje_status: viajeData.viaje_status || '',
                viaje_num_lugares: viajeData.viaje_num_lugares || '',
                viaje_paradas: viajeData.viaje_paradas || '',
                viaje_iniciado: viajeData.viaje_iniciado || '',

            });
        } else {
            res.status(404).json({ error: 'El id del viaje no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }
});





//02/12/2023
server.get('/api/paradas/:id', async (req, res) => {
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



//02/12/2023 Obtener todos los viajes de un conductor -yaa
server.get('/api/itinerarioviajes/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Assuming 'viajes' is your collection name
        const viajesRef = collection(db, 'viaje');
        const viajesQuery = query(viajesRef, where('usu_id', '==', userId));
        const viajesSnapshot = await getDocs(viajesQuery);

        if (viajesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const viajesData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    viaje_id: doc.id, // Agregar el I
                    viaje_destino: data.viaje_destino || '',
                    viaje_origen: data.viaje_origen || '',
                    viaje_hora_llegada: data.viaje_hora_llegada || '',
                    viaje_hora_partida: data.viaje_hora_partida || '',
                    viaje_dia: data.viaje_dia || '',
                    viaje_trayecto:data.viaje_trayecto || '',
                    viaje_status: data.viaje_status || '',
                    viaje_num_lugares: data.viaje_num_lugares || '',
                    viaje_paradas: data.viaje_paradas|| '',
                    viaje_iniciado: data.viaje_iniciado || '',


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


//Agregado 10/12/2023 -- obtener los viajes para el pasajero --horario!
server.get('/api/busquedaviajes/:id', async (req, res) => {
    const horarioId = req.params.id;
    console.log(horarioId)
    try {
        const horarioRef = doc(db, 'horario', horarioId);
        const horarioDoc = await getDoc(horarioRef);
        if (horarioDoc.exists()) {
            const horarioData = horarioDoc.data();
            // Guardar los datos en una variable
            const DatosHorario = {
                horario_trayecto: horarioData.horario_trayecto || '',
                horario_dia: horarioData.horario_dia || '',
                horario_hora: horarioData.horario_hora || '',
                horario_destino: horarioData.horario_destino || '',
                horario_origen: horarioData.horario_origen || '',
                usu_id: horarioData.usu_id || '',
                horario_solicitud:  horarioData.horario_solicitud || '',
            };
            console.log(DatosHorario)
            try {
                // Assuming 'viajes' is your collection name
                let horarioComparar
                if (DatosHorario.horario_trayecto==='0'){
                    horarioComparar='viaje_hora_partida'
                }
                else{
                    horarioComparar='viaje_hora_llegada'

                }
                const viajesRef = collection(db, 'viaje');
                const viajesQuery = query(viajesRef, where('viaje_trayecto', '==',
                        DatosHorario.horario_trayecto),
                    //where(horarioComparar, '==', DatosHorario.horario_hora),
                    where('viaje_dia', '==', DatosHorario.horario_dia),
                );
                const viajesSnapshot = await getDocs(viajesQuery);

                if (viajesSnapshot.docs.length > 0) {
                    // Map the documents to an array of JSON objects
                    const viajesData = viajesSnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            viaje_id: doc.id, // Agregar el Id
                            viaje_destino: data.viaje_destino || '',
                            viaje_origen: data.viaje_origen || '',
                            viaje_hora_llegada: data.viaje_hora_llegada || '',
                            viaje_hora_partida: data.viaje_hora_partida || '',
                            viaje_dia: data.viaje_dia || '',
                            viaje_trayecto: data.viaje_trayecto || '',
                            viaje_num_lugares: data.viaje_num_lugares || '',
                            viaje_status: data.viaje_status || '',
                            viaje_paradas: data.viaje_paradas || '',
                            viaje_iniciado: data.viaje_iniciado || '',
                            usu_id: data.usu_id || '',

                        };
                    });

                    // Send the array of JSON objects as a response
                    console.log("Prueba del viaje: ", viajesData)
                    res.json(viajesData);
                } else {

                    res.status(404).json({ error: 'No se encontraron paradas para el viaje' });
                }
            } catch (error) {
                console.error('Error al obtener documentos desde Firestore:', error);
                res.status(500).json({ error: 'Error al obtener documentos desde Firestore' });
            }


        } else {
            res.status(404).json({ error: 'El id del viaje no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }





});


//Para buscar paradas que coincidan con un viaje del pasajero 10/12/2023
server.get('/api/busquedaparadas/:id', async (req, res) => {
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



//Obtener datos del horario del pasajero
//Ruta para consultar una coleccion teniendo el id
server.get('/api/horario/:id', async (req, res) => {
    // const usuarioId = "hplayasr1700@alumno.ipn.mx";
    const viajeId = req.params.id;

    try {
        const viajeRef = doc(db, 'horario', viajeId);
        const viajeDoc = await getDoc(viajeRef);

        if (viajeDoc.exists()) {
            const horarioData = viajeDoc.data();

            // Enviar datos como respuesta en formato JSON
            res.json({
                horario_trayecto: horarioData.horario_trayecto || '',
                horario_dia: horarioData.horario_dia || '',
                horario_hora: horarioData.horario_hora || '',
                horario_destino: horarioData.horario_destino || '',
                horario_origen: horarioData.horario_origen || '',
                usu_id: horarioData.usu_id || '',
                horario_solicitud: horarioData.horario_solicitud || '',
                horario_status: horarioData.horario_status || ''

            });
            console.log("finalemente")
        } else {
            res.status(404).json({ error: 'El id del viaje no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }
});



// Middleware para analizar el cuerpo de la solicitud como JSON
server.use(express.json());
// Ruta para registrar un viaje
server.post('/api/registrarsolicitud', async (req, res) => {
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

server.get('/api/consultasolicitudes/:iduser/:idhorario/:status', async (req, res) => {
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

/*Consultar un viaje, teniendo el id  19/12/2023 ------------------------------------------------------------*/


/*-------------------------------------------------------------------*/








//Ruta para obtener el itinerario del pasajero
server.get('/api/itinerarioviajespasajero/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Assuming 'viajes' is your collection name
        const viajesRef = collection(db, 'horario');
        const viajesQuery = query(viajesRef, where('usu_id', '==', userId));
        const viajesSnapshot = await getDocs(viajesQuery);

        if (viajesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const viajesData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    horario_id: doc.id, // Agregar el I
                    horario_destino: data.horario_destino || '',
                    horario_origen: data.horario_origen || '',
                    horario_hora: data.horario_hora || '',
                    horario_dia: data.horario_dia || '',
                    horario_trayecto:data.horario_trayecto || '',
                    horario_solicitud:data.horario_solicitud || '',
                    horario_status: data.horario_status || '',

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
server.get('/api/solicitudesconductor/:id', async (req, res) => {
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

//Agregado 24/12/2023

//Buscar el id en solicitudes 15/12/2023
server.get('/api/solicitudespasajero/:id', async (req, res) => {
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



//Ruta para consultar la parada, de acuerdo a su id
server.get('/api/obtenerparada/:id', async (req, res) => {
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

//Aceptar
// Ruta para modificar el status de una parada
server.put('/api/modificarstatussolicitud/:id/:status', async (req, res) => {
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




//---------modificar solicitud en el horario del pasajero------
server.put('/api/modificarsolicitudhorario/:id/:status', async (req, res) => {
    const horarioId = req.params.id;
    const nuevoStatus = req.params.status;

    try {
        const paradaRef = doc(db, 'horario', horarioId);
        const paradaDoc = await getDoc(paradaRef);

        if (paradaDoc.exists()) {
            // Modificar solo el campo status de la parada
            await updateDoc(paradaRef, { horario_solicitud: nuevoStatus });
            console.log("Solicitud en horario modificada ")
            res.json({ message: 'Estado de la solicitud modificado correctamente' });
        } else {
            res.status(404).json({ error: 'La parada no existe' });
        }
    } catch (error) {
        console.error('Error al modificar el estado de la solicitud en Firestore:', error);
        res.status(500).json({ error: 'Error al modificar el estado de la solicitud en Firestore' });
    }
});




//---------------Agregados despues de subir al git Hannia-----------------------
//Obtener los datos de la solicitu de acuerdo con un id de parada
server.get('/api/solicitudesparada/:id', async (req, res) => {
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














//////////////////
//--------------------------------------
//REGISTRAR REPORTES
server.use(express.json());
server.post('/api/registrarreporte', async (req, res) => {
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


//REGISTRAR IMPREVISTO
server.use(express.json());
server.post('/api/registrarimprevisto', async (req, res) => {
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

//Agregar al servidor en linea
//31/12/2023
server.use(express.json());
server.post('/api/registrarnotificacion', async (req, res) => {
    try {
        const imprevisto = req.body; // Asumiendo que la solicitud POST contiene los datos del nuevo usuario

        // Agrega un viaje a la coleccion "viaje"
        const imprevistoCollection = collection(db, 'notificacion');
        const docRef = await addDoc(imprevistoCollection, imprevisto);

        res.json({ message: 'Notificacion agregado correctamente', userId: docRef.id});

    } catch (error) {
        console.error('Error al agregar el notificacion a Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al agregar el imprevisto a Firestore'});
    }
});



//Obtener los datos de TODAS las solcitud que coincidan con un viaje
//31/12/2023
server.get('/api/consultasolicitudesbyviaje/:idviaje/:status', async (req, res) => {
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




//Obtener datos de la solcitud teniendo su id 04/01/202 no server
server.get('/api/obtenersolicitud/:id', async (req, res) => {

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


//Obtener todas las notificaciones del usuario
//05/01/2023
server.get('/api/obtenernotificaciones/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Assuming 'viajes' is your collection name
        const notificacionesRef = collection(db, 'notificacion');
        const notificacionesQuery = query(notificacionesRef, where('notificacion_usu_destino', '==', userId));
        const notificacionesSnapshot = await getDocs(notificacionesQuery);

        if (notificacionesSnapshot.docs.length > 0) {
            // Map the documents to an array of JSON objects
            const notData = viajesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    notificacion_id: doc.id, // Agregar el I
                    notificacion_tipo: data.notificacion_tipo || '',
                    notificacion_usu_origen: data.notificacion_usu_origen || '',
                    notificacion_usu_destino: data.notificacion_usu_destino || '',
                    notificacion_id_viaje: data.notificacion_id_viaje || '',
                    notificacion_id_solicitud: data.notificacion_id_solicitud || '',
                    notificacion_fecha:data.notificacion_fecha || '',

                }
            });

            // Send the array of JSON objects as a response
            res.json(notData);
        } else {
            res.status(404).json({ error: 'No se encontraron notificaciones' });
        }
    } catch (error) {
        console.error('Error al obtener documentos desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documentos desde Firestore' });
    }
});

//Obtener viaje teniendo id
server.get('/api/obtenerviaje/:id', async (req, res) => {

    const viajeId = req.params.id;

    try {
        const viajeRef = doc(db, 'viaje', viajeId);
        const viajeDoc = await getDoc(viajeRef);

        if (viajeDoc.exists()) {
            const viajeData = viajeDoc.data();

            // Enviar datos como respuesta en formato JSON
            res.json({
                usu_id: viajeData.usu_id || '',
                viaje_dia: viajeData.viaje_dia || '',
                viaje_origen: viajeData.viaje_origen || '',
                viaje_destino:viajeData.viaje_destino || '',
                viaje_hora_partida:viajeData.viaje_hora_partida || '',
                viaje_hora_llegada:viajeData.viaje_hora_llegada || '',
                viaje_trayecto:viajeData.viaje_trayecto || '',
                viaje_num_lugares:viajeData.viaje_num_lugares || '',
                viaje_status:viajeData.viaje_status || '',
                viaje_paradas:viajeData.viaje_paradas || '',
                viaje_iniciado: viajeData.viaje_iniciado || '',

            });
        } else {
            res.status(404).json({ error: 'El usuario no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }
});

//Obtener horario teniendo id
server.get('/api/obtenerhorario/:id', async (req, res) => {

    const viajeId = req.params.id;

    try {
        const viajeRef = doc(db, 'horario', viajeId);
        const viajeDoc = await getDoc(viajeRef);

        if (viajeDoc.exists()) {
            const viajeData = viajeDoc.data();

            // Enviar datos como respuesta en formato JSON
            res.json({
                usu_id: viajeData.usu_id || '',
                horario_dia: viajeData.horario_dia || '',
                horario_origen: viajeData.horario_origen || '',
                horario_destino:viajeData.horario_destino || '',
                horario_id:doc.id,
                horario_hora:viajeData.horario_hora || '',
                horario_trayecto:viajeData.horario_trayecto || '',
                horario_solicitud:viajeData.horario_solicitud || '',
                horario_status:viajeData.horario_status || '',


            })
        } else {
            res.status(404).json({ error: 'El usuario no existe' });
        }
    } catch (error) {
        console.error('Error al obtener documento desde Firestore:', error);
        res.status(500).json({ error: 'Error al obtener documento desde Firestore' });
    }
});


//AGREGADO EL 28/12/23
// Ruta para actualizar un horario específico
server.put('/api/actualizarhorario/:horarioId', async (req, res) => {
    try {
        const horarioId = req.params.horarioId;
        const datosActualizados = req.body; // Asumiendo que la solicitud PUT contiene los datos actualizados del horario

        // Actualiza el horario en la colección "horario"
        const horariosCollection = collection(db, 'horario');
        await updateDoc(doc(horariosCollection, horarioId), datosActualizados);

        res.json({ message: 'Horario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar horario en Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar horario en Firestore' });
    }
});

// Ruta para actualizar un viaje específico
server.put('/api/actualizarviaje/:viajeId', async (req, res) => {
    try {
        const viajeId = req.params.viajeId;
        const datosActualizados = req.body; // Asumiendo que la solicitud PUT contiene los datos actualizados del horario

        // Actualiza el viaje en la colección "viaje"
        const horariosCollection = collection(db, 'viaje');
        await updateDoc(doc(horariosCollection, viajeId), datosActualizados);

        res.json({ message: 'Viaje actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar viaje en Firestore:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar horario en Firestore' });
    }
});



const admin = require('firebase-admin');

// Debes descargar el archivo de configuración JSON desde la consola de Firebase y agregarlo a tu proyecto
const serviceAccount = {
    "type": "service_account",
    "project_id": "avanti-c4ba7",
    "private_key_id": "9d63b76e44996a2d4e46ff5552508597c274ff33",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDIK7h0Kv9kOraj\nA9ilcGsubStGlWCgULdaZqz63+HUXMoGHV4uLZ06fMaGJlMGivZYtEFGD3+gPLPJ\nPqyL7rfWcPzsv3yLWo9MeRyeyhSAixfbUWOzJPX+nQTbE/qghTBNCcWxmhayY3er\ndwTF3MkhASg54gco1cKW87tUkRYj/2Vh1R3WN14x724RpK7vk0u0bO254eKdFxg3\nHGTKLw+IkAOTabdsI3IeSSIQ1DDdP6aRdUFZswegBvYykcQaqI1LxYtjMOBkz0Ng\nyJyxIIxKa7hGhc5NqxxoFfBahoImKqa53v7amXgcaiYRNvJ/cT/3E5SH9RxBQ0gd\nFzdqaqwFAgMBAAECggEABlduP03qa+Y5SYZSa4FZf+3I+HI8jq+n82b71XHY0XXE\nF7f/9xYOXF8+Gdtmd3dZERva0omkqTKrHnXMGR3NuK85MBXr7+1FS26t07ECv8TI\nU3QrZK5H1dJrKDakksfNbS9hUjxXujyQ+r9pSQxy2ccT22uX/vjwsoATv/zdtvOu\nyLYMOkGJxOnHCfl3XVTDx/ETzeV1+lvdstkOB3LfNftVUQKXk+l3W2nxnCtwbCXu\nZpRO2pr8dygJgao2vNKJZJtpo82A8nhgFZLEC1yt7pX4ktJ8bviZoOtuhVC/bZF5\n9kf5G2SvBa0ZXdOosVojhI/puTQXlZHYQIR6gT9qyQKBgQDvWZNcNcpCrL6e8ih4\npFRngptAaeyZbcu3/rg/QBoN4HoGDH5x8r7yjG6hrIqNWpOgSHcJ7aHZ8Ja2CF7f\nHbjNfdpez8J3jZuKG9MJJ7WHMXwfwVjO4kFl6PZ+VpCiwvKuVV+EGKZSHI8/ff/g\nZ5jE65PEJyRdYJB5KjtOgAgSTQKBgQDWGG4HQNYnw4M9kWm8rynqrFWTq1oRUlSl\npGagtwGJTcOHLdi8HkzCyFhy4GHbC8SV/TMuhkHPrtJYjZzKKn4aOgOuIwa+6B2t\nYJjHdfiH+kb25oNePfE02FKHiBLBmkiUxBAXrB7uGbujmhX+RXyzTmXLH6TI6Brs\n/TAPDHysmQKBgCJN81nm97tAqP189aH844AGbxv3UorW+ri/UEb4eAN/Jd4SEllg\nkk+PIxgW87C4x6nUWQNaRLVIz0D9yCMwTlldbVvjaRrbd+x+emu4fkMHK6QdgQ39\nzaO+lP2ciJRbXo7v+4WiRsxD/Z/6/h56mqG2pfIaLhMYEPzcua1RmlaNAoGACYhQ\n7dW/M0oLP+SHlrUd4qsFrGuGuRq3ViC5yRIc6WYi/JPYAJhAxrNw7Lx83unpONxr\nOPkVWQ/pobO8dWvq7XQD0e8RT9K574xLgSYJiNRl8HxXAQ00/itbkVlHrIMYFDee\nl888GVHf/urPa+DgKoOlGKQyDBf5iu/DAgiGTJECgYAXl2JLd0CpELf73IQhRKvC\nrembMkBXnkwa9IJPM1gbLpJpLMtmS0CbhdTvHpfYFi8Ti1DC4QiDTGKvGql6ZtQR\nkebftWCw05fGamI/+BnVpve0XlI5BQ0RWak7PTfqXyRHUZSmzd8RMzzqruS8rqDQ\ndefhCByTjUYkozxylSKjZg==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fwlrc@avanti-c4ba7.iam.gserviceaccount.com",
    "client_id": "113539490105609553997",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fwlrc%40avanti-c4ba7.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

//ENVIAR TOKEN
server.post('/api/enviarnotificacionserver/:token/:titulo/:cuerpo', async (req, res) => {
    const token = req.params.token;
    const titulo = req.params.titulo;
    const cuerpo = req.params.cuerpo;
    console.log('RECIBE TOKEN', token)

    // Ejemplo de enviar notificación a un dispositivo específico
    try {
        const message = {
            notification: {
                title: titulo,
                body: cuerpo
            },
            token: token,
        };

        const response = await admin.messaging().send(message);
        console.log('Notificación enviada exitosamente:', response);
        res.sendStatus(200); // Responder con un código 200 OK
    } catch (error) {
        console.error('Error al enviar la notificación:', error);
        res.status(500).send('Error interno del servidor');
    }

    //res.sendStatus(200); // Responder con un código 200 OK
});

//Agregado 09/01/2023
//Obtiene las solciitud que coincidan con un id de viaje y es confirmada
server.get('/api/solciitudesconfirmadascon/:id', async (req, res) => {
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

//Registra la ubicacion actual del viaje en progreso


//-------------------------------
server.use(express.json());
server.post('/api/registrarecorrido', async (req, res) => {
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


//---------------



//Nuevos para el server
//Obtener el recorrido, teniendo el id del viaje
server.get('/api/consultarecorrido/:id', async (req, res) => {

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



/*exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
*/
exports.app = functions.https.onRequest(server);