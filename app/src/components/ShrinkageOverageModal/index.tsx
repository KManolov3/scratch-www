import { Pressable, StyleSheet, View } from 'react-native';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { Row } from '@components/Row';
import { useCallback } from 'react';

export interface RemoveItemModalProps {
  isVisible: boolean;
  shrinkage: number;
  overage: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ShrinkageOverageModal({
  isVisible,
  shrinkage,
  overage,
  onConfirm,
  onCancel,
}: RemoveItemModalProps) {
  const formatPrice = useCallback((price: number) => `$${price}`, []);

  return (
    <Modal isVisible={isVisible} onBackdropPress={onCancel}>
      <>
        <Text style={[styles.text, styles.bold]}>
          Outage Shrinkage / Overage
        </Text>
        <Text style={styles.text}>
          This Outage will result in a change at retail of:
        </Text>
        <Row label="Shrinkage Dollars" value={formatPrice(shrinkage)} />
        <Row label="Overage Dollars" value={formatPrice(overage)} />
        <Row label="Net Dollars" value={`-$${Math.abs(overage - shrinkage)}`} />
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
  text: {
    marginVertical: 8,
  },
  bold: {
    fontWeight: FontWeight.Demi,
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
