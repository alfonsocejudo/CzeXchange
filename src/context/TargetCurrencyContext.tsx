import React, {createContext, useContext, useState} from 'react';

interface TargetCurrencyContextValue {
  targetCode: string;
  setTargetCode: (code: string) => void;
}

const TargetCurrencyContext = createContext<TargetCurrencyContextValue | undefined>(undefined);

export function TargetCurrencyProvider({children}: {children: React.ReactNode}) {
  const [targetCode, setTargetCode] = useState('EUR');

  return (
    <TargetCurrencyContext.Provider value={{targetCode, setTargetCode}}>
      {children}
    </TargetCurrencyContext.Provider>
  );
}

export function useTargetCurrency() {
  const context = useContext(TargetCurrencyContext);
  if (!context) {
    throw new Error('useTargetCurrency must be used within a TargetCurrencyProvider');
  }
  return context;
}
