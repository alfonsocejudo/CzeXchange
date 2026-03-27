import React, { useState, useMemo, useRef } from 'react';
import {
  ImageBackground,
  Keyboard,
  Platform,
  Pressable,
  Animated,
  Easing,
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
  overflow: hidden;
`;

const ResultText = styled.Text.attrs({
  numberOfLines: 1,
  adjustsFontSizeToFit: true,
})`
  font-size: 48px;
  font-weight: bold;
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
  const themeColors = useTheme();
  const { source } = useSource();
  const { data: rates, isLoading, error } = useExchangeRates();
  const { decimalSeparator, groupingSeparator } = getNumberFormatSettings();

  const convertIconStyle = useMemo(
    () => ({
      fontSize: 64,
      color: themeColors.colors.embossedText,
      includeFontPadding: false,
      textAlignVertical: 'center' as const,
      textAlign: 'center' as const,
      marginTop: Platform.OS === 'android' ? -6 : 0,
      marginLeft: Platform.OS === 'android' ? -2 : 0,
      ...textShadowStyle(themeColors.textShadows.embossedStrong),
    }),
    [themeColors],
  );

  const amountInputStyle = useMemo(
    () => ({
      fontSize: 36,
      fontWeight: 'bold' as const,
      color: themeColors.colors.primary,
      textAlign: 'center' as const,
      padding: 0,
      ...textShadowStyle(themeColors.textShadows.primaryGlow),
    }),
    [themeColors],
  );
  const [amount, setAmount] = useState<number | null>(1000);
  const { targetCode, setTargetCode } = useTargetCurrency();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultCode, setResultCode] = useState('EUR');
  const [slotTrigger, setSlotTrigger] = useState(0);
  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const currencyCodes = useMemo(
    () => (rates ?? []).map(r => r.code).sort(),
    [rates],
  );

  const convert = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const numAmount = amount;
    if (!rates || numAmount == null) {
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
    const converted = numAmount / unitRate;
    setResult(
      formatNumber(converted, {
        separator: decimalSeparator,
        delimiter: groupingSeparator,
        precision: 2,
      }),
    );
    setResultCode(targetCode);
    setSlotTrigger(prev => prev + 1);
  };

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
              onChangeValue={setAmount}
              delimiter={groupingSeparator}
              separator={decimalSeparator}
              precision={2}
              keyboardType="numeric"
              placeholderTextColor={themeColors.colors.textDisabled}
              placeholder="0"
            />
          </InputWell>
          <FieldLabel>Amount in CZK</FieldLabel>

          <PickerWell onPress={() => setPickerOpen(true)} activeOpacity={0.7}>
            <PickerRow>
              {getCurrencyFlag(targetCode) ? (
                <PickerFlag>{getCurrencyFlag(targetCode)}</PickerFlag>
              ) : null}
              <PickerText>{targetCode}</PickerText>
            </PickerRow>
            <ChevronText>{'\u25BC'}</ChevronText>
          </PickerWell>
          <FieldLabel>
            {(() => {
              const r = rates?.find(rt => rt.code === targetCode);
              return r
                ? `${r.amount} ${r.code} = ${r.rate.toFixed(3)} CZK`
                : targetCode;
            })()}
          </FieldLabel>

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
    width: 160,
    height: 160,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
