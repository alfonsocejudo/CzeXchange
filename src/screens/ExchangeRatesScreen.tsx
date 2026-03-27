import React, {useState, useCallback} from 'react';
import {Pressable, Modal, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import AppScreen from '../components/templates/AppScreen';
import ExchangeBoard from '../components/organisms/ExchangeBoard';
import {useExchangeRates} from '../hooks/useExchangeRates';

export type SortMode = 'default' | 'alphabetical' | 'highest' | 'lowest';

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
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
  border-bottom-color: rgba(255, 255, 255, 0.05);
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

const SortButton = styled.Text`
  font-size: 11px;
  font-weight: 800;
  color: #6b6565;
  letter-spacing: 2px;
  padding: 6px 10px;
  text-shadow-color: rgba(255, 255, 255, 0.6);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 0px;
`;

const SORT_OPTIONS: {key: SortMode; label: string}[] = [
  {key: 'default', label: 'Default'},
  {key: 'alphabetical', label: 'Alphabetical'},
  {key: 'highest', label: 'Highest Rates'},
  {key: 'lowest', label: 'Lowest Rates'},
];

export default function ExchangeRatesScreen({navigation}: any) {
  const {data: rates, isLoading, error, dataUpdatedAt} = useExchangeRates();
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRight = useCallback(
    () => (
      <Pressable onPress={() => setMenuOpen(true)} hitSlop={8}>
        <SortButton>SORT</SortButton>
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
      />

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.flex} onPress={() => setMenuOpen(false)}>
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
        </Pressable>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
