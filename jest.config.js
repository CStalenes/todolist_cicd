module.exports = {
  // Résoudre le problème de collision de nommage Haste
  modulePathIgnorePatterns: ['<rootDir>/creation_note/'],
  
  // Configuration des environnements de test
  testEnvironment: 'node',
  
  // Configuration spécifique pour les tests du frontend
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  
  // Mapping pour les environnements de test spécifiques
  projects: [
    {
      displayName: 'backend',
      testMatch: ['<rootDir>/server.test.js'],
      testEnvironment: 'node'
    },
    {
      displayName: 'frontend',
      testMatch: ['<rootDir>/public/script.test.js'],
      testEnvironment: 'jsdom'
    }
  ]
}; 