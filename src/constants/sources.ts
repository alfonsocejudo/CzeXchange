import { Source } from '../types/exchangeRate';

export const SOURCE_NAMES: Record<Source, string> = {
  cnb: 'Czech National Bank',
  floatrates: 'FloatRates',
  'exchangerate-api': 'ExchangeRate-API',
};
