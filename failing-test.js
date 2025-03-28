// Ce test est intentionnellement configuré pour échouer
// Pour démontrer que la CI détecte les bugs
// Pour activer ce test, décommentez la ligne ci-dessous dans package.json:
// "test": "jest --forceExit failing-test.js"

test('Ce test doit échouer pour démontrer la détection de bugs dans la CI', () => {
  // Assertion qui échoue intentionnellement
  expect(true).toBe(false);
}); 