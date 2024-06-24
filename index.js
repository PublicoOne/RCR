const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware para procesar JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para autenticar las solicitudes POST
const requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Nombre del encabezado personalizable
    if (!apiKey || apiKey !== 'tu_llave_secreta') {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
};

// Aplicar middleware solo a rutas que requieran autenticación
app.post('/ruta-que-requiere-autenticacion', requireApiKey, (req, res) => {
    // Aquí va el código para manejar la solicitud POST segura
    res.json({ message: 'Operación POST exitosa' });
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Aplicación escuchando en el puerto ${PORT}`);
});
