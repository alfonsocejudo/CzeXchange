import React, { useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
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

const Tab = createBottomTabNavigator();

const TAB_LABELS: Record<string, string> = {
  ExchangeRates: 'RATES',
  Convert: 'CONVERT',
  Settings: 'SETTINGS',
};

function IndustrialTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom + 12 }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const label = TAB_LABELS[route.name] ?? route.name;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={1}
            style={styles.tabButtonOuter}
          >
            <ImageBackground
              source={focused ? images.btnActive : images.btnInactive}
              style={styles.tabButtonImage}
              resizeMode="stretch"
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: focused
                      ? theme.colors.tabLabelActive
                      : theme.colors.tabLabelInactive,
                  },
                ]}
              >
                {label}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function HeaderTitle({
  children,
  style,
}: {
  children: React.ReactNode;
  style: object;
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
    (props: BottomTabBarProps) => <IndustrialTabBar {...props} />,
    [],
  );

  const renderHeaderTitle = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <HeaderTitle style={headerTitleStyle}>{children}</HeaderTitle>
    ),
    [headerTitleStyle],
  );

  return (
    <ImageBackground source={images.bg} style={styles.bg} resizeMode="cover">
      <Tab.Navigator
        tabBar={renderTabBar}
        screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTintColor: theme.colors.embossedText,
          headerTitle: renderHeaderTitle,
          sceneStyle: { backgroundColor: 'transparent' },
        }}
      >
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  tabButtonOuter: {
    flex: 1,
  },
  tabButtonImage: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
