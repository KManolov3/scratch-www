import { Pressable, StyleSheet, View } from 'react-native';
import { Modal } from '@components/Modal';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { convertCurrencyToString } from '@lib/currency';
import { Text } from '@components/Text';
import { AttentionIcon } from '@assets/icons';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';

export interface ShrinkageOverageModalProps {
  isVisible: boolean;
  shrinkage: number;
  overage: number;
  onConfirm: () => void;
  onCancel: () => void;
}

// TODO: Extract a common action modal component
export function ShrinkageOverageModal({
  isVisible,
  shrinkage,
  overage,
  onConfirm,
  onCancel,
}: ShrinkageOverageModalProps) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onCancel}>
      <View style={styles.attention}>
        <AttentionIcon height={40} width={40} />
      </View>
      <Text style={styles.confirmationText}>Shrinkage & Outage</Text>
      <Text style={styles.informationText}>
        This outage will result in a change at retail of:
      </Text>
      <View style={styles.container}>
        <ItemPropertyDisplay
          style={styles.itemProperties}
          label="Shrinkage"
          value={convertCurrencyToString(shrinkage)}
        />
        <ItemPropertyDisplay
          style={styles.itemProperties}
          label="Net Dollars"
          value={convertCurrencyToString(overage)}
        />
      </View>
      <View style={styles.container}>
        <Pressable onPress={onCancel} style={styles.button}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          style={[styles.button, styles.confirmationButton]}>
          <Text style={styles.buttonText}>Accept</Text>
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
    color: Colors.black,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    fontWeight: FontWeight.Book,
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
