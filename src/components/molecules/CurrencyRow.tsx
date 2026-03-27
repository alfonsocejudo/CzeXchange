import React from 'react';
import styled from 'styled-components/native';
import {ExchangeRate} from '../../types/exchangeRate';
import {getCurrencyFlag} from '../../constants/flags';

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({theme}) => theme.colors.surfaceContainerLow};
  padding: 12px ${({theme}) => theme.spacing.md};
  margin-bottom: 6px;
  border-radius: 4px;
`;

const CurrencyInfo = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const FlagContainer = styled.View`
  width: 36px;
  margin-right: ${({theme}) => theme.spacing.sm};
  align-items: center;
`;

const FlagText = styled.Text`
  font-size: 28px;
`;

const CurrencyDetails = styled.View`
  flex-direction: column;
`;

const CurrencyCode = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.md};
  font-weight: bold;
  color: ${({theme}) => theme.colors.onSurface};
`;

const CurrencyName = styled.Text`
  font-size: 11px;
  color: ${({theme}) => theme.colors.onSurfaceVariant};
  text-transform: uppercase;
`;

const RateWell = styled.View`
  background-color: ${({theme}) => theme.colors.surfaceContainerLowest};
  padding: ${({theme}) => theme.spacing.sm} 10px;
  border-radius: 4px;
  margin-left: ${({theme}) => theme.spacing.sm};
  min-width: 76px;
  align-items: flex-end;
  justify-content: center;
`;

const RateText = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.primary};
  text-shadow-color: rgba(255, 180, 170, 0.5);
  text-shadow-offset: 0px 0px;
  text-shadow-radius: 6px;
`;

interface CurrencyRowProps {
  rate: ExchangeRate;
}

export default function CurrencyRow({rate}: CurrencyRowProps) {
  const currencyLabel =
    rate.amount !== 1 ? `${rate.currency} (${rate.amount})` : rate.currency;

  return (
    <RowContainer>
      <CurrencyInfo>
        <FlagContainer>
          <FlagText>{getCurrencyFlag(rate.code)}</FlagText>
        </FlagContainer>
        <CurrencyDetails>
          <CurrencyCode>{rate.code}</CurrencyCode>
          <CurrencyName>{currencyLabel}</CurrencyName>
        </CurrencyDetails>
      </CurrencyInfo>
      <RateWell>
        <RateText>{rate.rate.toFixed(3)}</RateText>
      </RateWell>
    </RowContainer>
  );
}
