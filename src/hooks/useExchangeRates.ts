import {useQuery} from '@tanstack/react-query';
import {fetchExchangeRates} from '../api/exchangeRates';
import {useSource} from '../context/SourceContext';

export function useExchangeRates() {
  const {source} = useSource();

  return useQuery({
    queryKey: ['exchangeRates', source],
    queryFn: () => fetchExchangeRates(source),
  });
}
