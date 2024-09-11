const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3001;

// Configuración de MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud_db'
});

//verificar conexion
db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.get('/items', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

//ruta para agregar
app.post('/items', (req, res) => {
  const { nombre, edad, correo, telefono } = req.body;
  const query = 'INSERT INTO users (nombre, edad, correo, telefono) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, edad, correo, telefono], (err) => {
    if (err) throw err;
    res.status(201).send('Item creado');
  });
});

//ruta para modificar
app.put('/items/:id', (req, res) => {
  const { nombre, edad, correo, telefono } = req.body;
  const { id } = req.params;
  const query = 'UPDATE users SET nombre = ?, edad = ?, correo = ?, telefono = ? WHERE id = ?';
  db.query(query, [nombre, edad, correo, telefono, id], (err) => {
    if (err) throw err;
    res.send('Item actualizado');
  });
});


// ruta para eliminar
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.send('Item eliminado');
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
