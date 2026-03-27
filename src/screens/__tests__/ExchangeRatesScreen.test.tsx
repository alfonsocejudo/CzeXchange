import React from 'react';
import {render, screen} from '@testing-library/react-native';
import {ThemeProvider} from 'styled-components/native';
import {theme} from '../../theme';
import ExchangeRatesScreen from '../ExchangeRatesScreen';

jest.mock('../../hooks/useExchangeRates');

import {useExchangeRates} from '../../hooks/useExchangeRates';

const mockUseExchangeRates = useExchangeRates as jest.MockedFunction<
  typeof useExchangeRates
>;

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

it('shows an error message on failure', () => {
  mockUseExchangeRates.mockReturnValue({
    data: undefined,
    isLoading: false,
    error: new Error('Network error'),
    dataUpdatedAt: 0,
  } as any);

  renderWithTheme(<ExchangeRatesScreen />);
  expect(screen.getByText('Failed to load rates')).toBeTruthy();
});

it('renders currency rows when data is loaded', () => {
  mockUseExchangeRates.mockReturnValue({
    data: [
      {country: 'USA', currency: 'dollar', amount: 1, code: 'USD', rate: 23.5},
      {country: 'EMU', currency: 'euro', amount: 1, code: 'EUR', rate: 25.0},
    ],
    isLoading: false,
    error: null,
    dataUpdatedAt: Date.now(),
  } as any);

  renderWithTheme(<ExchangeRatesScreen />);
  expect(screen.getByText('USD')).toBeTruthy();
  expect(screen.getByText('EUR')).toBeTruthy();
});
