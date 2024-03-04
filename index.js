// index.js
const express = require('express');
const db = require('./firebase');
const server = require('./express');

const port = 3000;

server.listen(port, () => {
    console.log(`El servidor está ejecutándose en el puerto ${port}`);
});
