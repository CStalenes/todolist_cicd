// Script pour l'application Notes

// Charger les notes depuis l'API
function loadNotes() {
  fetch('/api/notes')
    .then(response => response.json())
    .then(notes => {
      const notesList = document.getElementById('notesList');
      notesList.innerHTML = '';
      
      notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.setAttribute('data-id', note.id);
        
        noteElement.innerHTML = `
          <h3>${note.title}</h3>
          <p>${note.content}</p>
          <div class="actions">
            <button onclick="editNote(${note.id}, '${note.title}', '${note.content}')">Modifier</button>
            <button onclick="deleteNote(${note.id})">Supprimer</button>
          </div>
        `;
        
        notesList.appendChild(noteElement);
      });
    })
    .catch(error => console.error('Erreur:', error));
}

// Ajouter une nouvelle note
function addNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  
  if (!title || !content) {
    alert('Veuillez remplir tous les champs');
    return;
  }
  
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content })
  })
  .then(response => response.json())
  .then(data => {
    // Réinitialiser le formulaire
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    
    // Recharger les notes
    loadNotes();
  })
  .catch(error => console.error('Erreur:', error));
}

// Fonction pour éditer une note
function editNote(id, title, content) {
  document.getElementById('noteTitle').value = title;
  document.getElementById('noteContent').value = content;
  
  // Remplacer le bouton d'ajout par un bouton de mise à jour
  const addBtn = document.getElementById('addNoteBtn');
  addBtn.textContent = 'Mettre à jour';
  addBtn.onclick = function() {
    updateNote(id);
  };
}

// Mettre à jour une note existante
function updateNote(id) {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  
  if (!title || !content) {
    alert('Veuillez remplir tous les champs');
    return;
  }
  
  fetch(`/api/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content })
  })
  .then(response => response.json())
  .then(data => {
    // Réinitialiser le formulaire et restaurer le bouton d'ajout
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    
    const addBtn = document.getElementById('addNoteBtn');
    addBtn.textContent = 'Ajouter';
    addBtn.onclick = addNote;
    
    // Recharger les notes
    loadNotes();
  })
  .catch(error => console.error('Erreur:', error));
}

// Supprimer une note
function deleteNote(id) {
  if (confirm('Voulez-vous vraiment supprimer cette note?')) {
    fetch(`/api/notes/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      // Recharger les notes
      loadNotes();
    })
    .catch(error => console.error('Erreur:', error));
  }
}

// Charger les notes au chargement de la page
document.addEventListener('DOMContentLoaded', loadNotes); 