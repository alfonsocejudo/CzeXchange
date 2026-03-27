import {getCurrencyFlag} from '../flags';

it('returns a flag emoji for a known currency', () => {
  const flag = getCurrencyFlag('USD');
  expect(flag).toBe('\uD83C\uDDFA\uD83C\uDDF8'); // 🇺🇸
});

it('returns a flag emoji for EUR', () => {
  const flag = getCurrencyFlag('EUR');
  expect(flag.length).toBeGreaterThan(0);
});

it('returns empty string for unknown currency', () => {
  expect(getCurrencyFlag('XYZ')).toBe('');
});
