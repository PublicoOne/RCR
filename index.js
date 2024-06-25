const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // Requiere el cliente de PostgreSQL

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la conexión a la base de datos
const pool = new Pool({
    user: 'delwer',
    host: 'dpg-cpt0thmehbks73eseiag-a',
    database: 'rcrdatabase',
    password: 'iDyefsSgcmx214gZuyfxa5xxo6eyK0RM',
    port: 5432, // El puerto por defecto de PostgreSQL es 5432
});

const requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== 'tu_llave_secreta') {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
};

// Ruta que requiere autenticación y maneja POST
app.post('/', requireApiKey, async (req, res) => {
    const { parametro1, parametro2 } = req.body;

    try {
        // Guardar los datos en la base de datos
        const result = await pool.query(
            'INSERT INTO tu_tabla (parametro1, parametro2) VALUES ($1, $2) RETURNING *',
            [parametro1, parametro2]
        );
        res.json({ message: 'Operación POST exitosa', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar en la base de datos' });
    }
});

// Nueva ruta para consultar los datos guardados
app.get('/datos', requireApiKey, async (req, res) => {
    try {
        // Consulta para obtener todos los datos de la tabla
        const result = await pool.query('SELECT * FROM tu_tabla');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Aplicación escuchando en el puerto ${PORT}`);
});
