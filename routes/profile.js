var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento con diskStorage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Los archivos se guardan en la carpeta 'uploads/'
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        // Obtenemos la extensión del archivo original
        const extname = path.extname(file.originalname);
        // Generamos un sufijo único utilizando la fecha y un número aleatorio
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Establecemos el nombre del archivo: 'avatar-uniqueSuffix.ext'
        cb(null, 'avatar-' + uniqueSuffix + extname);
    }
});

// Configuración de Multer con el almacenamiento personalizado
const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('form.html');
});

// Ruta POST para recibir el archivo
router.post('/', upload.single('avatar'), function (req, res, next) {
    console.log(req.file);
    // El archivo ha sido recibido y guardado, respondemos al usuario
    res.send("Archivo recibido y guardado.");
});

module.exports = router;