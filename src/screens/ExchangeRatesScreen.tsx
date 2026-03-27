import React, {useState, useCallback} from 'react';
import {Platform, Pressable} from 'react-native';
import styled from 'styled-components/native';
import AppScreen from '../components/templates/AppScreen';
import ExchangeBoard from '../components/organisms/ExchangeBoard';
import DismissibleModal from '../components/organisms/DismissibleModal';
import {useExchangeRates} from '../hooks/useExchangeRates';
import {useSource} from '../context/SourceContext';
import {useTargetCurrency} from '../context/TargetCurrencyContext';
import {SOURCE_NAMES} from '../constants/sources';
import {textShadow} from '../theme/textShadows';

export type SortMode = 'default' | 'alphabetical' | 'highest' | 'lowest';

const ModalOverlay = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.overlay};
  justify-content: flex-start;
  align-items: flex-end;
  padding-top: 50px;
  padding-right: 16px;
`;

const MenuCard = styled.View`
  background-color: ${({theme}) => theme.colors.surfaceContainerHigh};
  border-radius: 8px;
  overflow: hidden;
  min-width: 200px;
`;

const MenuOption = styled.TouchableOpacity<{selected: boolean}>`
  padding: 14px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.divider};
`;

const MenuOptionText = styled.Text<{selected: boolean}>`
  font-size: 15px;
  color: ${({selected, theme}) =>
    selected ? theme.colors.primary : theme.colors.onSurface};
  font-weight: ${({selected}) => (selected ? 'bold' : 'normal')};
`;

const CheckMark = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colors.primary};
  margin-left: 12px;
`;

const SortButtonWrap = styled.View`
  background-color: ${({theme}) => theme.colors.embossBorder};
  border-width: 2px;
  border-color: #a0a0a0;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  margin-right: ${({theme}) => theme.spacing.md};
`;

const SortIcon = styled.Text`
  font-size: 28px;
  color: ${({theme}) => theme.colors.onSurface};
  margin-top: -3px;
  margin-left: -1px;
`;

const SORT_OPTIONS: {key: SortMode; label: string}[] = [
  {key: 'default', label: 'Default'},
  {key: 'alphabetical', label: 'Alphabetical'},
  {key: 'highest', label: 'Highest Rates'},
  {key: 'lowest', label: 'Lowest Rates'},
];

export default function ExchangeRatesScreen({navigation}: any) {
  const {source} = useSource();
  const {setTargetCode} = useTargetCurrency();
  const {data: rates, isLoading, error, dataUpdatedAt, refetch} = useExchangeRates();
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCurrencyPress = useCallback(
    (code: string) => {
      setTargetCode(code);
      navigation.navigate('Convert');
    },
    [setTargetCode, navigation],
  );

  const headerRight = useCallback(
    () => (
      <Pressable onPress={() => setMenuOpen(true)} hitSlop={8}>
        {({pressed}) =>
          Platform.OS === 'android' ? (
            <SortButtonWrap style={pressed ? {opacity: 0.6, backgroundColor: '#6b6565'} : undefined}>
              <SortIcon>{'\u2195'}</SortIcon>
            </SortButtonWrap>
          ) : (
            <SortIcon style={pressed ? {opacity: 0.5} : undefined}>{'\u2195'}</SortIcon>
          )
        }
      </Pressable>
    ),
    [],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({headerRight});
  }, [navigation, headerRight]);

  return (
    <AppScreen>
      <ExchangeBoard
        rates={rates ?? []}
        isLoading={isLoading}
        error={error}
        updatedAt={dataUpdatedAt}
        sortMode={sortMode}
        sourceName={SOURCE_NAMES[source]}
        onRefresh={refetch}
        onCurrencyPress={handleCurrencyPress}
      />

      <DismissibleModal visible={menuOpen} onClose={() => setMenuOpen(false)}>
        <ModalOverlay>
          <Pressable onPress={e => e.stopPropagation()}>
            <MenuCard>
              {SORT_OPTIONS.map(({key, label}) => (
                <MenuOption
                  key={key}
                  selected={sortMode === key}
                  onPress={() => {
                    setSortMode(key);
                    setMenuOpen(false);
                  }}>
                  <MenuOptionText selected={sortMode === key}>
                    {label}
                  </MenuOptionText>
                  {sortMode === key && <CheckMark>{'\u2713'}</CheckMark>}
                </MenuOption>
              ))}
            </MenuCard>
          </Pressable>
        </ModalOverlay>
      </DismissibleModal>
    </AppScreen>
  );
}