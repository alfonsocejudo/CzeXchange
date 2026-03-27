import React from 'react';
import {render, screen} from '@testing-library/react-native';
import {ThemeProvider} from 'styled-components/native';
import {theme} from '../../theme';
import ExchangeRatesScreen from '../ExchangeRatesScreen';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

it('renders the title', () => {
  renderWithTheme(<ExchangeRatesScreen />);
  expect(screen.getByText('Exchange Rates')).toBeTruthy();
});

it('renders the subtitle', () => {
  renderWithTheme(<ExchangeRatesScreen />);
  expect(screen.getByText('Live rates will appear here')).toBeTruthy();
});
