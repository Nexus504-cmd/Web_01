const express = require('express');
const cors = require('cors');
const path = require('path');
const connection = require('./conexion');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta `html` (raíz del proyecto)
app.use(express.static(path.join(__dirname, '..', 'html')));

app.get('/', (req, res) => {
    res.send('Servidor Express funcionando');
});

app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});



// Endpoint real para obtener todos los vuelos desde la tabla `vuelos`
app.get('/api/vuelos', async (req, res) => {
    if (!connection) {
        return res.status(501).json({ error: 'No se encontró ./conexion' });
    }

    try {
        const sql = 'SELECT * FROM vuelos';

        if (typeof connection.promise === 'function') {
            const [rows] = await connection.promise().query(sql);
            return res.json({ data: rows });
        }

        if (typeof connection.query === 'function') {
            const rows = await new Promise((resolve, reject) => {
                connection.query(sql, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
            return res.json({ data: rows });
        }

        return res.status(501).json({ error: 'El módulo ./conexion no expone un método soportado (promise|query).' });
    } catch (err) {
        return res.status(500).json({ error: 'Error al obtener vuelos', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
