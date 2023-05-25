import { Pressable, StyleSheet, View } from 'react-native';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { BlackAttentionIcon } from '@assets/icons';

export interface PrintConfirmationModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  quantity: number;
}

export function PrintConfirmationModal({
  isVisible,
  onConfirm,
  onCancel,
  quantity,
}: PrintConfirmationModalProps) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onCancel}>
      <View style={styles.headerSvg}>
        <BlackAttentionIcon height={40} width={40} />
      </View>
      <Text style={styles.header}>Quantity Confirmation</Text>
      <View style={styles.confirmationText}>
        <View style={styles.tagsInformation}>
          <Text style={styles.text}>Are you sure you want to print</Text>
        </View>
        <View style={styles.tagsInformation}>
          <Text style={styles.bold}>{quantity} front tags?</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Pressable onPress={onCancel} style={styles.button}>
          <Text style={styles.buttonText}>Edit Quantity</Text>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          style={[styles.button, styles.confirmationButton]}>
          <Text style={styles.buttonText}>Print {quantity} Tags</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  header: {
    fontWeight: FontWeight.Bold,
    marginTop: 12,
    marginBottom: 30,
    fontSize: 20,
    textAlign: 'center',
  },
  text: {
    color: Colors.black,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    fontWeight: FontWeight.Book,
  },
  tagsInformation: {
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    fontWeight: FontWeight.Bold,
    backgroundColor: Colors.lightGray,
  },
  confirmationButton: {
    backgroundColor: Colors.advanceYellow,
  },
  buttonText: {
    fontWeight: FontWeight.Demi,
    textAlign: 'center',
  },
  headerSvg: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  bold: { fontWeight: FontWeight.Bold },
  confirmationText: {
    padding: 16,
    marginBottom: 12,
  },
});
