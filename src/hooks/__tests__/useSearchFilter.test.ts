import { renderHook, act } from '@testing-library/react-native';
import { useSearchFilter } from '../useSearchFilter';

const items = ['Apple', 'Banana', 'Cherry', 'Date'];
const match = (item: string, q: string) => item.toLowerCase().includes(q);

it('returns all items when query is empty', () => {
  const { result } = renderHook(() => useSearchFilter(items, match));
  expect(result.current.filtered).toEqual(items);
});

it('filters items by query', () => {
  const { result } = renderHook(() => useSearchFilter(items, match));
  act(() => result.current.setQuery('an'));
  expect(result.current.filtered).toEqual(['Banana']);
});

it('returns empty array when nothing matches', () => {
  const { result } = renderHook(() => useSearchFilter(items, match));
  act(() => result.current.setQuery('xyz'));
  expect(result.current.filtered).toEqual([]);
});

it('restores full list when query is cleared', () => {
  const { result } = renderHook(() => useSearchFilter(items, match));
  act(() => result.current.setQuery('ch'));
  expect(result.current.filtered).toEqual(['Cherry']);
  act(() => result.current.setQuery(''));
  expect(result.current.filtered).toEqual(items);
});

it('ignores whitespace-only query', () => {
  const { result } = renderHook(() => useSearchFilter(items, match));
  act(() => result.current.setQuery('   '));
  expect(result.current.filtered).toEqual(items);
});

it('works with object items and custom match', () => {
  const rates = [
    { code: 'USD', country: 'USA' },
    { code: 'EUR', country: 'EMU' },
    { code: 'GBP', country: 'United Kingdom' },
  ];
  const matchRate = (r: (typeof rates)[0], q: string) =>
    r.code.toLowerCase().includes(q) || r.country.toLowerCase().includes(q);

  const { result } = renderHook(() => useSearchFilter(rates, matchRate));
  act(() => result.current.setQuery('united'));
  expect(result.current.filtered).toEqual([
    { code: 'GBP', country: 'United Kingdom' },
  ]);
});
