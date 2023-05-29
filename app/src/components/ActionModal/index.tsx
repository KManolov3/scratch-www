import { Pressable, StyleSheet, View } from 'react-native';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { ReactNode } from 'react';

export interface ActionModalProps {
  isVisible: boolean;
  title?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export function ActionModal({
  isVisible,
  title,
  onConfirm,
  onCancel,
  children,
}: ActionModalProps) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onCancel}>
      <>
        {title ? <Text style={[styles.text, styles.bold]}>{title}</Text> : null}
        {children}
        <View style={styles.buttons}>
          <Pressable onPress={onCancel} style={styles.button}>
            <Text style={styles.buttonText}>No</Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            style={[styles.button, styles.confirmationButton]}>
            <Text style={styles.buttonText}>Yes</Text>
          </Pressable>
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({
  text: {
    marginVertical: 8,
  },
  bold: {
    fontWeight: FontWeight.Demi,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  button: {
    flex: 1,
    borderRadius: 4,
    padding: 8,
    backgroundColor: Colors.lightGray,
  },
  confirmationButton: {
    marginLeft: 16,
    backgroundColor: Colors.advanceYellow,
  },
  buttonText: {
    fontWeight: FontWeight.Demi,
    textAlign: 'center',
  },
});
