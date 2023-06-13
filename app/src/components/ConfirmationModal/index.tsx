import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { ReactNode } from 'react';
import { SvgType } from '*.svg';

export interface ConfirmationModalProps {
  isVisible: boolean;
  Icon?: SvgType;
  title?: string;
  confirmationLabel?: string;
  onConfirm: () => void;
  cancellationLabel?: string;
  onCancel: () => void;
  children?: ReactNode;
  iconStyles?: StyleProp<ViewStyle>;
  buttonsStyle?: StyleProp<ViewStyle>;
}

export function ConfirmationModal({
  isVisible,
  Icon,
  iconStyles,
  title,
  cancellationLabel = 'Cancel',
  onCancel,
  confirmationLabel = 'Accept',
  onConfirm,
  buttonsStyle,
  children,
}: ConfirmationModalProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      style={styles.modal}>
      <>
        {Icon ? (
          <Icon height={40} width={40} style={[styles.icon, iconStyles]} />
        ) : null}
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {children}
        <View style={[styles.buttons, buttonsStyle]}>
          <Pressable onPress={onCancel} style={styles.button}>
            <Text style={styles.buttonText}>{cancellationLabel}</Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            style={[styles.button, styles.confirmationButton]}>
            <Text style={styles.buttonText}>{confirmationLabel}</Text>
          </Pressable>
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    paddingTop: 29,
    paddingHorizontal: 8,
    paddingBottom: 22,
  },
  icon: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: FontWeight.Bold,
    color: Colors.darkerGray,
    marginBottom: 3,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  button: {
    flex: 1,
    borderRadius: 4,
    padding: 12,
    backgroundColor: Colors.gray100,
  },
  confirmationButton: {
    backgroundColor: Colors.advanceYellow,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FontWeight.Bold,
    textAlign: 'center',
    color: Colors.darkerGray,
  },
});
