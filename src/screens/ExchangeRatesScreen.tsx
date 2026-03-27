import React from 'react';
import AppScreen from '../components/templates/AppScreen';
import ExchangeBoard from '../components/organisms/ExchangeBoard';
import {useExchangeRates} from '../hooks/useExchangeRates';

export default function ExchangeRatesScreen() {
  const {data: rates, isLoading, error, dataUpdatedAt} = useExchangeRates();

  return (
    <AppScreen>
      <ExchangeBoard
        rates={rates ?? []}
        isLoading={isLoading}
        error={error}
        updatedAt={dataUpdatedAt}
      />
    </AppScreen>
  );
}
