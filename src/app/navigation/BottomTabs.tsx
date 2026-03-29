import React, { useCallback, useMemo } from 'react';
import {
  View,
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
import { useTheme } from 'styled-components/native';
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

// --- Tab Icon Components ---

type IconProps = { color: string; size: number };

function RatesIcon({ color, size }: IconProps) {
  const barH = Math.max(1.5, size * 0.07);
  const knobW = size * 0.14;
  const knobH = size * 0.2;
  const positions = [0.25, 0.7, 0.45, 0.2];

  return (
    <View style={{ width: size, height: size, justifyContent: 'space-evenly' }}>
      {positions.map((pos, i) => (
        <View
          key={i}
          style={{ flexDirection: 'row', alignItems: 'center', height: knobH }}
        >
          <View style={{ flex: pos, height: barH, backgroundColor: color }} />
          <View
            style={{
              width: knobW,
              height: knobH,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />
          <View
            style={{ flex: 1 - pos, height: barH, backgroundColor: color }}
          />
        </View>
      ))}
    </View>
  );
}

function ConvertIcon({ color, size }: IconProps) {
  const bw = Math.max(1.5, size * 0.08);
  const rectSize = size * 0.52;
  const offset = size * 0.32;

  return (
    <View style={{ width: size, height: size }}>
      {/* Back rectangle */}
      <View
        style={{
          position: 'absolute',
          left: size * 0.05,
          top: size * 0.05,
          width: rectSize,
          height: rectSize,
          borderWidth: bw,
          borderColor: color,
        }}
      />
      {/* Front rectangle */}
      <View
        style={{
          position: 'absolute',
          left: size * 0.05 + offset,
          top: size * 0.05 + offset,
          width: rectSize,
          height: rectSize,
          borderWidth: bw,
          borderColor: color,
        }}
      />
      {/* Arrow indicator */}
      <View
        style={{
          position: 'absolute',
          right: size * 0.08,
          bottom: size * 0.18,
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.1,
          borderTopWidth: size * 0.07,
          borderBottomWidth: size * 0.07,
          borderLeftColor: color,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
        }}
      />
    </View>
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
    <View style={{ width: size, height: size }}>
      {/* Gear teeth */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: center + r * Math.cos(angle) - toothSize / 2,
              top: center + r * Math.sin(angle) - toothSize / 2,
              width: toothSize,
              height: toothSize,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />
        );
      })}
      {/* Ring */}
      <View
        style={{
          position: 'absolute',
          left: center - ringD / 2,
          top: center - ringD / 2,
          width: ringD,
          height: ringD,
          borderRadius: ringD / 2,
          borderWidth: bw,
          borderColor: color,
        }}
      />
      {/* Center dot */}
      <View
        style={{
          position: 'absolute',
          left: center - dotD / 2,
          top: center - dotD / 2,
          width: dotD,
          height: dotD,
          borderRadius: dotD / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

const TAB_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  ExchangeRates: props => <RatesIcon {...props} />,
  Convert: props => <ConvertIcon {...props} />,
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
        <View
          style={[
            styles.iconContainer,
            focused && {
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 8,
            },
          ]}
        >
          {Icon && Icon({ color, size: 22 })}
        </View>
        <Text
          style={[
            styles.tabLabel,
            { color },
            focused && textShadowStyle(theme.textShadows.tabActiveGlow),
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom + 2 }]}>
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
    </View>
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
    [theme],
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
  iconContainer: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
  },
});
