import { Pressable, StyleSheet, View } from 'react-native';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { AttentionIcon } from '@assets/icons';

export interface PriceDiscrepancyModalModalProps {
  isVisible: boolean;
  scanned?: number;
  system?: number | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PriceDiscrepancyModal({
  isVisible,
  scanned,
  system,
  onConfirm,
  onCancel,
}: PriceDiscrepancyModalModalProps) {
  if (!scanned || !system) {
    return null;
  }

  return (
    <Modal isVisible={isVisible} onBackdropPress={onCancel}>
      <>
        <View style={styles.attention}>
          <AttentionIcon height={40} width={40} />
        </View>
        <Text style={styles.confirmationText}>Price Discrepancy Detected.</Text>
        <Text style={styles.informationText}>Print updated front tag</Text>
        <View style={styles.buttons}>
          <View style={styles.rowItem}>
            <Text>Scanned</Text>
            <Text style={styles.header}>${scanned}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text>System</Text>
            <Text style={styles.header}>${system}</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <Pressable onPress={onCancel} style={styles.button}>
            <Text style={styles.buttonText}>Close </Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            style={[styles.button, styles.confirmationButton]}>
            <Text style={styles.buttonText}>Print Front Tag</Text>
          </Pressable>
        </View>
      </>
    </Modal>
  );
}
const styles = StyleSheet.create({
  confirmationText: {
    fontWeight: FontWeight.Bold,
    marginTop: 12,
    fontSize: 20,
    textAlign: 'center',
  },
  informationText: {
    color: Colors.black,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    fontWeight: FontWeight.Book,
  },
  buttons: {
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
  row: { paddingLeft: 40, paddingRight: 40 },
  attention: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  rowItem: {
    flexDirection: 'column',
    padding: 16,
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.pure,
    borderRadius: 8,

    shadowColor: Colors.advanceVoid,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.16,
    elevation: 8,
  },
  header: { fontWeight: FontWeight.Bold, fontSize: 20 },
});
