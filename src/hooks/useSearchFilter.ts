import { useMemo, useState } from 'react';

export function useSearchFilter<T>(
  items: T[],
  match: (item: T, query: string) => boolean,
): { query: string; setQuery: (q: string) => void; filtered: T[] } {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return items;
    }
    const q = query.toLowerCase();
    return items.filter(item => match(item, q));
  }, [items, query, match]);

  return { query, setQuery, filtered };
}
