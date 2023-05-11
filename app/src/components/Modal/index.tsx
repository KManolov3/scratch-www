import ReactNativeModal, {
  ModalProps as ReactNativeModalProps,
} from 'react-native-modal';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';

export type ModalProps = Partial<
  Omit<ReactNativeModalProps, 'backdropOpacity' | 'backdropColor'>
> &
  Pick<ReactNativeModalProps, 'children' | 'isVisible'>;

export function Modal({ isVisible, children, ...rest }: ModalProps) {
  return (
    <ReactNativeModal isVisible={isVisible} {...rest}>
      <View style={styles.container}>{children}</View>
    </ReactNativeModal>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    backgroundColor: Colors.pure,
    padding: 16,
  },
});
