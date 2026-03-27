import React, {useState, useMemo, useRef} from 'react';
import {
  TextInput,
  ImageBackground,
  Keyboard,
  Pressable,
  Animated,
  Easing,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import styled from 'styled-components/native';
import AppScreen from '../components/templates/AppScreen';
import SlotText from '../components/atoms/SlotText';
import {useExchangeRates} from '../hooks/useExchangeRates';

const GlassEmboss = styled.View`
  border-radius: 16px;
  border-width: 4px;
  border-color: #8a8785;
`;

const GlassWrapper = styled.View`
  border-radius: 13px;
  overflow: hidden;
`;

const GlassContent = styled.View`
  background-color: ${({theme}) => theme.colors.surfaceContainerLowest};
  padding: ${({theme}) => theme.spacing.lg};
`;

const ShimmerOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ShimmerBand = styled.View`
  position: absolute;
  top: -20%;
  left: -50%;
  width: 70%;
  height: 160%;
  background-color: rgba(255, 255, 255, 0.03);
  transform: rotate(25deg);
`;

const ShimmerEdge = styled.View`
  position: absolute;
  top: -20%;
  left: 19%;
  width: 2px;
  height: 160%;
  background-color: rgba(255, 255, 255, 0.08);
  transform: rotate(25deg);
`;

const InputWell = styled.View`
  border-width: 2px;
  border-color: rgba(255, 140, 50, 0.6);
  border-radius: 8px;
  background-color: ${({theme}) => theme.colors.surfaceContainerLow};
  padding: 14px ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.xs};
`;

const FieldLabel = styled.Text`
  font-size: 13px;
  color: ${({theme}) => theme.colors.onSurfaceVariant};
  text-align: center;
  margin-bottom: ${({theme}) => theme.spacing.lg};
`;

const PickerWell = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.outlineVariant};
  border-radius: 8px;
  background-color: ${({theme}) => theme.colors.surfaceContainerLow};
  padding: 14px ${({theme}) => theme.spacing.md};
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
  border-color: rgba(0, 220, 130, 0.6);
  border-radius: 8px;
  background-color: ${({theme}) => theme.colors.surfaceContainerLow};
  padding: 18px ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.xs};
  align-items: center;
`;

const ResultText = styled.Text`
  font-size: 48px;
  font-weight: bold;
  color: #00dc82;
  text-shadow-color: rgba(0, 220, 130, 0.5);
  text-shadow-offset: 0px 0px;
  text-shadow-radius: 10px;
`;

const ResultLabel = styled.Text<{stale?: boolean}>`
  font-size: 13px;
  color: ${({stale, theme}) =>
    stale ? theme.colors.primaryContainer : theme.colors.onSurfaceVariant};
  text-align: center;
`;

const ConvertButtonWrapper = styled.View`
  align-items: center;
  margin-top: ${({theme}) => theme.spacing.lg};
`;

const ConvertButtonLabel = styled.Text`
  font-size: 64px;
  color: #6b6565;
  text-shadow-color: rgba(255, 255, 255, 0.6);
  text-shadow-offset: 0px 2px;
  text-shadow-radius: 0px;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  padding: 0px 32px;
`;

const ModalContent = styled.View`
  background-color: ${({theme}) => theme.colors.surfaceContainerHigh};
  border-radius: 12px;
  max-height: 400px;
  overflow: hidden;
`;

const ModalTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.onSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  padding: 16px;
`;

const CurrencyOption = styled.TouchableOpacity`
  padding: 14px 20px;
  border-top-width: 1px;
  border-top-color: rgba(255, 255, 255, 0.05);
`;

const CurrencyOptionText = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.colors.onSurface};
  font-weight: bold;
`;

const btnConvert = require('../assets/images/btn_convert.png');
const btnConvertPressed = require('../assets/images/btn_convert_pressed.png');

export default function ConvertScreen() {
  const {data: rates} = useExchangeRates();
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
    setResult(converted.toFixed(2));
    setResultCode(targetCode);
    setSlotTrigger(prev => prev + 1);
  };

  return (
    <Pressable style={styles.flex} onPress={Keyboard.dismiss}>
    <AppScreen>
      <GlassEmboss>
        <GlassWrapper>
          <GlassContent>
            <InputWell>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholderTextColor="#666"
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

            <Modal
              visible={pickerOpen}
              transparent
              animationType="fade"
              onRequestClose={() => setPickerOpen(false)}>
              <Pressable
                style={styles.flex}
                onPress={() => setPickerOpen(false)}>
                <ModalOverlay>
                  <Pressable onPress={e => e.stopPropagation()}>
                    <ModalContent>
                      <ModalTitle>Select Currency</ModalTitle>
                      <FlatList
                        data={currencyCodes}
                        keyExtractor={item => item}
                        renderItem={({item}) => (
                          <CurrencyOption
                            onPress={() => {
                              setTargetCode(item);
                              setPickerOpen(false);
                            }}>
                            <CurrencyOptionText>{item}</CurrencyOptionText>
                          </CurrencyOption>
                        )}
                      />
                    </ModalContent>
                  </Pressable>
                </ModalOverlay>
              </Pressable>
            </Modal>

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
          </GlassContent>
          <ShimmerOverlay pointerEvents="none">
            <ShimmerBand />
            <ShimmerEdge />
          </ShimmerOverlay>
        </GlassWrapper>
      </GlassEmboss>

      <ConvertButtonWrapper>
        <Pressable onPress={convert} testID="convert-button">
          {({pressed}) => (
            <ImageBackground
              source={pressed ? btnConvertPressed : btnConvert}
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
  amountInput: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffb4aa',
    textAlign: 'center',
    padding: 0,
    textShadowColor: 'rgba(255, 180, 170, 0.4)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 6,
  },
  convertButton: {
    width: 160,
    height: 160,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
