import React from 'react';
import {render, screen} from '@testing-library/react-native';
import {ThemeProvider} from 'styled-components/native';
import {theme} from '../../theme';
import ConvertScreen from '../ConvertScreen';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

it('renders the title', () => {
  renderWithTheme(<ConvertScreen />);
  expect(screen.getByText('Convert')).toBeTruthy();
});

it('renders the subtitle', () => {
  renderWithTheme(<ConvertScreen />);
  expect(screen.getByText('Currency converter will appear here')).toBeTruthy();
});
