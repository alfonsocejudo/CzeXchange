import { ExchangeRate } from '../types/exchangeRate';
import { apiGet } from './client';

export async function fetchExchangeRates(): Promise<ExchangeRate[]> {
  const data = await apiGet(
    '/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt',
  );
  const lines = data.trim().split('\n');

  // Skip first two lines (date header and column header)
  return lines.slice(2).map(line => {
    const [country, currency, amount, code, rate] = line.split('|');
    return {
      country,
      currency,
      amount: Number(amount),
      code,
      rate: Number(rate),
    };
  });
}
