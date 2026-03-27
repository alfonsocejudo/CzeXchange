import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {ThemeProvider} from 'styled-components/native';
import {theme} from '../../theme';
import ConvertScreen from '../ConvertScreen';

jest.mock('../../hooks/useExchangeRates');

import {useExchangeRates} from '../../hooks/useExchangeRates';

const mockUseExchangeRates = useExchangeRates as jest.MockedFunction<
  typeof useExchangeRates
>;

const MOCK_RATES = [
  {country: 'EMU', currency: 'euro', amount: 1, code: 'EUR', rate: 24.545},
  {country: 'USA', currency: 'dollar', amount: 1, code: 'USD', rate: 23.5},
];

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

beforeEach(() => {
  mockUseExchangeRates.mockReturnValue({
    data: MOCK_RATES,
    isLoading: false,
    error: null,
    dataUpdatedAt: Date.now(),
  } as any);
});

it('renders the amount input with default value', () => {
  renderWithTheme(<ConvertScreen />);
  expect(screen.getByDisplayValue('1000')).toBeTruthy();
});

it('renders the target currency label', () => {
  renderWithTheme(<ConvertScreen />);
  expect(screen.getByText('Target Currency')).toBeTruthy();
});

it('converts CZK to target currency on button press', () => {
  renderWithTheme(<ConvertScreen />);
  fireEvent.press(screen.getByTestId('convert-button'));
  // 1000 / 24.545 = 40.74 — digits rendered individually by SlotText
  expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  expect(screen.getByText('.')).toBeTruthy();
  expect(screen.getByText('Result in EUR')).toBeTruthy();
});
