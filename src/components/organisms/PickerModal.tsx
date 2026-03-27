import React, { useCallback } from 'react';
import { FlatList, Pressable } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import Label from '../atoms/Label';
import DismissibleModal from './DismissibleModal';
import { useSearchFilter } from '../../hooks/useSearchFilter';
import { getCurrencyFlag } from '../../constants/flags';

const Overlay = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.overlay};
  justify-content: center;
  padding: 0px ${({ theme }) => theme.spacing.xl};
`;

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surfaceContainerHigh};
  border-radius: 12px;
  max-height: 400px;
  overflow: hidden;
`;

const Title = styled(Label)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 700;
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  padding-horizontal: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SearchInput = styled.TextInput`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.onSurface};
  background-color: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: 6px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin: 0px ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.sm};
`;

const OptionRow = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.divider};
`;

const OptionText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.onSurface};
  font-weight: bold;
`;

const EmptyText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textDisabled};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

interface PickerModalProps {
  visible: boolean;
  title: string;
  options: string[];
  onSelect: (option: string) => void;
  onClose: () => void;
}

export default function PickerModal({
  visible,
  title,
  options,
  onSelect,
  onClose,
}: PickerModalProps) {
  const theme = useTheme();
  const matchOption = useCallback(
    (o: string, q: string) => o.toLowerCase().includes(q),
    [],
  );
  const { query, setQuery, filtered } = useSearchFilter(options, matchOption);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const handleSelect = (option: string) => {
    setQuery('');
    onSelect(option);
  };

  return (
    <DismissibleModal visible={visible} onClose={handleClose}>
      <Overlay>
        <Pressable onPress={e => e.stopPropagation()}>
          <Card>
            <Title>{title}</Title>
            <SearchInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search..."
              placeholderTextColor={theme.colors.textDisabled}
              autoCorrect={false}
            />
            <FlatList
              data={filtered}
              keyExtractor={item => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <OptionRow onPress={() => handleSelect(item)}>
                  <OptionText>
                    {getCurrencyFlag(item)} {item}
                  </OptionText>
                </OptionRow>
              )}
              ListEmptyComponent={<EmptyText>No matches</EmptyText>}
            />
          </Card>
        </Pressable>
      </Overlay>
    </DismissibleModal>
  );
}
