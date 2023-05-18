import { StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { Row } from '@components/Row';
import { DollarSignPosition, convertCurrencyToString } from '@lib/currency';
import { ActionModal } from '@components/ActionModal';
import { Text } from '@components/Text';

export interface ShrinkageOverageModalProps {
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
}: ShrinkageOverageModalProps) {
  return (
    <ActionModal
      isVisible={isVisible}
      title="Outage Shrinkage / Overage"
      onConfirm={onConfirm}
      onCancel={onCancel}>
      <Text style={styles.text}>
        This Outage will result in a change at retail of:
      </Text>

      <Row
        label="Shrinkage Dollars"
        value={convertCurrencyToString(shrinkage)}
      />
      <Row label="Overage Dollars" value={convertCurrencyToString(overage)} />

      <View style={styles.divider} />

      <Row
        label="Net Dollars"
        value={convertCurrencyToString(
          overage - shrinkage,
          DollarSignPosition.INFIX,
        )}
        valueStyle={styles.bold}
      />
    </ActionModal>
  );
}

const styles = StyleSheet.create({
  text: {
    marginVertical: 8,
  },
  bold: {
    fontWeight: FontWeight.Demi,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.darkGray,
    marginVertical: 8,
  },
});
