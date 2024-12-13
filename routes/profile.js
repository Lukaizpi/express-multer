var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

// Middleware para parsear cuerpos de solicitudes
router.use(bodyParser.urlencoded({ extended: true }));

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
const upload = multer({ 
    storage: storage,
   mits: { fileSize: 2 * 1024 * 1024 }, // Limitar el tamaño a 2 MB
    fileFilter: function (req, file, cb) {
        // Validar que el archivo sea una imagen (basado en extensión y MIME type)
        const extname = path.extname(file.originalname).toLowerCase();
        const mimetype = file.mimetype;
        if ((extname === '.png' || extname === '.jpg' || extname === '.jpeg') &&
            (mimetype === 'image/png' || mimetype === 'image/jpeg')) {
            cb(null, true); // Aceptar el archivo
        } else {
            cb(new Error('Solo se permiten archivos de imagen (PNG, JPG, JPEG).')); // Rechazar el archivo
        }
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('form.html');
});

// Ruta POST para recibir el archivo y el nombre del usuario
router.post('/', upload.single('avatar'), function (req, res, next) {
    const userName = req.body.name; // Obtener el nombre del usuario del cuerpo de la solicitud

    if (!req.file) {
        // Manejar caso en que no se subió un archivo válido
        return res.status(400).send("Archivo no válido o excede el límite de tamaño.");
    }

    if (!userName) {
        // Manejar caso en que no se proporcionó un nombre
        return res.status(400).send("El nombre del usuario es obligatorio.");
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const message = `Nombre recibido: ${userName}, URL de la imagen: ${fileUrl}`;

    // Log en la consola
    console.log(message);

    // Responder al cliente
    res.send(`Zure izena: ${req.body.name} Fitxategia: <a href="${fileUrl}">${fileUrl}</a>`)
});

// Middleware de manejo de errores para Multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message) {
        return res.status(400).send(err.message);
    }
    next(err);
});

module.exports = router;
