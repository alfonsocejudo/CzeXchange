import React, { createContext, useContext, useMemo, useState } from 'react';

interface TargetCurrencyContextValue {
  targetCode: string;
  setTargetCode: (code: string) => void;
}

const TargetCurrencyContext = createContext<
  TargetCurrencyContextValue | undefined
>(undefined);

export function TargetCurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [targetCode, setTargetCode] = useState('EUR');
  const value = useMemo(() => ({ targetCode, setTargetCode }), [targetCode]);

  return (
    <TargetCurrencyContext.Provider value={value}>
      {children}
    </TargetCurrencyContext.Provider>
  );
}

export function useTargetCurrency() {
  const context = useContext(TargetCurrencyContext);
  if (!context) {
    throw new Error(
      'useTargetCurrency must be used within a TargetCurrencyProvider',
    );
  }
  return context;
}
