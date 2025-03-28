// Charger les notes au chargement de la page
document.addEventListener('DOMContentLoaded', loadNotes);

function loadNotes() {
    fetch('/api/notes')
        .then(response => response.json())
        .then(notes => {
            const notesList = document.getElementById('notesList');
            notesList.innerHTML = '';
            notes.forEach(note => {
                notesList.appendChild(createNoteElement(note));
            });
        })
        .catch(error => console.error('Erreur:', error));
}

function createNoteElement(note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    noteDiv.setAttribute('data-note-id', note.id);
    noteDiv.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <div class="note-buttons">
            <button onclick="editNote(${note.id})" class="edit-btn">Edit</button>
            <button onclick="deleteNote(${note.id})" class="delete-btn">Delete</button>
        </div>
    `;
    return noteDiv;
}

function addNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (!title || !content) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    // Valider la longueur du titre
    if (title.length > 255) {
        alert('Le titre ne doit pas dépasser 255 caractères');
        return;
    }

    fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur serveur');
        }
        return response.json();
    })
    .then(() => {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        loadNotes();
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de l\'ajout de la note');
    });
}

function editNote(id) {
    const note = document.querySelector(`[data-note-id="${id}"]`);
    
    if (!note) {
        console.error('Note non trouvée');
        alert('Erreur: Note non trouvée');
        return;
    }
    
    const titleElement = note.querySelector('h3');
    const contentElement = note.querySelector('p');
    
    if (!titleElement || !contentElement) {
        console.error('Structure de note invalide');
        return;
    }
    
    const newTitle = prompt('Nouveau titre:', titleElement.textContent);
    const newContent = prompt('Nouveau contenu:', contentElement.textContent);

    if (newTitle === null || newContent === null) return;
    
    const trimmedTitle = newTitle.trim();
    const trimmedContent = newContent.trim();
    
    if (!trimmedTitle || !trimmedContent) {
        alert('Le titre et le contenu ne peuvent pas être vides');
        return;
    }
    
    if (trimmedTitle.length > 255) {
        alert('Le titre ne doit pas dépasser 255 caractères');
        return;
    }

    fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: trimmedTitle, content: trimmedContent })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur serveur');
        }
        return response.json();
    })
    .then(() => loadNotes())
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la mise à jour de la note');
    });
}

function deleteNote(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;

    fetch(`/api/notes/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur serveur');
        }
        return response.json();
    })
    .then(() => loadNotes())
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la suppression de la note');
    });
} 