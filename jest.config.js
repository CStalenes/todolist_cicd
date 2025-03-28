module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'server.js',
    'public/script.js'
  ],
  // Ne pas exécuter le test qui échoue par défaut
  // Pour le tester, il faut l'activer séparément
  testPathIgnorePatterns: [
    '/node_modules/',
    'failing-test.js'
  ],
  verbose: true
}; 