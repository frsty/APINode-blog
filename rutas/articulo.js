const express = require("express");
const multer = require("multer");
const ArticuloControlador = require("../controladores/articulo");

const ruta = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null, "./imagenes/articulos/");
    },
    filename: function(req, file, cb){
        cb(null, "articulo" + Date.now()+ file.originalname);
    }
});

const subidas = multer({storage: storage});


ruta.post("/crear", ArticuloControlador.crear);
ruta.get("/articulos", ArticuloControlador.lista);
ruta.get("/articulo/:id", ArticuloControlador.listarUno);
ruta.delete("/articulo/:id", ArticuloControlador.eliminar);
ruta.put("/articulo/:id", ArticuloControlador.actualizar);
ruta.post("/subir-imagen/:id", [subidas.single("file0")], ArticuloControlador.subir);
ruta.get("/imagen/:fichero", ArticuloControlador.imagen);
ruta.get("/buscar/:busqueda", ArticuloControlador.buscador);


module.exports = ruta;