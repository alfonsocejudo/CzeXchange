import React, { createContext, useContext, useMemo, useState } from 'react';
import { Source } from '../types/exchangeRate';

interface SourceContextValue {
  source: Source;
  setSource: (source: Source) => void;
}

const SourceContext = createContext<SourceContextValue | undefined>(undefined);

export function SourceProvider({ children }: { children: React.ReactNode }) {
  // We can use AsyncStorage to persist in a real production app
  const [source, setSource] = useState<Source>('cnb');
  const value = useMemo(() => ({ source, setSource }), [source]);

  return (
    <SourceContext.Provider value={value}>{children}</SourceContext.Provider>
  );
}

export function useSource() {
  const context = useContext(SourceContext);
  if (!context) {
    throw new Error('useSource must be used within a SourceProvider');
  }
  return context;
}
