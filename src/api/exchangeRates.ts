import { ExchangeRate, Source } from '../types/exchangeRate';
import { COUNTRY_MAP } from '../constants/currencies';
import { apiGet } from './client';

// CNB returns pipe-delimited text with a variable amount per currency (1, 100, or 1000).
// Rates are already in CZK per X units of foreign currency.
// Example: "Australia|dollar|1|AUD|14.669"
async function fetchFromCnb(): Promise<ExchangeRate[]> {
  const data = await apiGet(
    'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt',
  );
  const lines = data.trim().split('\n');

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

// FloatRates returns JSON keyed by lowercase currency code. Each entry has both
// rate (CZK per 1 foreign unit as a decimal) and inverseRate (CZK per 1 foreign unit).
// We use inverseRate directly. Country name is split from the combined "name" field
// (e.g. "U.S. Dollar / United States") and falls back to COUNTRY_MAP.
async function fetchFromFloatRates(): Promise<ExchangeRate[]> {
  const data = await apiGet('https://www.floatrates.com/daily/czk.json');
  const json = JSON.parse(data);

  return Object.values(json).map((entry: any) => {
    const code = entry.code.toUpperCase();
    return {
      country: COUNTRY_MAP[code] ?? '',
      currency:
        (typeof entry.name === 'string'
          ? entry.name.split('/')[1]?.trim()
          : undefined) ?? entry.code,
      amount: 1,
      code,
      rate: entry.inverseRate,
    };
  });
}

// ExchangeRate-API returns JSON with CZK as base. Rates are foreign currency per 1 CZK
// (e.g. USD: 0.04692), so we invert them (1 / rate) to get CZK per 1 foreign unit.
// No country names are provided — uses COUNTRY_MAP for known codes.
async function fetchFromExchangeRateApi(): Promise<ExchangeRate[]> {
  const data = await apiGet('https://open.er-api.com/v6/latest/CZK');
  const json = JSON.parse(data);

  return Object.entries(json.rates)
    .filter(([code]) => code !== 'CZK')
    .map(([code, rate]) => ({
      country: COUNTRY_MAP[code] ?? '',
      currency: code,
      amount: 1,
      code,
      rate: 1 / (rate as number),
    }));
}

function validate(rates: ExchangeRate[], source: Source): ExchangeRate[] {
  if (rates.length === 0) {
    throw new Error(`${source}: response contained no exchange rates`);
  }

  for (const rate of rates) {
    if (typeof rate.code !== 'string' || rate.code.length === 0) {
      throw new Error(`${source}: missing or invalid currency code`);
    }
    if (!Number.isFinite(rate.rate) || rate.rate <= 0) {
      throw new Error(`${source}: invalid rate for ${rate.code}`);
    }
    if (!Number.isFinite(rate.amount) || rate.amount <= 0) {
      throw new Error(`${source}: invalid amount for ${rate.code}`);
    }
  }

  return rates;
}

const fetchers: Record<Source, () => Promise<ExchangeRate[]>> = {
  cnb: fetchFromCnb,
  floatrates: fetchFromFloatRates,
  'exchangerate-api': fetchFromExchangeRateApi,
};

export async function fetchExchangeRates(
  source: Source,
): Promise<ExchangeRate[]> {
  const rates = await fetchers[source]();
  return validate(rates, source);
}
