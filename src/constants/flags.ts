const CURRENCY_TO_COUNTRY: Record<string, string> = {
  AUD: 'AU',
  BRL: 'BR',
  CAD: 'CA',
  CNY: 'CN',
  DKK: 'DK',
  EUR: 'EU',
  HKD: 'HK',
  HUF: 'HU',
  ISK: 'IS',
  INR: 'IN',
  IDR: 'ID',
  ILS: 'IL',
  JPY: 'JP',
  MYR: 'MY',
  MXN: 'MX',
  NZD: 'NZ',
  NOK: 'NO',
  PHP: 'PH',
  PLN: 'PL',
  RON: 'RO',
  SGD: 'SG',
  ZAR: 'ZA',
  KRW: 'KR',
  SEK: 'SE',
  CHF: 'CH',
  THB: 'TH',
  TRY: 'TR',
  GBP: 'GB',
  USD: 'US',
};

function toFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65))
    .join('');
}

export function getCurrencyFlag(currencyCode: string): string {
  const country = CURRENCY_TO_COUNTRY[currencyCode];
  return country ? toFlagEmoji(country) : '';
}
