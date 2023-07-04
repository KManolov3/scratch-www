import { ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import type Svg from 'react-native-svg';
import { BlockButton } from '@components/Button/Block';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export interface ConfirmationModalProps {
  isVisible: boolean;
  Icon?: typeof Svg;
  iconStyles?: StyleProp<ViewStyle>;
  title?: string;
  confirmationLabel?: string;
  onConfirm: () => void;
  cancellationLabel?: string;
  confirmationEnabled?: boolean;
  onCancel: () => void;
  children?: ReactNode;
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
  confirmationEnabled = true,
  onConfirm,
  buttonsStyle,
  children,
}: ConfirmationModalProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      style={styles.modal}>
      <View style={styles.container}>
        {Icon ? (
          <Icon height={40} width={40} style={[styles.icon, iconStyles]} />
        ) : null}
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {children}
        <View style={[styles.controls, buttonsStyle]}>
          <BlockButton
            variant="secondary"
            style={styles.button}
            onPress={onCancel}>
            {cancellationLabel}
          </BlockButton>
          <BlockButton
            variant="primary"
            style={styles.button}
            disabled={!confirmationEnabled}
            onPress={onConfirm}>
            {confirmationLabel}
          </BlockButton>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    paddingTop: 29,
    paddingHorizontal: 8,
    paddingBottom: 22,
  },
  container: {
    paddingTop: 20,
    paddingBottom: 10,
    // TODO: Find out why the outer part of the modal is not the specified background color here
    backgroundColor: Colors.pure,
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
  controls: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  button: {
    flex: 1,
  },
  // button: {
  //   flex: 1,
  //   borderRadius: 4,
  //   padding: 12,
  //   backgroundColor: Colors.gray100,
  // },
  // confirmationButton: {
  //   backgroundColor: Colors.advanceYellow,
  // },
  // buttonText: {
  //   fontSize: 16,
  //   lineHeight: 24,
  //   fontWeight: FontWeight.Bold,
  //   textAlign: 'center',
  //   color: Colors.darkerGray,
  // },
});
