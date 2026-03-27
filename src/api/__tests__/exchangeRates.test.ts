import {fetchExchangeRates} from '../exchangeRates';
import * as client from '../client';

const MOCK_CNB_RESPONSE = `27 Mar 2026 #61
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|14.669
Hungary|forint|100|HUF|6.297
Indonesia|rupiah|1000|IDR|1.256`;

const MOCK_FLOATRATES_RESPONSE = JSON.stringify({
  usd: {
    code: 'usd',
    name: 'U.S. Dollar / United States',
    rate: 0.04692,
    inverseRate: 21.315,
  },
  eur: {
    code: 'eur',
    name: 'Euro / European Union',
    rate: 0.04074,
    inverseRate: 24.545,
  },
});

const MOCK_EXCHANGERATE_API_RESPONSE = JSON.stringify({
  result: 'success',
  base_code: 'CZK',
  rates: {
    CZK: 1,
    USD: 0.04692,
    EUR: 0.04074,
  },
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('CNB source', () => {
  it('parses response into ExchangeRate objects', async () => {
    jest.spyOn(client, 'apiGet').mockResolvedValue(MOCK_CNB_RESPONSE);

    const rates = await fetchExchangeRates('cnb');

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
    jest.spyOn(client, 'apiGet').mockResolvedValue(MOCK_CNB_RESPONSE);

    const rates = await fetchExchangeRates('cnb');

    expect(rates[1]).toMatchObject({code: 'HUF', amount: 100});
    expect(rates[2]).toMatchObject({code: 'IDR', amount: 1000});
  });

  it('skips header lines', async () => {
    jest.spyOn(client, 'apiGet').mockResolvedValue(MOCK_CNB_RESPONSE);

    const rates = await fetchExchangeRates('cnb');

    const codes = rates.map(r => r.code);
    expect(codes).not.toContain('Code');
  });
});

describe('FloatRates source', () => {
  it('parses response into ExchangeRate objects', async () => {
    jest.spyOn(client, 'apiGet').mockResolvedValue(MOCK_FLOATRATES_RESPONSE);

    const rates = await fetchExchangeRates('floatrates');

    expect(rates).toHaveLength(2);
    expect(rates[0]).toMatchObject({
      country: 'USA',
      code: 'USD',
      amount: 1,
      rate: 21.315,
    });
  });

  it('maps country names from CNB data', async () => {
    jest.spyOn(client, 'apiGet').mockResolvedValue(MOCK_FLOATRATES_RESPONSE);

    const rates = await fetchExchangeRates('floatrates');

    expect(rates[1]).toMatchObject({country: 'EMU', code: 'EUR'});
  });
});

describe('ExchangeRate-API source', () => {
  it('parses response and excludes CZK', async () => {
    jest
      .spyOn(client, 'apiGet')
      .mockResolvedValue(MOCK_EXCHANGERATE_API_RESPONSE);

    const rates = await fetchExchangeRates('exchangerate-api');

    expect(rates).toHaveLength(2);
    const codes = rates.map(r => r.code);
    expect(codes).not.toContain('CZK');
  });

  it('calculates inverse rate', async () => {
    jest
      .spyOn(client, 'apiGet')
      .mockResolvedValue(MOCK_EXCHANGERATE_API_RESPONSE);

    const rates = await fetchExchangeRates('exchangerate-api');
    const usd = rates.find(r => r.code === 'USD')!;

    expect(usd.rate).toBeCloseTo(1 / 0.04692);
  });

  it('maps country names from CNB data', async () => {
    jest
      .spyOn(client, 'apiGet')
      .mockResolvedValue(MOCK_EXCHANGERATE_API_RESPONSE);

    const rates = await fetchExchangeRates('exchangerate-api');

    expect(rates.find(r => r.code === 'USD')).toMatchObject({country: 'USA'});
    expect(rates.find(r => r.code === 'EUR')).toMatchObject({country: 'EMU'});
  });
});

describe('validation', () => {
  it('rejects empty response', async () => {
    jest.spyOn(client, 'apiGet').mockResolvedValue(`27 Mar 2026 #61
Country|Currency|Amount|Code|Rate`);

    await expect(fetchExchangeRates('cnb')).rejects.toThrow(
      'response contained no exchange rates',
    );
  });

  it('rejects invalid rate', async () => {
    jest.spyOn(client, 'apiGet').mockResolvedValue(`27 Mar 2026 #61
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|abc`);

    await expect(fetchExchangeRates('cnb')).rejects.toThrow(
      'invalid rate for AUD',
    );
  });

  it('rejects missing currency code', async () => {
    jest.spyOn(client, 'apiGet').mockResolvedValue(
      JSON.stringify({
        rates: {
          CZK: 1,
          '': 0.04692,
        },
      }),
    );

    await expect(fetchExchangeRates('exchangerate-api')).rejects.toThrow(
      'missing or invalid currency code',
    );
  });
});

it('propagates API errors', async () => {
  jest
    .spyOn(client, 'apiGet')
    .mockRejectedValue(new client.ApiError(500, 'Server error'));

  await expect(fetchExchangeRates('cnb')).rejects.toThrow('Server error');
});
