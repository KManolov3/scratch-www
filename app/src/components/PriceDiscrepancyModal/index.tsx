import { Pressable, StyleSheet, View } from 'react-native';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { Row } from '@components/Row';

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
        <Text style={styles.confirmationText}>Price Discrepancy Detected.</Text>
        <Text style={styles.informationText}>
          Press &quot;Print&quot; to get updated front tags.
        </Text>
        <Row containerStyle={styles.row} label="Scanned" value={scanned} />
        <Row containerStyle={styles.row} label="System" value={system} />
        <View style={styles.buttons}>
          <Pressable onPress={onCancel} style={styles.button}>
            <Text style={styles.buttonText}>Close </Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            style={[styles.button, styles.confirmationButton]}>
            <Text style={styles.buttonText}>Print</Text>
          </Pressable>
        </View>
      </>
    </Modal>
  );
}
const styles = StyleSheet.create({
  confirmationText: {
    fontWeight: FontWeight.Demi,
    marginTop: 10,
    marginBottom: 10,
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
  row: { paddingLeft: 40, paddingRight: 40 },
  informationText: {
    color: Colors.lightVoid,
  },
});
