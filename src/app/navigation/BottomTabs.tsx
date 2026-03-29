import React, { useCallback, useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
  Animated,
  TextStyle,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import ExchangeRatesScreen from '../../screens/ExchangeRatesScreen';
import ConvertScreen from '../../screens/ConvertScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import { textShadowStyle } from '../../theme/textShadows';
import { images } from '../../constants/assets';
import { usePulseAnimation } from '../../hooks/useAnimations';

const Tab = createBottomTabNavigator();

const TAB_LABELS: Record<string, string> = {
  ExchangeRates: 'RATES',
  Convert: 'CONVERT',
  Settings: 'SETTINGS',
};

// --- Tab Icon Styled Components ---

const IconContainer = styled.View<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

const RatesIconContainer = styled(IconContainer)`
  justify-content: space-evenly;
`;

const BarRow = styled.View<{ knobH: number }>`
  flex-direction: row;
  align-items: center;
  height: ${({ knobH }) => knobH}px;
`;

const Bar = styled.View<{ flex: number; barH: number; color: string }>`
  flex: ${({ flex }) => flex};
  height: ${({ barH }) => barH}px;
  background-color: ${({ color }) => color};
`;

const Knob = styled.View<{
  knobW: number;
  knobH: number;
  color: string;
}>`
  width: ${({ knobW }) => knobW}px;
  height: ${({ knobH }) => knobH}px;
  background-color: ${({ color }) => color};
  border-radius: 1px;
`;

const AbsView = styled.View<{
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  w: number;
  h: number;
  bg?: string;
  borderW?: number;
  borderC?: string;
  radius?: number;
}>`
  position: absolute;
  left: ${({ left }) => (left != null ? `${left}px` : 'auto')};
  top: ${({ top }) => (top != null ? `${top}px` : 'auto')};
  right: ${({ right }) => (right != null ? `${right}px` : 'auto')};
  bottom: ${({ bottom }) => (bottom != null ? `${bottom}px` : 'auto')};
  width: ${({ w }) => w}px;
  height: ${({ h }) => h}px;
  ${({ bg }) => bg && `background-color: ${bg}`};
  ${({ borderW, borderC }) =>
    borderW && borderC
      ? `border-width: ${borderW}px; border-color: ${borderC}`
      : ''};
  ${({ radius }) => (radius != null ? `border-radius: ${radius}px` : '')};
`;

const ArrowView = styled.View<{
  right: number;
  bottom: number;
  leftW: number;
  topW: number;
  bottomW: number;
  color: string;
}>`
  position: absolute;
  right: ${({ right }) => right}px;
  bottom: ${({ bottom }) => bottom}px;
  width: 0px;
  height: 0px;
  border-left-width: ${({ leftW }) => leftW}px;
  border-top-width: ${({ topW }) => topW}px;
  border-bottom-width: ${({ bottomW }) => bottomW}px;
  border-left-color: ${({ color }) => color};
  border-top-color: transparent;
  border-bottom-color: transparent;
`;

const GlowContainer = styled.View<{
  glowColor: string;
  focused: boolean;
}>`
  height: 26px;
  align-items: center;
  justify-content: center;
  ${({ focused, glowColor }) =>
    focused
      ? `shadow-color: ${glowColor}; shadow-offset: 0px 0px; shadow-opacity: 0.8; shadow-radius: 8px`
      : ''};
`;

const TabLabelText = styled.Text<{
  labelColor: string;
  focused: boolean;
  glowColor?: string;
  glowRadius?: number;
}>`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: ${({ labelColor }) => labelColor};
  ${({ focused, glowColor, glowRadius }) =>
    focused && glowColor
      ? `text-shadow-color: ${glowColor}; text-shadow-offset: 0px 0px; text-shadow-radius: ${
          glowRadius ?? 8
        }px`
      : ''};
`;

// --- Tab Icon Components ---

type IconProps = { color: string; size: number };

function RatesIcon({ color, size }: IconProps) {
  const barH = Math.max(1.5, size * 0.07);
  const knobW = size * 0.14;
  const knobH = size * 0.2;
  const positions = [0.25, 0.7, 0.45, 0.2];

  return (
    <RatesIconContainer size={size}>
      {positions.map((pos, i) => (
        <BarRow key={i} knobH={knobH}>
          <Bar flex={pos} barH={barH} color={color} />
          <Knob knobW={knobW} knobH={knobH} color={color} />
          <Bar flex={1 - pos} barH={barH} color={color} />
        </BarRow>
      ))}
    </RatesIconContainer>
  );
}

function ConvertIcon({ color, size }: IconProps) {
  const bw = Math.max(1.5, size * 0.08);
  const rectSize = size * 0.52;
  const offset = size * 0.32;

  return (
    <IconContainer size={size}>
      <AbsView
        left={size * 0.05}
        top={size * 0.05}
        w={rectSize}
        h={rectSize}
        borderW={bw}
        borderC={color}
      />
      <AbsView
        left={size * 0.05 + offset}
        top={size * 0.05 + offset}
        w={rectSize}
        h={rectSize}
        borderW={bw}
        borderC={color}
      />
      <ArrowView
        right={size * 0.08}
        bottom={size * 0.18}
        leftW={size * 0.1}
        topW={size * 0.07}
        bottomW={size * 0.07}
        color={color}
      />
    </IconContainer>
  );
}

function SettingsIcon({ color, size }: IconProps) {
  const bw = Math.max(1.5, size * 0.08);
  const ringD = size * 0.5;
  const toothSize = size * 0.15;
  const center = size / 2;
  const r = ringD / 2;
  const dotD = size * 0.14;

  return (
    <IconContainer size={size}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        return (
          <AbsView
            key={i}
            left={center + r * Math.cos(angle) - toothSize / 2}
            top={center + r * Math.sin(angle) - toothSize / 2}
            w={toothSize}
            h={toothSize}
            bg={color}
            radius={1}
          />
        );
      })}
      <AbsView
        left={center - ringD / 2}
        top={center - ringD / 2}
        w={ringD}
        h={ringD}
        radius={ringD / 2}
        borderW={bw}
        borderC={color}
      />
      <AbsView
        left={center - dotD / 2}
        top={center - dotD / 2}
        w={dotD}
        h={dotD}
        radius={dotD / 2}
        bg={color}
      />
    </IconContainer>
  );
}

const TAB_ICONS: Record<string, React.FC<IconProps>> = {
  ExchangeRates: RatesIcon,
  Convert: ConvertIcon,
  // Gear icon renders larger than the others for visual balance
  Settings: ({ color }) => <SettingsIcon color={color} size={26} />,
};

function TabButton({
  routeName,
  focused,
  onPress,
}: {
  routeName: string;
  focused: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const pulseAnim = usePulseAnimation(focused);

  const label = TAB_LABELS[routeName] ?? routeName;
  const color = focused ? theme.colors.primary : theme.colors.tabLabelInactive;
  const Icon = TAB_ICONS[routeName];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.tabButton}
    >
      <Animated.View
        style={[styles.tabButtonContent, focused && { opacity: pulseAnim }]}
      >
        <GlowContainer glowColor={theme.colors.primary} focused={focused}>
          {Icon && <Icon color={color} size={22} />}
        </GlowContainer>
        <TabLabelText
          labelColor={color}
          focused={focused}
          glowColor={theme.textShadows.tabActiveGlow.color}
          glowRadius={theme.textShadows.tabActiveGlow.radius}
        >
          {label}
        </TabLabelText>
      </Animated.View>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[styles.tabBarWrapper, { paddingBottom: insets.bottom + 2 }]}
    >
      <ImageBackground
        source={images.tabBar}
        style={styles.tabBarImage}
        resizeMode="stretch"
      >
        {state.routes.map((route, index) => (
          <TabButton
            key={route.key}
            routeName={route.name}
            focused={state.index === index}
            onPress={() => navigation.navigate(route.name)}
          />
        ))}
      </ImageBackground>
    </Animated.View>
  );
}

function HeaderTitle({
  children,
  style,
}: {
  children: React.ReactNode;
  style: TextStyle;
}) {
  return (
    <Text style={style}>
      {typeof children === 'string' ? children.toUpperCase() : ''}
    </Text>
  );
}

export default function BottomTabs() {
  const theme = useTheme();

  const headerTitleStyle = useMemo(
    () => ({
      fontWeight: '800' as const,
      fontSize: 13,
      letterSpacing: 3,
      color: theme.colors.embossedText,
      ...textShadowStyle(theme.textShadows.embossed),
    }),
    [theme.colors.embossedText, theme.textShadows.embossed],
  );

  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => <CustomTabBar {...props} />,
    [],
  );

  const renderHeaderTitle = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <HeaderTitle style={headerTitleStyle}>{children}</HeaderTitle>
    ),
    [headerTitleStyle],
  );

  const screenOptions = useMemo(
    () => ({
      headerStyle: {
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
      },
      headerTintColor: theme.colors.embossedText,
      headerTitle: renderHeaderTitle,
      sceneStyle: { backgroundColor: 'transparent' },
    }),
    [theme.colors.embossedText, renderHeaderTitle],
  );

  return (
    <ImageBackground source={images.bg} style={styles.bg} resizeMode="cover">
      <Tab.Navigator tabBar={renderTabBar} screenOptions={screenOptions}>
        <Tab.Screen
          name="ExchangeRates"
          component={ExchangeRatesScreen}
          options={{ title: 'Exchange Rates' }}
        />
        <Tab.Screen name="Convert" component={ConvertScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  tabBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  tabBarImage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonContent: {
    alignItems: 'center',
    gap: 6,
  },
});
