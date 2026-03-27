import React from 'react';
import {View, TouchableOpacity, Text, ImageBackground, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ExchangeRatesScreen from '../../screens/ExchangeRatesScreen';
import ConvertScreen from '../../screens/ConvertScreen';
import SettingsScreen from '../../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TAB_LABELS: Record<string, string> = {
  ExchangeRates: 'RATES',
  Convert: 'CONVERT',
  Settings: 'SETTINGS',
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const btnActive = require('../../assets/images/btn_active.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const btnInactive = require('../../assets/images/btn_inactive.png');

function IndustrialTabBar({state, navigation}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, {paddingBottom: Math.max(insets.bottom, 12)}]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const label = TAB_LABELS[route.name] ?? route.name;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={1}
            style={styles.tabButtonOuter}>
            <ImageBackground
              source={focused ? btnActive : btnInactive}
              style={styles.tabButtonImage}
              resizeMode="stretch">
              <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                {label}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bgImage = require('../../assets/images/bg.png');

export default function BottomTabs() {
  return (
    <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
      <Tab.Navigator
        tabBar={props => <IndustrialTabBar {...props} />}
        screenOptions={{
          headerStyle: {backgroundColor: 'transparent', shadowColor: 'transparent'},
          headerTintColor: '#3a3535',
          headerTitle: ({children}) => (
            <Text style={styles.headerTitle}>{(children as string).toUpperCase()}</Text>
          ),
          sceneStyle: {backgroundColor: 'transparent'},
        }}>
        <Tab.Screen
          name="ExchangeRates"
          component={ExchangeRatesScreen}
          options={{title: 'Exchange Rates'}}
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
  headerTitle: {
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 3,
    color: '#6b6565',
    textShadowColor: 'rgba(255,255,255,0.6)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 0,
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
    color: '#c8c4bf',
    letterSpacing: 1.5,
  },
  tabLabelActive: {
    color: '#1a1a1a',
  },
});
