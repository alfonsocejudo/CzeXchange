import React, {useState, useMemo, useRef, useCallback} from 'react';
import {
  TextInput,
  ImageBackground,
  Keyboard,
  Pressable,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import AppScreen from '../components/templates/AppScreen';
import GlassPanel from '../components/organisms/GlassPanel';
import PickerModal from '../components/molecules/PickerModal';
import Label from '../components/atoms/Label';
import SlotText from '../components/atoms/SlotText';
import SourceTag from '../components/molecules/SourceTag';
import {LoadingState, ErrorState} from '../components/molecules/LoadingErrorState';
import {useExchangeRates} from '../hooks/useExchangeRates';
import {useSource} from '../context/SourceContext';
import {SOURCE_NAMES} from '../constants/sources';
import {useCurrencyFormatter} from '../hooks/useCurrencyFormatter';
import {successGlowShadow, embossedShadow, primaryGlowStyle} from '../theme/mixins';
import {images} from '../constants/assets';

const InputWell = styled.View`
  border-width: 2px;
  border-color: ${({theme}) => theme.colors.warningBorder};
  border-radius: 8px;
  background-color: ${({theme}) => theme.colors.surfaceContainerLow};
  padding: ${({theme}) => theme.spacing.sm} ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.xs};
`;

const FieldLabel = styled(Label)`
  text-align: center;
  margin-bottom: ${({theme}) => theme.spacing.lg};
`;

const PickerWell = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.outlineVariant};
  border-radius: 8px;
  background-color: ${({theme}) => theme.colors.surfaceContainerLow};
  padding: ${({theme}) => theme.spacing.sm} ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.xs};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PickerText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.onSurface};
`;

const ChevronText = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.colors.onSurfaceVariant};
`;

const ResultWell = styled.View`
  border-width: 2px;
  border-color: ${({theme}) => theme.colors.successBorder};
  border-radius: 8px;
  background-color: ${({theme}) => theme.colors.surfaceContainerLow};
  padding: 18px ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.xs};
  align-items: center;
`;

const ResultText = styled.Text`
  font-size: 48px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.success};
  ${successGlowShadow}
`;

const ResultLabel = styled(Label)<{stale?: boolean}>`
  text-align: center;
  color: ${({stale, theme}) =>
    stale ? theme.colors.primaryContainer : theme.colors.onSurfaceVariant};
`;

const ConvertButtonWrapper = styled.View`
  align-items: center;
  margin-top: ${({theme}) => theme.spacing.lg};
`;

const ConvertButtonLabel = styled.Text`
  font-size: 64px;
  color: ${({theme}) => theme.colors.embossedText};
  ${embossedShadow(2)}
`;

export default function ConvertScreen() {
  const themeColors = useTheme();
  const {source} = useSource();
  const {data: rates, isLoading, error} = useExchangeRates();
  const {formatAmount, formatResult, stripGrouping} = useCurrencyFormatter();

  const amountInputStyle = useMemo(() => ({
    fontSize: 36,
    fontWeight: 'bold' as const,
    color: themeColors.colors.primary,
    textAlign: 'center' as const,
    padding: 0,
    ...primaryGlowStyle(themeColors),
  }), [themeColors]);
  const [amount, setAmount] = useState('1000');
  const [targetCode, setTargetCode] = useState('EUR');
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

    const numAmount = parseFloat(amount);
    if (!rates || isNaN(numAmount)) {
      setResult('--');
      return;
    }
    const rate = rates.find(r => r.code === targetCode);
    if (!rate) {
      setResult('--');
      return;
    }
    const converted = numAmount / (rate.rate / rate.amount);
    setResult(formatResult(converted));
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
              <TextInput
                style={amountInputStyle}
                value={formatAmount(amount)}
                onChangeText={text => setAmount(stripGrouping(text))}
                keyboardType="numeric"
                placeholderTextColor={themeColors.colors.textDisabled}
                placeholder="0"
              />
            </InputWell>
            <FieldLabel>Amount in CZK</FieldLabel>

            <PickerWell
              onPress={() => setPickerOpen(true)}
              activeOpacity={0.7}>
              <PickerText>{targetCode}</PickerText>
              <ChevronText>{'\u25BC'}</ChevronText>
            </PickerWell>
            <FieldLabel>Target Currency</FieldLabel>

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
                <SlotText value={result} animate={slotTrigger} stale={targetCode !== resultCode} />
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
          {({pressed}) => (
            <ImageBackground
              source={pressed ? images.btnConvertPressed : images.btnConvert}
              style={styles.convertButton}
              resizeMode="stretch">
              <Animated.View style={[styles.iconContainer, {transform: [{rotate: spin}]}]}>
                <ConvertButtonLabel>{'\u21BB'}</ConvertButtonLabel>
              </Animated.View>
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
  iconContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertButton: {
    width: 160,
    height: 160,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
