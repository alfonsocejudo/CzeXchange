import React from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';

interface DismissibleModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function DismissibleModal({
  visible,
  onClose,
  children,
}: DismissibleModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.flex} onPress={onClose}>
        {children}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
