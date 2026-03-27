import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { theme } from '../../theme';
import { SourceProvider } from '../../context/SourceContext';
import { TargetCurrencyProvider } from '../../context/TargetCurrencyContext';
import ExchangeRatesScreen from '../ExchangeRatesScreen';

jest.mock('../../hooks/useExchangeRates');

import { useExchangeRates } from '../../hooks/useExchangeRates';

const mockUseExchangeRates = useExchangeRates as jest.MockedFunction<
  typeof useExchangeRates
>;

const mockNavigation = { setOptions: jest.fn() } as any;

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      <SourceProvider>
        <TargetCurrencyProvider>{ui}</TargetCurrencyProvider>
      </SourceProvider>
    </ThemeProvider>,
  );
}

it('shows loading indicator', () => {
  mockUseExchangeRates.mockReturnValue({
    data: undefined,
    isLoading: true,
    error: null,
    dataUpdatedAt: 0,
  } as any);

  renderWithProviders(<ExchangeRatesScreen navigation={mockNavigation} />);
  expect(screen.queryByText('USD')).toBeNull();
});

it('shows an error message on failure', () => {
  mockUseExchangeRates.mockReturnValue({
    data: undefined,
    isLoading: false,
    error: new Error('Network error'),
    dataUpdatedAt: 0,
  } as any);

  renderWithProviders(<ExchangeRatesScreen navigation={mockNavigation} />);
  expect(screen.getByText('Failed to load rates')).toBeTruthy();
});

it('renders currency rows when data is loaded', () => {
  mockUseExchangeRates.mockReturnValue({
    data: [
      {
        country: 'USA',
        currency: 'dollar',
        amount: 1,
        code: 'USD',
        rate: 23.5,
      },
      { country: 'EMU', currency: 'euro', amount: 1, code: 'EUR', rate: 25.0 },
    ],
    isLoading: false,
    error: null,
    dataUpdatedAt: Date.now(),
  } as any);

  renderWithProviders(<ExchangeRatesScreen navigation={mockNavigation} />);
  expect(screen.getByText('USD')).toBeTruthy();
  expect(screen.getByText('EUR')).toBeTruthy();
});

it('navigates to Convert when a currency row is pressed', () => {
  const mockNavigate = jest.fn();
  const nav = { setOptions: jest.fn(), navigate: mockNavigate } as any;

  mockUseExchangeRates.mockReturnValue({
    data: [
      {
        country: 'USA',
        currency: 'dollar',
        amount: 1,
        code: 'USD',
        rate: 23.5,
      },
    ],
    isLoading: false,
    error: null,
    dataUpdatedAt: Date.now(),
  } as any);

  renderWithProviders(<ExchangeRatesScreen navigation={nav} />);
  fireEvent.press(screen.getByText('USD'));
  expect(mockNavigate).toHaveBeenCalledWith('Convert');
});
