import React from 'react';
import { Animated, Pressable } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import AppScreen from '../components/templates/AppScreen';
import GlassPanel from '../components/organisms/GlassPanel';
import Label from '../components/atoms/Label';
import { useSource } from '../context/SourceContext';
import { SOURCE_NAMES } from '../constants/sources';
import { usePulseAnimation } from '../hooks/useAnimations';

const version = require('../../package.json').version;

const SectionLabel = styled(Label)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Option = styled.View<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 14px ${({ theme }) => theme.spacing.md};
  margin-bottom: 6px;
  background-color: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: 4px;
  border-left-width: 3px;
  border-left-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : 'transparent'};
`;

const Indicator = styled.View<{ selected: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  border-width: 2px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.outlineVariant};
  margin-right: ${({ theme }) => theme.spacing.md};
  align-items: center;
  justify-content: center;
`;

const IndicatorDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const VersionText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Spacer = styled.View`
  height: ${({ theme }) => theme.spacing.lg};
`;

const sources = Object.entries(SOURCE_NAMES).map(([key, label]) => ({
  key: key as keyof typeof SOURCE_NAMES,
  label,
}));

function SourceOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const pulseAnim = usePulseAnimation(selected);

  return (
    <Pressable onPress={onPress}>
      <Option selected={selected}>
        <Animated.View
          style={[
            selected
              ? {
                  shadowColor: theme.colors.primary,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 6,
                }
              : undefined,
            selected && { opacity: pulseAnim },
          ]}
        >
          <Indicator selected={selected}>
            {selected && <IndicatorDot />}
          </Indicator>
        </Animated.View>
        <Animated.Text
          style={[
            {
              fontSize: 16,
              color: selected
                ? theme.colors.primary
                : theme.colors.onSurfaceVariant,
              fontWeight: selected ? 'bold' : 'normal',
            },
            selected && { opacity: pulseAnim },
          ]}
        >
          {label}
        </Animated.Text>
      </Option>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { source, setSource } = useSource();

  return (
    <AppScreen>
      <GlassPanel expand={false}>
        <SectionLabel>Exchange Rate Source</SectionLabel>
        {sources.map(({ key, label }) => (
          <SourceOption
            key={key}
            label={label}
            selected={source === key}
            onPress={() => setSource(key)}
          />
        ))}
        <Spacer />
        <SectionLabel>App Version</SectionLabel>
        <VersionText>{version}</VersionText>
      </GlassPanel>
    </AppScreen>
  );
}
