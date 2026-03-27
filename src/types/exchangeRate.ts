export interface ExchangeRate {
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number;
}

export type Source = 'cnb' | 'floatrates' | 'exchangerate-api';
