const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'davis',
    database: 'FlyPeru'
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar la database:', err);
        return;
    }
    console.log('Conexión exitosa a la database FlyPeru');
});

module.exports = connection;

connection.query('SELECT * From vuelos', (err, lista) => {
    let vuelo;
    let fecha_salida;
   
    if (err) {
        console.error('Error en la consulta de prueba:', err);
        return;
    }else {

        console.log('La conexión funciona correctamente, resultado de la consulta de prueba:');
        for(let i=0; i<lista.length; i++){
        vuelo = lista[i].precio;
        fecha_salida= lista[i].fecha_salida;
        console.log('Fecha de salida del vuelo:', fecha_salida);
        console.log('Precio del vuelo:', vuelo);
    }
    connection.end();
    }});