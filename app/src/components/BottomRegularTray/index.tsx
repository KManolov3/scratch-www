import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { TrayIndicator } from '@assets/icons';
import { ModalProps } from '@components/Modal';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';

export type BottomRegularTrayProps = ModalProps & { hideTray(): void };

export function BottomRegularTray({
  isVisible,
  children,
  style,
  hideTray,
  ...rest
}: BottomRegularTrayProps) {
  return (
    <ReactNativeModal
      isVisible={isVisible}
      style={[styles.modal, style]}
      backdropOpacity={0}
      onBackdropPress={hideTray}
      onBackButtonPress={hideTray}
      {...rest}>
      <KeyboardAvoidingView
        behavior="padding"
        pointerEvents="box-none"
        style={styles.keyboardAvoidingView}>
        <View style={styles.container}>
          <View style={styles.tray}>
            <TrayIndicator width={48} height={4} />
          </View>
          {children}
        </View>
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    padding: 8,

    borderRadius: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Colors.pure,
    ...BaseStyles.shadow,
  },
  keyboardAvoidingView: { flex: 1, justifyContent: 'flex-end' },
  tray: {
    alignItems: 'center',
  },
});
