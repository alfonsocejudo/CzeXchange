import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { theme } from '../../theme';
import { SourceProvider } from '../../context/SourceContext';
import { TargetCurrencyProvider } from '../../context/TargetCurrencyContext';
import ConvertScreen from '../ConvertScreen';

jest.mock('../../hooks/useExchangeRates');

import { useExchangeRates } from '../../hooks/useExchangeRates';

const mockUseExchangeRates = useExchangeRates as jest.MockedFunction<
  typeof useExchangeRates
>;

const MOCK_RATES = [
  { country: 'EMU', currency: 'euro', amount: 1, code: 'EUR', rate: 24.545 },
  { country: 'USA', currency: 'dollar', amount: 1, code: 'USD', rate: 23.5 },
];

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      <SourceProvider>
        <TargetCurrencyProvider>{ui}</TargetCurrencyProvider>
      </SourceProvider>
    </ThemeProvider>,
  );
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
  expect(screen.getByDisplayValue('1,000.00')).toBeTruthy();
});

it('renders the target currency label', () => {
  renderWithTheme(<ConvertScreen />);
  expect(screen.getByText('1 EUR = 24.545 CZK')).toBeTruthy();
});

it('converts CZK to target currency on button press', () => {
  renderWithTheme(<ConvertScreen />);
  fireEvent.press(screen.getByTestId('convert-button'));
  // 1000 / 24.545 = 40.74
  expect(screen.getByText('40.74')).toBeTruthy();
  expect(screen.getByText('Result in EUR')).toBeTruthy();
});

it('shows loading state', () => {
  mockUseExchangeRates.mockReturnValue({
    data: undefined,
    isLoading: true,
    error: null,
    dataUpdatedAt: 0,
  } as any);
  renderWithTheme(<ConvertScreen />);
  expect(screen.queryByDisplayValue('1,000.00')).toBeNull();
});

it('shows error state', () => {
  mockUseExchangeRates.mockReturnValue({
    data: undefined,
    isLoading: false,
    error: new Error('fail'),
    dataUpdatedAt: 0,
  } as any);
  renderWithTheme(<ConvertScreen />);
  expect(screen.getByText('Failed to load rates')).toBeTruthy();
});

it('displays the source name', () => {
  renderWithTheme(<ConvertScreen />);
  expect(screen.getByText('Czech National Bank')).toBeTruthy();
});

it('shows flag emoji in target currency picker', () => {
  renderWithTheme(<ConvertScreen />);
  expect(screen.getByText('🇪🇺')).toBeTruthy();
  expect(screen.getByText('EUR')).toBeTruthy();
});

it('shows -- when converting with no amount', () => {
  renderWithTheme(<ConvertScreen />);
  fireEvent.changeText(screen.getByDisplayValue('1,000.00'), '');
  fireEvent.press(screen.getByTestId('convert-button'));
  expect(screen.getByText('--')).toBeTruthy();
});

it('shows -- when converting with zero amount', () => {
  renderWithTheme(<ConvertScreen />);
  fireEvent.changeText(screen.getByDisplayValue('1,000.00'), '0');
  fireEvent.press(screen.getByTestId('convert-button'));
  expect(screen.getByText('--')).toBeTruthy();
});

it('rejects negative values as amount', () => {
  renderWithTheme(<ConvertScreen />);
  fireEvent.changeText(screen.getByDisplayValue('1,000.00'), '-500');
  expect(screen.getByDisplayValue('1,000.00')).toBeTruthy();
});
