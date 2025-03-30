Notes App - Application Web de Gestion de Notes
Une application web complète pour créer, afficher, modifier et supprimer des notes, avec une CI/CD robuste et un déploiement Docker.
Table des matières
Fonctionnalités
Technologies
Architecture
Installation
Utilisation
API
Tests
CI/CD Pipeline
Docker
Structure du projet
Fonctionnalités
✅ Création de notes avec titre et contenu
✅ Affichage de toutes les notes existantes
✅ Modification de notes
✅ Suppression de notes
✅ Validation des données
✅ Interface utilisateur réactive et intuitive
✅ API REST complète
Technologies
Backend: Node.js, Express.js
Base de données: MySQL
Tests: Jest, Supertest
CI/CD: GitHub Actions
Containerisation: Docker, Docker Compose
Frontend: HTML, CSS, JavaScript (vanilla)
Architecture
L'application suit une architecture à trois niveaux:
Frontend: Interface utilisateur simple et intuitive
Backend: API REST avec Express.js
Base de données: MySQL pour le stockage persistant
Installation
Prérequis
Node.js (v16 ou plus récent)
MySQL (v8.0 ou plus récent)
Docker et Docker Compose (pour déploiement containerisé)
Installation locale
Apply to server.js
Run
Installation avec Docker
Apply to server.js
Run
Utilisation
Après le démarrage, l'application est accessible à l'adresse: http://localhost:3000
Créer une note: Remplissez les champs titre et contenu, puis cliquez sur "Ajouter"
Voir les notes: Toutes les notes sont affichées dans la section "Mes Notes"
Modifier une note: Cliquez sur "Modifier" pour une note, modifiez le contenu puis "Mettre à jour"
Supprimer une note: Cliquez sur "Supprimer" pour retirer définitivement une note
API
L'application expose les endpoints REST suivants:
| Méthode | URL | Description | Corps de la requête |
|---------|-----|-------------|-------------------|
| GET | /api/notes | Récupérer toutes les notes | - |
| POST | /api/notes | Créer une nouvelle note | { "title": "string", "content": "string" } |
| PUT | /api/notes/:id | Mettre à jour une note | { "title": "string", "content": "string" } |
| DELETE | /api/notes/:id | Supprimer une note | - |
Tests
L'application comprend des tests automatisés pour le backend et le frontend:
Apply to server.js
Run
Les tests vérifient:
Routes API (création, lecture, mise à jour, suppression)
Validations de données
Fonctionnalités JavaScript frontend
CI/CD Pipeline
Le pipeline CI/CD utilise GitHub Actions et comprend:
Tests automatisés:
Exécution de tous les tests Jest
Vérification de la couverture de code
Build:
Installation des dépendances
Configuration de l'environnement MySQL
Vérification du fonctionnement de l'application
Docker Build:
Construction de l'image Docker
Test de l'image avec un conteneur MySQL associé
Déploiement:
Déploiement automatique après fusion dans main/master
Déploiement avec Docker Compose
Vérifications post-déploiement
Docker
L'application est containerisée avec Docker:
Dockerfile: Configuration de l'image Node.js avec l'application
docker-compose.yml: Orchestration de l'application et MySQL
Volumes: Stockage persistant pour les données MySQL
Réseau: Communication sécurisée entre les conteneurs
Pour mettre à jour après des modifications:
Apply to server.js
Run
Structure du projet
Apply to server.js
Ce projet a été créé pour démontrer une implémentation complète d'une application web moderne avec une pipeline CI/CD robuste et un déploiement containerisé.
