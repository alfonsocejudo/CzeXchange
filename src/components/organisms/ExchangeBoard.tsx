import React from 'react';
import {FlatList, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {ExchangeRate} from '../../types/exchangeRate';
import CurrencyRow from '../molecules/CurrencyRow';

const BoardEmboss = styled.View`
  flex: 1;
  border-radius: 16px;
  border-width: 4px;
  border-color: #8a8785;
`;

const BoardWrapper = styled.View`
  flex: 1;
  border-radius: 13px;
  overflow: hidden;
`;

const BoardContent = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.surfaceContainerLowest};
  padding: ${({theme}) => theme.spacing.md};
`;

const ShimmerOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ShimmerBand = styled.View`
  position: absolute;
  top: -20%;
  left: -50%;
  width: 70%;
  height: 160%;
  background-color: rgba(255, 255, 255, 0.03);
  transform: rotate(25deg);
`;

const ShimmerEdge = styled.View`
  position: absolute;
  top: -20%;
  left: 19%;
  width: 2px;
  height: 160%;
  background-color: rgba(255, 255, 255, 0.08);
  transform: rotate(25deg);
`;

const HeaderBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.surfaceContainerLow};
  padding: ${({theme}) => theme.spacing.sm} ${({theme}) => theme.spacing.md};
  border-radius: 4px;
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const HeaderLabel = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xs};
  color: ${({theme}) => theme.colors.onSurfaceVariant};
  letter-spacing: 1px;
`;

const TimestampText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.sm};
  color: ${({theme}) => theme.colors.primary};
  font-weight: bold;
  margin-left: ${({theme}) => theme.spacing.sm};
  text-shadow-color: rgba(255, 180, 170, 0.4);
  text-shadow-offset: 0px 0px;
  text-shadow-radius: 4px;
`;

const ColumnHeaders = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0px ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.sm};
`;

const ColumnLabel = styled.Text`
  font-size: 11px;
  color: ${({theme}) => theme.colors.onSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CurrencyColumn = styled.View`
  flex: 1;
`;

const RateColumn = styled.View`
  min-width: 76px;
  margin-left: ${({theme}) => theme.spacing.sm};
  align-items: flex-end;
  padding-right: 10px;
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

interface ExchangeBoardProps {
  rates: ExchangeRate[];
  isLoading: boolean;
  error: Error | null;
  updatedAt?: number;
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
}: ExchangeBoardProps) {
  if (isLoading) {
    return (
      <BoardEmboss><BoardWrapper>
        <BoardContent>
          <CenteredContainer>
            <ActivityIndicator color="#ffb4aa" size="large" />
          </CenteredContainer>
        </BoardContent>
        <ShimmerOverlay pointerEvents="none">
          <ShimmerBand />
          <ShimmerEdge />
        </ShimmerOverlay>
      </BoardWrapper></BoardEmboss>
    );
  }

  if (error) {
    return (
      <BoardEmboss><BoardWrapper>
        <BoardContent>
          <CenteredContainer>
            <ErrorText>Failed to load rates</ErrorText>
          </CenteredContainer>
        </BoardContent>
        <ShimmerOverlay pointerEvents="none">
          <ShimmerBand />
          <ShimmerEdge />
        </ShimmerOverlay>
      </BoardWrapper></BoardEmboss>
    );
  }

  return (
    <BoardEmboss>
      <BoardWrapper>
        <BoardContent>
          <HeaderBar>
            <HeaderLabel>LAST UPDATED:</HeaderLabel>
            <TimestampText>{formatTimestamp(updatedAt)}</TimestampText>
          </HeaderBar>
          <ColumnHeaders>
            <CurrencyColumn>
              <ColumnLabel>Currency</ColumnLabel>
            </CurrencyColumn>
            <RateColumn>
              <ColumnLabel>Rate</ColumnLabel>
            </RateColumn>
          </ColumnHeaders>
          <FlatList
            data={rates}
            keyExtractor={item => item.code}
            renderItem={({item}) => <CurrencyRow rate={item} />}
            indicatorStyle="white"
          />
        </BoardContent>
        <ShimmerOverlay pointerEvents="none">
          <ShimmerBand />
          <ShimmerEdge />
        </ShimmerOverlay>
      </BoardWrapper>
    </BoardEmboss>
  );
}
