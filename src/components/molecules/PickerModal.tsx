import React from 'react';
import {Modal, FlatList, Pressable, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import Label from '../atoms/Label';

const Overlay = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.overlay};
  justify-content: center;
  padding: 0px ${({theme}) => theme.spacing.xl};
`;

const Card = styled.View`
  background-color: ${({theme}) => theme.colors.surfaceContainerHigh};
  border-radius: 12px;
  max-height: 400px;
  overflow: hidden;
`;

const Title = styled(Label)`
  font-size: ${({theme}) => theme.fontSizes.sm};
  font-weight: 700;
  text-align: center;
  padding: ${({theme}) => theme.spacing.md};
`;

const OptionRow = styled.TouchableOpacity`
  padding: ${({theme}) => theme.spacing.sm} ${({theme}) => theme.spacing.lg};
  border-top-width: 1px;
  border-top-color: ${({theme}) => theme.colors.divider};
`;

const OptionText = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.colors.onSurface};
  font-weight: bold;
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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.flex} onPress={onClose}>
        <Overlay>
          <Pressable onPress={e => e.stopPropagation()}>
            <Card>
              <Title>{title}</Title>
              <FlatList
                data={options}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <OptionRow onPress={() => onSelect(item)}>
                    <OptionText>{item}</OptionText>
                  </OptionRow>
                )}
              />
            </Card>
          </Pressable>
        </Overlay>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
