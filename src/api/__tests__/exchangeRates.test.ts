import {fetchExchangeRates} from '../exchangeRates';
import * as client from '../client';

const MOCK_RESPONSE = `27 Mar 2026 #61
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|14.669
Hungary|forint|100|HUF|6.297
Indonesia|rupiah|1000|IDR|1.256`;

beforeEach(() => {
  jest.resetAllMocks();
});

it('parses CNB response into ExchangeRate objects', async () => {
  jest.spyOn(client, 'apiGet').mockResolvedValue(MOCK_RESPONSE);

  const rates = await fetchExchangeRates();

  expect(rates).toHaveLength(3);
  expect(rates[0]).toEqual({
    country: 'Australia',
    currency: 'dollar',
    amount: 1,
    code: 'AUD',
    rate: 14.669,
  });
});

it('handles different amount values', async () => {
  jest.spyOn(client, 'apiGet').mockResolvedValue(MOCK_RESPONSE);

  const rates = await fetchExchangeRates();

  expect(rates[1]).toMatchObject({code: 'HUF', amount: 100});
  expect(rates[2]).toMatchObject({code: 'IDR', amount: 1000});
});

it('skips header lines', async () => {
  jest.spyOn(client, 'apiGet').mockResolvedValue(MOCK_RESPONSE);

  const rates = await fetchExchangeRates();

  const codes = rates.map(r => r.code);
  expect(codes).not.toContain('Code');
});

it('propagates API errors', async () => {
  jest
    .spyOn(client, 'apiGet')
    .mockRejectedValue(new client.ApiError(500, 'Server error'));

  await expect(fetchExchangeRates()).rejects.toThrow('Server error');
});
