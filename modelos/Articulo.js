const { Schema, model } = require("mongoose");

const ArticuloSchema = Schema({
    titulo: {
        type: String,
        require: true
    },
    contenido: {
        type: String,
        require: true
    },
    autor:{
        type: String,
        require: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: String,
        default: "default.png"
    }
});

module.exports = model("Articulo", ArticuloSchema);