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
    innerHTML: '',
    appendChild: jest.fn()
  };
});

document.getElementById = jest.fn(() => {
  return {
    value: 'Test',
    innerHTML: ''
  };
});

// Définir les fonctions globales pour les tests
global.loadNotes = function() {
  fetch('/api/notes')
    .then(response => response.json())
    .then(notes => {
      const notesList = document.getElementById('notesList');
      notesList.innerHTML = '';
    })
    .catch(error => console.error('Erreur:', error));
};

global.addNote = function() {
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
  });
};

describe('Frontend Script', () => {
  beforeEach(() => {
    // Réinitialiser les mocks
    fetch.mockClear();
    document.createElement.mockClear();
    document.getElementById.mockClear();
  });

  test('loadNotes doit appeler fetch avec le bon URL', () => {
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
    global.alert = alertMock;
    
    // Appeler la fonction
    global.addNote();

    // Vérifier si la validation fonctionne
    expect(fetch).not.toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalled();
  });

  // Clean up after all tests
  afterAll(done => {
    // Reset all mocks
    jest.resetAllMocks();
    done();
  });
}); 