const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configuration du middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuration de la base de données
const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'notes_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Vérification de la connexion à la base de données
connection.getConnection((err, conn) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
    
    // Création de la table notes si elle n'existe pas
    const createTable = `
        CREATE TABLE IF NOT EXISTS notes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    conn.query(createTable, (err) => {
        conn.release(); // Libérer la connexion
        if (err) throw err;
        console.log('Table notes créée ou déjà existante');
    });
});

// Routes API
app.get('/api/notes', (req, res) => {
    connection.query('SELECT * FROM notes ORDER BY created_at DESC', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  
  // Validation des données
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Le titre ne peut pas être vide' });
  }
  
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Le contenu ne peut pas être vide' });
  }
  
  connection.query('INSERT INTO notes (title, content) VALUES (?, ?)', 
    [title, content], 
    (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, title, content });
    }
  );
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
}); 