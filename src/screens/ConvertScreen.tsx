import React, { useState, useMemo, useCallback } from 'react';
import {
  ImageBackground,
  Keyboard,
  Platform,
  Pressable,
  Animated,
  StyleSheet,
} from 'react-native';
import CurrencyInput, { formatNumber } from 'react-native-currency-input';
import styled, { useTheme } from 'styled-components/native';
import AppScreen from '../components/templates/AppScreen';
import GlassPanel from '../components/organisms/GlassPanel';
import PickerModal from '../components/organisms/PickerModal';
import Label from '../components/atoms/Label';
import SlotText from '../components/atoms/SlotText';
import SourceTag from '../components/molecules/SourceTag';
import {
  LoadingState,
  ErrorState,
} from '../components/molecules/LoadingErrorState';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { getCurrencyFlag } from '../constants/flags';
import { useSource } from '../context/SourceContext';
import { useTargetCurrency } from '../context/TargetCurrencyContext';
import { SOURCE_NAMES } from '../constants/sources';
import { getNumberFormatSettings } from 'react-native-localize';
import { textShadow, textShadowStyle } from '../theme/textShadows';
import { images } from '../constants/assets';
import { useSpinAnimation } from '../hooks/useAnimations';

const { decimalSeparator, groupingSeparator } = getNumberFormatSettings();

const InputWell = styled.View`
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.warningBorder};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surfaceContainerLow};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FieldLabel = styled(Label)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PickerWell = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.outlineVariant};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surfaceContainerLow};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PickerRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const PickerFlag = styled.Text`
  font-size: 20px;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const PickerText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const ChevronText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
`;

const ResultWell = styled.View`
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.successBorder};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surfaceContainerLow};
  padding: 18px ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  align-items: center;
`;

const ResultText = styled.Text.attrs({
  numberOfLines: 1,
  adjustsFontSizeToFit: true,
})`
  font-family: ${({ theme }) => theme.fonts.ledDisplay};
  font-size: 48px;
  color: ${({ theme }) => theme.colors.success};
  ${textShadow('successGlow')}
`;

const ResultLabel = styled(Label)<{ stale?: boolean }>`
  text-align: center;
  color: ${({ stale, theme }) =>
    stale ? theme.colors.primaryContainer : theme.colors.onSurfaceVariant};
`;

const ConvertButtonWrapper = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export default function ConvertScreen() {
  const theme = useTheme();
  const { source } = useSource();
  const { data: rates, isLoading, error } = useExchangeRates();
  const { spin, triggerSpin } = useSpinAnimation();
  const { targetCode, setTargetCode } = useTargetCurrency();

  const [amount, setAmount] = useState<number | null>(1000);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultCode, setResultCode] = useState('EUR');
  const [slotTrigger, setSlotTrigger] = useState(0);

  const convertIconStyle = useMemo(
    () => ({
      fontSize: 48,
      color: theme.colors.embossedText,
      includeFontPadding: false,
      textAlignVertical: 'center' as const,
      textAlign: 'center' as const,
      marginTop: Platform.OS === 'android' ? -6 : 0,
      marginLeft: Platform.OS === 'android' ? -2 : 0,
      ...textShadowStyle(theme.textShadows.embossedStrong),
    }),
    [theme.colors.embossedText, theme.textShadows.embossedStrong],
  );

  const amountFontSize = useMemo(() => {
    if (amount == null) return 36;
    const formatted = formatNumber(amount, {
      separator: decimalSeparator,
      delimiter: groupingSeparator,
      precision: 2,
    });
    const len = formatted?.length ?? 0;
    return len > 12 ? 28 : len > 10 ? 32 : 36;
  }, [amount]);

  const amountInputStyle = useMemo(
    () => ({
      fontFamily: theme.fonts.ledDisplay,
      fontSize: amountFontSize,
      color: theme.colors.primary,
      textAlign: 'center' as const,
      padding: 0,
      ...textShadowStyle(theme.textShadows.primaryGlow),
    }),
    [
      theme.fonts.ledDisplay,
      theme.colors.primary,
      theme.textShadows.primaryGlow,
      amountFontSize,
    ],
  );

  const currencyCodes = useMemo(
    () => (rates ?? []).map(r => r.code).sort(),
    [rates],
  );

  const targetFlag = getCurrencyFlag(targetCode);
  const targetRate = useMemo(
    () => rates?.find(r => r.code === targetCode),
    [rates, targetCode],
  );
  const rateDescription = targetRate
    ? `${targetRate.amount} ${targetRate.code} = ${targetRate.rate.toFixed(
        3,
      )} CZK`
    : targetCode;

  const convert = useCallback(() => {
    triggerSpin();

    if (!rates || amount == null || amount <= 0) {
      setResult('--');
      return;
    }
    const rate = rates.find(r => r.code === targetCode);
    if (!rate) {
      setResult('--');
      return;
    }
    const unitRate = rate.rate / rate.amount;
    if (!Number.isFinite(unitRate) || unitRate <= 0) {
      setResult('--');
      return;
    }
    const converted = amount / unitRate;
    setResult(
      formatNumber(converted, {
        separator: decimalSeparator,
        delimiter: groupingSeparator,
        precision: 2,
      }),
    );
    setResultCode(targetCode);
    setSlotTrigger(prev => prev + 1);
  }, [amount, rates, targetCode, triggerSpin]);

  if (isLoading) {
    return (
      <AppScreen>
        <GlassPanel>
          <LoadingState />
        </GlassPanel>
      </AppScreen>
    );
  }

  if (error) {
    return (
      <AppScreen>
        <GlassPanel>
          <ErrorState />
        </GlassPanel>
      </AppScreen>
    );
  }

  return (
    <Pressable style={styles.flex} onPress={Keyboard.dismiss}>
      <AppScreen>
        <GlassPanel expand={false}>
          <SourceTag name={SOURCE_NAMES[source]} />
          <InputWell>
            <CurrencyInput
              style={amountInputStyle}
              value={amount}
              onChangeValue={v => {
                if (v !== null && (v < 0 || v > 9999999999.99)) return;
                setAmount(v);
              }}
              delimiter={groupingSeparator}
              separator={decimalSeparator}
              precision={2}
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textDisabled}
              placeholder="0"
            />
          </InputWell>
          <FieldLabel>Amount in CZK</FieldLabel>

          <PickerWell onPress={() => setPickerOpen(true)} activeOpacity={0.7}>
            <PickerRow>
              {targetFlag ? <PickerFlag>{targetFlag}</PickerFlag> : null}
              <PickerText>{targetCode}</PickerText>
            </PickerRow>
            <ChevronText>{'\u25BC'}</ChevronText>
          </PickerWell>
          <FieldLabel>{rateDescription}</FieldLabel>

          <PickerModal
            visible={pickerOpen}
            title="Select Currency"
            options={currencyCodes}
            onSelect={code => {
              setTargetCode(code);
              setPickerOpen(false);
            }}
            onClose={() => setPickerOpen(false)}
          />

          <ResultWell>
            {result ? (
              <SlotText
                value={result}
                animate={slotTrigger}
                stale={targetCode !== resultCode}
                fontSize={Math.min(48, 320 / result.length)}
              />
            ) : (
              <ResultText>--</ResultText>
            )}
          </ResultWell>
          <ResultLabel stale={!!(result && targetCode !== resultCode)}>
            {result && targetCode !== resultCode
              ? `Refresh to see conversion in ${targetCode}`
              : `Result in ${targetCode}`}
          </ResultLabel>
        </GlassPanel>

        <ConvertButtonWrapper>
          <Pressable onPress={convert} testID="convert-button">
            {({ pressed }) => (
              <ImageBackground
                source={pressed ? images.btnConvertPressed : images.btnConvert}
                style={styles.convertButton}
                resizeMode="stretch"
              >
                <Animated.Text
                  style={[convertIconStyle, { transform: [{ rotate: spin }] }]}
                >
                  {'\u21BB'}
                </Animated.Text>
              </ImageBackground>
            )}
          </Pressable>
        </ConvertButtonWrapper>
      </AppScreen>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  convertButton: {
    width: 120,
    height: 120,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
