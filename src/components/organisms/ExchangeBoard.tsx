import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, Pressable} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import {ExchangeRate} from '../../types/exchangeRate';
import CurrencyRow from '../molecules/CurrencyRow';
import GlassPanel from './GlassPanel';
import Label from '../atoms/Label';
import {LoadingState, ErrorState} from '../molecules/LoadingErrorState';
import SourceTag from '../molecules/SourceTag';
import {getCurrencyFlag} from '../../constants/flags';
import {textShadow} from '../../theme/textShadows';
import {useSearchFilter} from '../../hooks/useSearchFilter';
import type {SortMode} from '../../screens/ExchangeRatesScreen';

const HeaderBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.surfaceContainerLow};
  padding: ${({theme}) => theme.spacing.sm} ${({theme}) => theme.spacing.md};
  border-radius: 4px;
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const HeaderLabel = styled(Label)`
  font-size: ${({theme}) => theme.fontSizes.xs};
  letter-spacing: 1px;
`;

const TimestampText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.sm};
  color: ${({theme}) => theme.colors.primary};
  font-weight: bold;
  margin-left: ${({theme}) => theme.spacing.sm};
  ${textShadow('primaryGlowSubtle')}
`;

const ColumnHeaders = styled.View`
  flex-direction: row;
  align-items: center;
  height: 28px;
  padding: 0px ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.sm};
`;

const ColumnLabel = styled(Label)`
  font-size: ${({theme}) => theme.fontSizes.sm};
  letter-spacing: 1px;
`;

const CurrencyColumn = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const SearchIcon = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.sm};
  color: ${({theme}) => theme.colors.onSurfaceVariant};
  margin-left: ${({theme}) => theme.spacing.sm};
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: ${({theme}) => theme.fontSizes.sm};
  color: ${({theme}) => theme.colors.onSurface};
  padding: 0px;
  margin-left: ${({theme}) => theme.spacing.sm};
`;

const RateColumn = styled.View`
  min-width: 76px;
  margin-left: ${({theme}) => theme.spacing.sm};
  align-items: flex-end;
  padding-right: ${({theme}) => theme.spacing.sm};
`;

interface ExchangeBoardProps {
  rates: ExchangeRate[];
  isLoading: boolean;
  error: Error | null;
  updatedAt?: number;
  sortMode?: SortMode;
  sourceName?: string;
  onRefresh?: () => void;
  onCurrencyPress?: (code: string) => void;
}

function sortRates(rates: ExchangeRate[], mode: SortMode): ExchangeRate[] {
  const sorted = [...rates];
  switch (mode) {
    case 'alphabetical':
      sorted.sort((a, b) => a.code.localeCompare(b.code));
      break;
    case 'highest':
      sorted.sort((a, b) => (b.amount ? b.rate / b.amount : 0) - (a.amount ? a.rate / a.amount : 0));
      break;
    case 'lowest':
      sorted.sort((a, b) => (a.amount ? a.rate / a.amount : 0) - (b.amount ? b.rate / b.amount : 0));
      break;
    default:
      sorted.sort((a, b) => {
        const aFlag = getCurrencyFlag(a.code) ? 0 : 1;
        const bFlag = getCurrencyFlag(b.code) ? 0 : 1;
        return aFlag - bFlag;
      });
      break;
  }
  return sorted;
}

function formatTimestamp(ms?: number): string {
  if (!ms) {
    return '--';
  }
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function ExchangeBoard({
  rates,
  isLoading,
  error,
  updatedAt,
  sortMode = 'default',
  sourceName,
  onRefresh,
  onCurrencyPress,
}: ExchangeBoardProps) {
  const theme = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  const sortedRates = useMemo(() => sortRates(rates, sortMode), [rates, sortMode]);

  const matchRate = useCallback(
    (r: ExchangeRate, q: string) =>
      r.code.toLowerCase().includes(q) ||
      r.currency.toLowerCase().includes(q) ||
      r.country.toLowerCase().includes(q),
    [],
  );
  const {query: searchQuery, setQuery: setSearchQuery, filtered: filteredRates} =
    useSearchFilter(sortedRates, matchRate);

  const renderCurrencyRow = useCallback(
    ({item}: {item: ExchangeRate}) => <CurrencyRow rate={item} onPress={onCurrencyPress} />,
    [onCurrencyPress],
  );

  if (isLoading) {
    return (
      <GlassPanel>
        <LoadingState />
      </GlassPanel>
    );
  }

  if (error) {
    return (
      <GlassPanel>
        <ErrorState />
      </GlassPanel>
    );
  }

  return (
    <GlassPanel>
      {sourceName && <SourceTag name={sourceName} onRefresh={onRefresh} />}
      <HeaderBar>
        <HeaderLabel>LAST UPDATED:</HeaderLabel>
        <TimestampText>{formatTimestamp(updatedAt)}</TimestampText>
      </HeaderBar>
      <ColumnHeaders>
        <CurrencyColumn>
          {searchOpen ? (
            <>
              <Pressable onPress={() => { setSearchOpen(false); setSearchQuery(''); }}>
                <SearchIcon>{'\u2715'}</SearchIcon>
              </Pressable>
              <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="SEARCH..."
                placeholderTextColor={theme.colors.textDisabled}
                autoFocus
              />
            </>
          ) : (
            <>
              <ColumnLabel>Currency</ColumnLabel>
              <Pressable onPress={() => setSearchOpen(true)} hitSlop={8}>
                <SearchIcon>{'\uD83D\uDD0D'}</SearchIcon>
              </Pressable>
            </>
          )}
        </CurrencyColumn>
        <RateColumn>
          <ColumnLabel>Rate</ColumnLabel>
        </RateColumn>
      </ColumnHeaders>
      <FlatList
        data={filteredRates}
        keyExtractor={item => item.code}
        renderItem={renderCurrencyRow}
        indicatorStyle="white"
      />
    </GlassPanel>
  );
}
