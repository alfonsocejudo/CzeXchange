import React, {createContext, useContext, useState} from 'react';
import {Source} from '../types/exchangeRate';

interface SourceContextValue {
  source: Source;
  setSource: (source: Source) => void;
}

const SourceContext = createContext<SourceContextValue | undefined>(undefined);

export function SourceProvider({children}: {children: React.ReactNode}) {
  const [source, setSource] = useState<Source>('cnb');

  return (
    <SourceContext.Provider value={{source, setSource}}>
      {children}
    </SourceContext.Provider>
  );
}

export function useSource() {
  const context = useContext(SourceContext);
  if (!context) {
    throw new Error('useSource must be used within a SourceProvider');
  }
  return context;
}
