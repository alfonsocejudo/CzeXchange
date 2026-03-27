import { fetchExchangeRates } from '../exchangeRates';
import { Source } from '../../types/exchangeRate';

const sources: Source[] = ['cnb', 'floatrates', 'exchangerate-api'];

describe.each(sources)('%s integration', source => {
  it('returns valid exchange rates from live endpoint', async () => {
    const rates = await fetchExchangeRates(source);

    expect(rates.length).toBeGreaterThan(0);

    for (const rate of rates) {
      expect(typeof rate.code).toBe('string');
      expect(rate.code.length).toBeGreaterThan(0);
      expect(rate.rate).toBeGreaterThan(0);
      expect(Number.isFinite(rate.rate)).toBe(true);
      expect(rate.amount).toBeGreaterThan(0);
      expect(Number.isFinite(rate.amount)).toBe(true);
    }
  });

  it('includes USD in results', async () => {
    const rates = await fetchExchangeRates(source);
    const usd = rates.find(r => r.code === 'USD');

    expect(usd).toBeDefined();
    expect(usd!.rate).toBeGreaterThan(0);
  });

  it('includes EUR in results', async () => {
    const rates = await fetchExchangeRates(source);
    const eur = rates.find(r => r.code === 'EUR');

    expect(eur).toBeDefined();
    expect(eur!.rate).toBeGreaterThan(0);
  });
});
