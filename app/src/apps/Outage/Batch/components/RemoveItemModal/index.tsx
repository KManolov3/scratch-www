import { Pressable, StyleSheet, View } from 'react-native';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export interface RemoveItemModalProps {
  isVisible: boolean;
  activeItem?: {
    partDesc?: string | null;
    mfrPartNum?: string | null;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export function RemoveItemModal({
  isVisible,
  activeItem,
  onConfirm,
  onCancel,
}: RemoveItemModalProps) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onCancel}>
      <>
        <Text style={styles.confirmationText}>
          Are you sure you want to remove this item,
          <Text style={styles.productInformation}>
            {` ${activeItem?.partDesc} - ${activeItem?.mfrPartNum}`}
          </Text>
          , from the outage list?
        </Text>
        <Text>(You will no longer be reporting an outage for this item)</Text>
        <View style={styles.buttons}>
          <Pressable onPress={onCancel} style={styles.button}>
            <Text style={styles.buttonText}>No</Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            style={[styles.button, styles.confirmationButton]}>
            <Text style={styles.buttonText}>Yes</Text>
          </Pressable>
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({
  confirmationText: {
    fontWeight: FontWeight.Demi,
  },
  productInformation: {
    fontWeight: FontWeight.Demi,
    color: Colors.advanceRed,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  button: {
    flex: 1,
    borderRadius: 4,
    padding: 8,
    backgroundColor: Colors.lightGray,
  },
  confirmationButton: {
    marginLeft: 16,
    backgroundColor: Colors.advanceYellow,
  },
  buttonText: {
    fontWeight: FontWeight.Demi,
    textAlign: 'center',
  },
});
