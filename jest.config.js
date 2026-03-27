module.exports = {
  preset: 'react-native',
  testPathIgnorePatterns: ['/node_modules/', '\\.integration\\.test\\.'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|@tanstack/react-query|styled-components)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};
