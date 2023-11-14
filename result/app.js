const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3001;

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/DAEA11', { useNewUrlParser: true, useUnifiedTopology: true });

// Definición del esquema de la colección
const movieScoreSchema = new mongoose.Schema({
  usuario: String,
  pelicula1: String,
  pelicula2: String,
  pelicula3: String,
});

const MovieScore = mongoose.model('MovieScore', movieScoreSchema);

// Servir archivos estáticos desde el directorio actual
app.use(express.static(path.join(__dirname)));

// Ruta para obtener datos de MongoDB
// Ruta para obtener datos de MongoDB
app.get('/data', async (req, res) => {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection('movie_scores');
  
      // Realiza la consulta directamente en la colección 'movie_scores'
      const movieScores = await collection.find({}, { _id: 0, __v: 0 }).toArray();
  
      console.log('Datos obtenidos de MongoDB:', movieScores);
      res.json(movieScores);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });
  

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
