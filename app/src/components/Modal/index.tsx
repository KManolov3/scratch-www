import ReactNativeModal, {
  ModalProps as ReactNativeModalProps,
} from 'react-native-modal';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';

export type ModalProps = Partial<
  Omit<ReactNativeModalProps, 'backdropOpacity' | 'backdropColor'>
> &
  Pick<ReactNativeModalProps, 'children' | 'isVisible'>;

export function Modal({ isVisible, children, style, ...rest }: ModalProps) {
  return (
    <ReactNativeModal isVisible={isVisible} style={styles.modal} {...rest}>
      <View style={[styles.container, style]}>{children}</View>
    </ReactNativeModal>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: Colors.pure,
    padding: 8,
  },
  modal: {
    margin: 8,
  },
});
