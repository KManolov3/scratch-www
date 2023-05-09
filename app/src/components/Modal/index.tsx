import RNModal, { ModalProps as RNModalProps } from 'react-native-modal';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';

export type ModalProps = Partial<
  Omit<RNModalProps, 'backdropOpacity' | 'backdropColor'>
> &
  Pick<RNModalProps, 'children' | 'isVisible'>;

export function Modal({ isVisible, children, ...rest }: ModalProps) {
  return (
    <RNModal isVisible={isVisible} {...rest}>
      <View style={styles.container}>{children}</View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    backgroundColor: Colors.pure,
    padding: 16,
  },
});
