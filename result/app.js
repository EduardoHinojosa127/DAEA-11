const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs').promises;
const { parse } = require('csv-parse');

const app = express();
const port = 3001;

// Conexión a MongoDB
mongoose.connect('mongodb://mongo:27017/DAEA11', { useNewUrlParser: true, useUnifiedTopology: true });

let movieCsv = []; // Variable global para almacenar los datos del CSV

// Función para leer el archivo CSV de manera asíncrona
// Función para leer el archivo JSON de manera asíncrona
async function readJsonFile(filePath) {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    throw error;
  }
}


// Inicializar la aplicación
(async () => {
  try {
    // Leer el archivo JSON de manera asíncrona al inicio de la aplicación
    movieCsv = await readJsonFile('./data.json');
    console.log('Datos del JSON cargados exitosamente');
  } catch (error) {
    console.error('Error al cargar los datos del JSON:', error);
  }

  // Definición del esquema de la colección
  const movieScoreSchema = new mongoose.Schema({
    usuario: String,
    pelicula1: String,
    pelicula2: String,
    pelicula3: String,
    pelicula4: String,
    pelicula5: String,
  });

  const MovieScore = mongoose.model('MovieScore', movieScoreSchema);

  // Ruta para la página principal
  app.get('/', async (req, res) => {
    try {
      // Obtén los datos de MongoDB
      const db = mongoose.connection.db;
      const collection = db.collection('movie_scores');
      const movieScores = await collection.find({}, { _id: 0, __v: 0 }).toArray();

      // Renderiza la página y pasa los datos como contexto
      res.render('index', { movieScores, movieCsv });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });

  // Configuración de la vista y el directorio público
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs'); // Puedes usar otro motor de plantillas si prefieres

  // Iniciar el servidor
  app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
  });
})();
