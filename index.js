const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

//Iniciar la app
console.log("App de node arrancada");


// Crear servidor Node
const app = express();
const URL_CONNECT = process.env.URL_CONNECT;
const PORT = process.env.PORT;

//Conectar a la base de datos
connection(URL_CONNECT);

// Configurar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json()); // recibir datos con content-type app/json
app.use(express.urlencoded({extended:true})); //form-url-encode

// Ruta prueba
app.get('/', (req, res) =>{
    res.send("Hola, conectado correctamente");
})

// Rutas
const rutas_articulos = require("./rutas/articulo");

// Cargo las rutas
app.use("/api", rutas_articulos);

// Crear servidor y escuchar peticiones http
app.listen(PORT, () =>{
    console.log("Servidor corriendo en el puerto "+PORT);
});