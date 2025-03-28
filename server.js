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