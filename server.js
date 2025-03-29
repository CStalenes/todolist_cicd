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
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'notes_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000
};

let connection;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 5;

// Fonction pour créer la connexion avec tentatives
function connectWithRetry() {
    connectionAttempts++;
    console.log(`Tentative de connexion à MySQL (${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS})...`);
    
    connection = mysql.createPool(dbConfig);
    
    // Vérification de la connexion à la base de données
    connection.getConnection((err, conn) => {
        if (err) {
            console.error('Erreur de connexion à la base de données:', err);
            
            if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
                // Attendre 5 secondes avant de réessayer
                console.log('Nouvelle tentative dans 5 secondes...');
                setTimeout(connectWithRetry, 5000);
            } else {
                console.error('Nombre maximum de tentatives atteint. Impossible de se connecter à la base de données.');
            }
            return;
        }
        
        connectionAttempts = 0;
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
            if (err) {
                console.error('Erreur lors de la création de la table:', err);
                return;
            }
            console.log('Table notes créée ou déjà existante');
        });
    });
    
    // Gérer les erreurs de connexion au niveau du pool
    connection.on('error', (err) => {
        console.error('Erreur de pool de connexion:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Connexion perdue. Tentative de reconnexion...');
            connectWithRetry();
        }
    });
}

// Démarrer la connexion à la base de données
connectWithRetry();

// Routes API
app.get('/api/notes', (req, res) => {
    if (!connection) {
        return res.status(503).json({ error: 'Service de base de données non disponible' });
    }
    
    connection.query('SELECT * FROM notes ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des notes:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
        }
        res.json(results);
    });
});

app.post('/api/notes', (req, res) => {
    if (!connection) {
        return res.status(503).json({ error: 'Service de base de données non disponible' });
    }
    
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
            if (err) {
                console.error('Erreur lors de l\'ajout d\'une note:', err);
                return res.status(500).json({ error: 'Erreur lors de l\'ajout d\'une note' });
            }
            res.json({ id: result.insertId, title, content });
        }
    );
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err.stack);
    res.status(500).json({ message: 'Erreur serveur' });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
}); 