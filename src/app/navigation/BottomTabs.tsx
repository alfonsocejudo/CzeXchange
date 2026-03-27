import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ExchangeRatesScreen from '../../screens/ExchangeRatesScreen';
import ConvertScreen from '../../screens/ConvertScreen';
import SettingsScreen from '../../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ExchangeRates"
        component={ExchangeRatesScreen}
        options={{title: 'Exchange Rates'}}
      />
      <Tab.Screen name="Convert" component={ConvertScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
