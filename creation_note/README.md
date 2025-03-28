# Notes App

Une application web simple pour créer, afficher, modifier et supprimer des notes.

## Prérequis

- Node.js (v14 ou plus récent)
- MySQL (v5.7 ou plus récent)

## Installation

1. Clonez ce dépôt
```
git clone <repository-url>
cd notes-app
```

2. Installez les dépendances
```
npm install
```

3. Créez une base de données MySQL
```sql
CREATE DATABASE notes_db;
```

4. Configurez la connexion à la base de données
   - Ouvrez le fichier `server.js`
   - Modifiez les paramètres de connexion selon votre configuration MySQL:
   ```javascript
   const connection = mysql.createPool({
       host: 'localhost',
       user: 'root',
       password: '',
       database: 'notes_db',
       waitForConnections: true,
       connectionLimit: 10,
       queueLimit: 0
   });
   ```

## Démarrage

Pour démarrer l'application, exécutez:
```
npm start
```

L'application sera accessible à l'adresse: http://localhost:3000

## Fonctionnalités

- Créer une note avec un titre et un contenu
- Afficher toutes les notes existantes
- Modifier une note existante
- Supprimer une note

## Structure du projet

- `server.js` - le serveur Express qui gère les routes API et la connexion à la base de données
- `public/` - contient les fichiers statiques du frontend
  - `index.html` - la structure HTML de l'application
  - `style.css` - les styles CSS de l'application
  - `script.js` - le JavaScript côté client qui gère les interactions avec l'API 