import { Pressable, StyleSheet, View } from 'react-native';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { AttentionIcon } from '@assets/icons';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { formatPrice } from '@lib/formatPrice';

export interface PriceDiscrepancyModalModalProps {
  isVisible: boolean;
  scanned: number;
  system: number;
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
  return (
    <Modal isVisible={isVisible} onBackdropPress={onCancel}>
      <View style={styles.attention}>
        <AttentionIcon height={40} width={40} />
      </View>
      <Text style={styles.confirmationText}>Price Discrepancy Detected.</Text>
      <Text style={styles.informationText}>Print updated front tag</Text>
      <View style={styles.container}>
        <ItemPropertyDisplay
          style={styles.itemProperties}
          label="Scanned"
          value={formatPrice(scanned)}
        />
        <ItemPropertyDisplay
          style={styles.itemProperties}
          label="System"
          value={formatPrice(system)}
        />
      </View>
      <View style={styles.container}>
        <Pressable onPress={onCancel} style={styles.button}>
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          style={[styles.button, styles.confirmationButton]}>
          <Text style={styles.buttonText}>Print Front Tag</Text>
        </Pressable>
      </View>
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
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
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
  attention: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  itemProperties: {
    flex: 1,
  },
});
