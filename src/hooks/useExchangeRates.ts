import {useQuery} from '@tanstack/react-query';
import {fetchExchangeRates} from '../api/exchangeRates';

export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchangeRates'],
    queryFn: fetchExchangeRates,
  });
}
