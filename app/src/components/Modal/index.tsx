import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import ReactNativeModal, {
  ModalProps as ReactNativeModalProps,
} from 'react-native-modal';
import { Colors } from '@lib/colors';

export type ModalProps = Partial<
  Omit<ReactNativeModalProps, 'backdropOpacity' | 'backdropColor'>
> &
  Pick<ReactNativeModalProps, 'children' | 'isVisible'>;

// TODO: useNativeDriver
// TODO: Remove content if not visible => make `children` a function
// TODO: https://github.com/react-native-modal/react-native-modal#the-modal-flashes-in-a-weird-way-when-animating
export function Modal({ isVisible, children, style, ...rest }: ModalProps) {
  return (
    <ReactNativeModal
      isVisible={isVisible}
      style={[styles.modal, style]}
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
    borderRadius: 8,
    backgroundColor: Colors.pure,
    padding: 8,
  },
  keyboardAvoidingView: { flex: 1, justifyContent: 'center' },
  modal: {
    margin: 8,
  },
});
