import ReactNativeModal, {
  ModalProps as ReactNativeModalProps,
} from 'react-native-modal';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';

export type ModalProps = Partial<
  Omit<ReactNativeModalProps, 'backdropOpacity' | 'backdropColor'>
>;

export function Modal({ isVisible, children, style, ...rest }: ModalProps) {
  return (
    <ReactNativeModal
      isVisible={isVisible}
      style={[styles.modal, style]}
      statusBarTranslucent
      hardwareAccelerated
      {...rest}>
      <KeyboardAvoidingView
        behavior="padding"
        pointerEvents="box-none"
        style={styles.keyboardAvoidingView}>
        <View style={styles.container}>{children}</View>
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    backgroundColor: Colors.pure,
    padding: 8,
  },
  keyboardAvoidingView: { flex: 1, justifyContent: 'center' },
  modal: {
    margin: 8,
  },
});
