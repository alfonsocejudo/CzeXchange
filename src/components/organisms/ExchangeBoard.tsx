import React, {useMemo, useState} from 'react';
import {FlatList, ActivityIndicator, TextInput, Pressable} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import {ExchangeRate} from '../../types/exchangeRate';
import CurrencyRow from '../molecules/CurrencyRow';
import GlassPanel from './GlassPanel';
import Label from '../atoms/Label';
import {getCurrencyFlag} from '../../constants/flags';
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
  text-shadow-color: ${({theme}) => theme.colors.primaryGlow};
  text-shadow-offset: 0px 0px;
  text-shadow-radius: 4px;
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
  margin-left: ${({theme}) => theme.spacing.xs};
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

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.sm};
  color: ${({theme}) => theme.colors.primaryContainer};
`;

const SourceRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({theme}) => theme.spacing.xs};
`;

const SourceLabel = styled(Label)``;

const RefreshButton = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.sm};
  color: ${({theme}) => theme.colors.onSurfaceVariant};
  margin-left: ${({theme}) => theme.spacing.sm};
`;

interface ExchangeBoardProps {
  rates: ExchangeRate[];
  isLoading: boolean;
  error: Error | null;
  updatedAt?: number;
  sortMode?: SortMode;
  sourceName?: string;
  onRefresh?: () => void;
}

function sortRates(rates: ExchangeRate[], mode: SortMode): ExchangeRate[] {
  const sorted = [...rates];
  switch (mode) {
    case 'alphabetical':
      sorted.sort((a, b) => a.code.localeCompare(b.code));
      break;
    case 'highest':
      sorted.sort((a, b) => b.rate / b.amount - a.rate / a.amount);
      break;
    case 'lowest':
      sorted.sort((a, b) => a.rate / a.amount - b.rate / b.amount);
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
}: ExchangeBoardProps) {
  const theme = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sortedRates = useMemo(() => sortRates(rates, sortMode), [rates, sortMode]);

  const filteredRates = useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedRates;
    }
    const q = searchQuery.toLowerCase();
    return sortedRates.filter(
      r =>
        r.code.toLowerCase().includes(q) ||
        r.currency.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q),
    );
  }, [sortedRates, searchQuery]);

  if (isLoading) {
    return (
      <GlassPanel>
        <CenteredContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </CenteredContainer>
      </GlassPanel>
    );
  }

  if (error) {
    return (
      <GlassPanel>
        <CenteredContainer>
          <ErrorText>Failed to load rates</ErrorText>
        </CenteredContainer>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel>
      {sourceName && (
        <SourceRow>
          <SourceLabel>{sourceName}</SourceLabel>
          {onRefresh && (
            <Pressable onPress={onRefresh} hitSlop={8}>
              <RefreshButton>{'\u21BB'}</RefreshButton>
            </Pressable>
          )}
        </SourceRow>
      )}
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
        renderItem={({item}) => <CurrencyRow rate={item} />}
        indicatorStyle="white"
      />
    </GlassPanel>
  );
}
