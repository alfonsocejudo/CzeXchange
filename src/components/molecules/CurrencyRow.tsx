import React, { useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { ExchangeRate } from '../../types/exchangeRate';
import { getCurrencyFlag } from '../../constants/flags';
import { textShadowStyle } from '../../theme/textShadows';
import LedText from '../atoms/LedText';

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surfaceContainerLow};
  padding: 12px ${({ theme }) => theme.spacing.md};
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
  margin-right: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const FlagText = styled.Text`
  font-size: 28px;
`;

const CurrencyDetails = styled.View`
  flex-direction: column;
`;

const CurrencyCode = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const CurrencyName = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
  text-transform: uppercase;
`;

const RateWell = styled.View`
  background-color: ${({ theme }) => theme.colors.surfaceContainerLowest};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  margin-left: ${({ theme }) => theme.spacing.sm};
  min-width: 76px;
  align-items: flex-end;
  justify-content: center;
`;

const rateTextBase = {
  fontSize: 17,
};

interface CurrencyRowProps {
  rate: ExchangeRate;
  onPress?: (code: string) => void;
}

export default React.memo(function CurrencyRow({
  rate,
  onPress,
}: CurrencyRowProps) {
  const theme = useTheme();
  const currencyLabel =
    rate.amount !== 1 ? `${rate.currency} (${rate.amount})` : rate.currency;

  const rateStyle = useMemo(
    () => ({
      ...rateTextBase,
      color: theme.colors.primary,
      ...textShadowStyle(theme.textShadows.primaryGlow),
    }),
    [theme.colors.primary, theme.textShadows.primaryGlow],
  );

  const handlePress = useCallback(() => {
    onPress?.(rate.code);
  }, [onPress, rate.code]);

  return (
    <Pressable onPress={onPress ? handlePress : undefined}>
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
          <LedText style={rateStyle}>{rate.rate.toFixed(3)}</LedText>
        </RateWell>
      </RowContainer>
    </Pressable>
  );
});
