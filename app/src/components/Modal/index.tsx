import ReactNativeModal, {
  ModalProps as ReactNativeModalProps,
} from 'react-native-modal';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';

export type ModalProps = Partial<Omit<ReactNativeModalProps, 'backdropColor'>>;

export function Modal({ isVisible, children, style, ...rest }: ModalProps) {
  return (
    <ReactNativeModal
      isVisible={isVisible}
      style={[styles.modal, style]}
      {...rest}>
      <View style={styles.container}>{children}</View>
    </ReactNativeModal>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    backgroundColor: Colors.pure,
    padding: 8,
  },
  modal: {
    margin: 8,
  },
});
