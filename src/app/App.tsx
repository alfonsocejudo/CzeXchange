import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components/native';
import { theme } from '../theme';
import { SourceProvider } from '../context/SourceContext';
import { TargetCurrencyProvider } from '../context/TargetCurrencyContext';
import BottomTabs from './navigation/BottomTabs';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SourceProvider>
          <TargetCurrencyProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <StatusBar barStyle="dark-content" />
                <BottomTabs />
              </NavigationContainer>
            </SafeAreaProvider>
          </TargetCurrencyProvider>
        </SourceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
