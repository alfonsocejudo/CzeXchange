jest.mock('react-native-localize', () => ({
  getNumberFormatSettings: () => ({
    decimalSeparator: '.',
    groupingSeparator: ',',
  }),
}));
