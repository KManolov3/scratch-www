import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import type Svg from 'react-native-svg';
import { BlockButton } from '@components/Button/Block';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export interface ConfirmationModalProps {
  isVisible: boolean;
  Icon?: typeof Svg;
  title?: string;
  confirmationLabel?: string;
  onConfirm: () => void;
  cancellationLabel?: string;
  confirmationButtonEnabled?: boolean;
  onCancel: () => void;
  children?: ReactNode;
  buttonsStyle?: StyleProp<ViewStyle>;
}

export function ConfirmationModal({
  isVisible,
  Icon,
  title,
  cancellationLabel = 'Cancel',
  onCancel,
  confirmationLabel = 'Accept',
  confirmationButtonEnabled = true,
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
        {Icon ? <Icon height={48} width={48} style={styles.icon} /> : null}
        {title ? <Text style={styles.title}>{title}</Text> : null}

        {children}

        <View style={[styles.controls, buttonsStyle]}>
          <BlockButton
            variant="gray"
            size="big"
            style={styles.button}
            onPress={onCancel}>
            {cancellationLabel}
          </BlockButton>

          <BlockButton
            variant="primary"
            size="big"
            style={styles.button}
            disabled={!confirmationButtonEnabled}
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
    marginTop: 24,
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
