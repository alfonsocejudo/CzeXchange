import React from 'react';
import {Pressable} from 'react-native';
import styled from 'styled-components/native';
import AppScreen from '../components/templates/AppScreen';
import {useSource} from '../context/SourceContext';
import {Source} from '../types/exchangeRate';

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

const SectionLabel = styled.Text`
  font-size: 13px;
  color: ${({theme}) => theme.colors.onSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const Option = styled.View<{selected: boolean}>`
  flex-direction: row;
  align-items: center;
  padding: 14px ${({theme}) => theme.spacing.md};
  margin-bottom: 6px;
  background-color: ${({theme}) => theme.colors.surfaceContainerLow};
  border-radius: 4px;
  border-left-width: 3px;
  border-left-color: ${({selected, theme}) =>
    selected ? theme.colors.primary : 'transparent'};
`;

const Indicator = styled.View<{selected: boolean}>`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  border-width: 2px;
  border-color: ${({selected, theme}) =>
    selected ? theme.colors.primary : theme.colors.outlineVariant};
  margin-right: ${({theme}) => theme.spacing.md};
  align-items: center;
  justify-content: center;
`;

const IndicatorDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({theme}) => theme.colors.primary};
`;

const OptionText = styled.Text<{selected: boolean}>`
  font-size: ${({theme}) => theme.fontSizes.md};
  color: ${({selected, theme}) =>
    selected ? theme.colors.onSurface : theme.colors.onSurfaceVariant};
  font-weight: ${({selected}) => (selected ? 'bold' : 'normal')};
`;

const sources: {key: Source; label: string}[] = [
  {key: 'cnb', label: 'Czech National Bank'},
  {key: 'floatrates', label: 'FloatRates'},
  {key: 'exchangerate-api', label: 'ExchangeRate-API'},
];

export default function SettingsScreen() {
  const {source, setSource} = useSource();

  return (
    <AppScreen>
      <GlassEmboss>
        <GlassWrapper>
          <GlassContent>
            <SectionLabel>Exchange Rate Source</SectionLabel>
            {sources.map(({key, label}) => (
              <Pressable key={key} onPress={() => setSource(key)}>
                <Option selected={source === key}>
                  <Indicator selected={source === key}>
                    {source === key && <IndicatorDot />}
                  </Indicator>
                  <OptionText selected={source === key}>{label}</OptionText>
                </Option>
              </Pressable>
            ))}
          </GlassContent>
          <ShimmerOverlay pointerEvents="none">
            <ShimmerBand />
            <ShimmerEdge />
          </ShimmerOverlay>
        </GlassWrapper>
      </GlassEmboss>
    </AppScreen>
  );
}
