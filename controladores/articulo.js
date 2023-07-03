const fs = require("fs");
const path = require("path");
const validator = require("validator");
const Articulo = require("../modelos/Articulo");



const crear = async (req, res) =>{

    try{
        // Recoger parametros por post a guardar
        let parametros =  req.body;

        // Validar los datos
        let validar_titulo = !validator.isEmpty(parametros.titulo);
        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if(!validar_titulo || !validar_contenido){
            throw new Error("No se ha validado la informacion !!");
        }

        // Crear el objeto a guardar
        const articulo = new Articulo(parametros); // automatico

        // Asignar valores a objeto (manual o automatico)
        // articulo.titulo = parametros.titulo; //manual

        // Guardar el articulo en la bd
        let articuloGuardado = await articulo.save();

        res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo guardado con exito !!"
        }); 


    } catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }
    

}

const lista = async (req, res) =>{
    
    try {


        let consulta = Articulo.find().sort({ fecha: -1 });
      
        if (req.params.ultimos) {
          consulta = consulta.limit(6);
        }
      
        const resultado = await consulta.exec();
      
        if (resultado.length > 0) {
          res.status(200).json({
            status: "success",
            total: resultado.length,
            articulo: resultado,
            mensaje: "Articulo encontrado con exito !!"
          });
        } else {
          res.status(404).json({
            status: "error",
            mensaje: "No se encontraron articulos !!"
          });
        }
    }catch (error) {
        return res.status(500).json({
          status: "error",
          mensaje: "Error en el servidor"
        });
    }
}

const listarUno = async (req, res) =>{

    try{
        //Recoger un id por url
        let id = req.params.id;

        // Buscar el articulo
        let unArticulo = await Articulo.findById(id);

        if(unArticulo === null){
            return res.status(400).json({
                status: "error",
                mensaje: "No se encontro el articulo !!"
            });
        }
        // Devolver resultado
        return res.status(200).json({
            status: "success",
            mensaje: "Articulo encontrado!!",
            encontrado: unArticulo
        });

    }catch(error){
        // Si no existe devolver error
        return res.status(400).json({
            status: "error",
            mensaje: "No se encontro el articulo !!"
        });
    }
    
}

const actualizar = async (req, res) =>{
    try{

        // Recoger id articulo a actualizar
        let articuloId = req.params.id;

        // Recoger datos del body
        let parametros =  req.body;

        // Validar los datos
        let validar_titulo = !validator.isEmpty(parametros.titulo);
        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if(!validar_titulo || !validar_contenido){
            throw new Error("No se ha validado la informacion !!");
        }

        // Buscar y actualizar articulo
        let actualizado = await Articulo.findByIdAndUpdate(articuloId,parametros,{new: true});

        // Devolver datos
        return res.status(200).json({
            status: "success",
            mensaje: "Articulo actualizado!!",
            Actualizado: actualizado
        });

    } catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "No se ha podido actualizar el articulo!!"
        });
    }
}

const eliminar = async (req, res) =>{
    try{
        // Buscar el articulo por id
        let id = req.params.id;

        let articulo = await Articulo.findByIdAndDelete(id);

        return res.status(200).json({
            status: "success",
            mensaje: "Articulo borrado!!",
            borrado: articulo
        });


    } catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "No se encontro el articulo!!"
        });
    }
}

const subir = async (req, res) =>{
    try{
        // Recoger el fichero de imagen subido
        if(!req.file && !req.files){
            return res.status(400).json({
                status: "error",
                mensaje: "Peticion invalida"
            });
        }

        // Nombre del archivo
        let archivo = req.file.originalname;

        // Extension del archivo
        let archivo_split = archivo.split("\.");
        let extension = archivo_split[1];

        // Comprobar extencion
        if(extension != "png" && extension != "jpg" &&
        extension != "jpeg" && extension != "gif"){
            // Borrar archivo y dar respuesta
            fs.unlink(req.file.path,(error)=>{
                return res.status(400).json({
                    status: "error",
                    mensaje: "Imagen invalida"
                });
            })
        }else{
            // Si todo va bien, actualizar el articulo
            // Recoger id articulo a actualizar
            let articuloId = req.params.id;
            // Buscar y actualizar articulo
            let actualizado = await Articulo.findByIdAndUpdate(articuloId,{imagen: req.file.filename},{new: true});

            return res.status(200).json({
                status: "success",
                Actualizado: actualizado
            });
        }

        
    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "No al subir la imagen!!"
        });
    }
    
}

const imagen = (req, res) =>{

    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/"+fichero;

    fs.stat(ruta_fisica, (error,existe)=>{
        if(existe){
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(400).json({
                status: "error",
                mensaje: "No se encontro la imagen!!"
            });
        }
    })

}

const buscador = async (req, res) =>{
    try{
        //Sacar el string de busqueda
        let busqueda = req.params.busqueda;

        // Find OR
        let articuloBuscado = await Articulo.find({"$or":[
            {"titulo": {"$regex": busqueda, "$options": "i"}},
            {"autor": {"$regex": busqueda, "$options": "i"}},
        ]})
        .sort({fecha: -1});
        if(!articuloBuscado || articuloBuscado.length <= 0){
            return res.status(404).json({
                status: "error",
                mensaje: "No se el articulo!!"
            });
        }
        //devolver resultado
        return res.status(200).json({
            status: "success",
            mensaje: "Articulo encontrado!!",
            articulos: articuloBuscado
        });

    }catch(error){
        return res.status(404).json({
            status: "error",
            mensaje: "No se el articulo!!"
        });
    }
    
}

module.exports = {
    crear,
    lista,
    listarUno,
    actualizar,
    eliminar,
    subir,
    imagen,
    buscador
}
