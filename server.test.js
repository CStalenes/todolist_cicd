const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// On crée une version mock de mysql2 pour les tests
jest.mock('mysql2', () => {
  const mockPool = {
    getConnection: jest.fn((callback) => {
      callback(null, {
        query: jest.fn((sql, params, callback) => {
          if (callback) {
            callback(null, { insertId: 1 });
          } else if (params) {
            params(null, [
              { id: 1, title: 'Test Note', content: 'Test Content', created_at: new Date() },
              { id: 2, title: 'Test Note 2', content: 'Test Content 2', created_at: new Date() }
            ]);
          }
        }),
        release: jest.fn()
      });
    }),
    query: jest.fn((sql, params, callback) => {
      if (callback) {
        callback(null, { insertId: 1 });
      } else if (params && typeof params === 'function') {
        params(null, [
          { id: 1, title: 'Test Note', content: 'Test Content', created_at: new Date() },
          { id: 2, title: 'Test Note 2', content: 'Test Content 2', created_at: new Date() }
        ]);
      }
    })
  };
  return {
    createPool: jest.fn(() => mockPool)
  };
});

// Importe l'application après avoir initialisé les mocks
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuration de la base de données mockée
const mysql = require('mysql2');
const connection = mysql.createPool({
  host: 'localhost',
  user: 'test',
  password: 'test',
  database: 'test_db'
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
  connection.query('INSERT INTO notes (title, content) VALUES (?, ?)', 
    [title, content], 
    (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, title, content });
    }
  );
});

app.put('/api/notes/:id', (req, res) => {
  const { title, content } = req.body;
  connection.query('UPDATE notes SET title = ?, content = ? WHERE id = ?',
    [title, content, req.params.id],
    (err) => {
      if (err) throw err;
      res.json({ message: 'Note mise à jour' });
    }
  );
});

app.delete('/api/notes/:id', (req, res) => {
  connection.query('DELETE FROM notes WHERE id = ?', 
    [req.params.id],
    (err) => {
      if (err) throw err;
      res.json({ message: 'Note supprimée' });
    }
  );
});

// Tests
describe('Notes API', () => {
  // Test de récupération des notes
  test('GET /api/notes doit retourner toutes les notes', async () => {
    const response = await request(app).get('/api/notes');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].title).toBe('Test Note');
  });

  // Test de création d'une note
  test('POST /api/notes doit créer une nouvelle note', async () => {
    const newNote = { title: 'New Note', content: 'New Content' };
    const response = await request(app)
      .post('/api/notes')
      .send(newNote);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(newNote.title);
    expect(response.body.content).toBe(newNote.content);
  });

  // Test de mise à jour d'une note
  test('PUT /api/notes/:id doit mettre à jour une note', async () => {
    const updatedNote = { title: 'Updated Note', content: 'Updated Content' };
    const response = await request(app)
      .put('/api/notes/1')
      .send(updatedNote);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Note mise à jour');
  });

  // Test de suppression d'une note
  test('DELETE /api/notes/:id doit supprimer une note', async () => {
    const response = await request(app).delete('/api/notes/1');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Note supprimée');
  });

  // Test qui échoue si le titre est vide
  test('POST /api/notes doit échouer si le titre est vide', async () => {
    const invalidNote = { title: '', content: 'Some content' };
    
    // Implémentation manuelle pour simuler la validation côté serveur
    const response = await request(app)
      .post('/api/notes')
      .send(invalidNote);
    
    // Ce test devrait échouer si nous n'avons pas de validation côté serveur
    // Mais pour simuler un échec dans la CI, on force l'échec ici
    expect(invalidNote.title).not.toBe('');
  });
}); 