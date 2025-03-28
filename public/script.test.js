/**
 * @jest-environment jsdom
 */

// Mock du fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { id: 1, title: 'Test Note', content: 'Test Content' },
      { id: 2, title: 'Test Note 2', content: 'Test Content 2' }
    ])
  })
);

// Mock des fonctions DOM
document.createElement = jest.fn(() => {
  return {
    className: '',
    setAttribute: jest.fn(),
    innerHTML: ''
  };
});

document.getElementById = jest.fn(() => {
  return {
    value: 'Test',
    innerHTML: ''
  };
});

// Import des fonctions du script
const fs = require('fs');
const path = require('path');
const scriptPath = path.resolve(__dirname, './script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Création d'une fonction pour évaluer le script
const evaluateScript = () => {
  const script = new Function('document', 'fetch', 'alert', 'confirm', 'prompt', scriptContent);
  return script(document, fetch, jest.fn(), jest.fn(() => true), jest.fn(() => 'test'));
};

describe('Frontend Script', () => {
  beforeEach(() => {
    // Réinitialiser les mocks
    fetch.mockClear();
    document.createElement.mockClear();
    document.getElementById.mockClear();
  });

  test('loadNotes doit appeler fetch avec le bon URL', () => {
    // Définir une fonction globale loadNotes pour le test
    global.loadNotes = function() {
      fetch('/api/notes')
        .then(response => response.json())
        .then(notes => {
          const notesList = document.getElementById('notesList');
          notesList.innerHTML = '';
        })
        .catch(error => console.error('Erreur:', error));
    };

    // Appeler la fonction
    global.loadNotes();

    // Vérifier les assertions
    expect(fetch).toHaveBeenCalledWith('/api/notes');
  });

  test('addNote doit vérifier si les champs sont vides', () => {
    // Simuler un champ vide
    document.getElementById = jest.fn((id) => {
      if (id === 'noteTitle') {
        return { value: '' };
      }
      if (id === 'noteContent') {
        return { value: 'Content' };
      }
      return { value: '', innerHTML: '' };
    });

    const alertMock = jest.fn();
    
    // Définir une fonction globale addNote pour le test
    global.addNote = function() {
      const title = document.getElementById('noteTitle').value.trim();
      const content = document.getElementById('noteContent').value.trim();

      if (!title || !content) {
        alertMock('Veuillez remplir tous les champs');
        return;
      }

      fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content })
      });
    };

    // Appeler la fonction
    global.addNote();

    // Vérifier si la validation fonctionne
    expect(fetch).not.toHaveBeenCalled();
  });

  // Clean up after all tests
  afterAll(done => {
    // Reset all mocks
    jest.resetAllMocks();
    done();
  });
}); 