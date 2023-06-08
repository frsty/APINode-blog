const mongoose = require("mongoose");

const connection = async (url) => {

    try{
        //await mongoose.connect("mongodb://127.0.0.1:27017/mi_blog"); // conexion local
        await mongoose.connect(url);

        console.log("Conectado correctamente a la base de datos mi_blog !!");

    } catch(error){
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }

}

module.exports = {
    connection
}