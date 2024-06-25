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

// Crear la tabla si no existe
const createTableIfNotExists = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tu_tabla (
            id SERIAL PRIMARY KEY,
            parametro1 VARCHAR(255),
            parametro2 VARCHAR(255)
        );
    `;
    try {
        await pool.query(createTableQuery);
        console.log("Tabla 'tu_tabla' verificada/existente");
    } catch (err) {
        console.error('Error al crear/verificar la tabla:', err.message);
    }
};

// Ejecutar la función para crear la tabla
createTableIfNotExists();

const requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== 'tu_llave_secreta') {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
};

// Ruta que requiere autenticación y maneja POST
app.post('/', requireApiKey, async (req, res) => {
    const { parametro1 } = res;  // Extraer el valor específico de req.body
    const parametro2 = 'true';
    try {
        // Guardar los datos en la base de datos
        const result = await pool.query(
            'INSERT INTO tu_tabla (parametro1, parametro2) VALUES ($1, $2) RETURNING *',
            [parametro1, parametro2]
        );
        res.json({ message: 'Operación POST exitosa', data: req.body });
    } catch (err) {
        console.error('Error:', err.message);
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
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Aplicación escuchando en el puerto ${PORT}`);
});
