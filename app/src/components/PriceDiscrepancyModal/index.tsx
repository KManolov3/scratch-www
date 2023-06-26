import { StyleSheet, View } from 'react-native';
import { AttentionIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { Text } from '@components/Text';
import { BaseStyles } from '@lib/baseStyles';
import { convertCurrencyToString } from '@lib/currency';

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
    <ConfirmationModal
      isVisible={isVisible}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmationLabel="Print Front Tag"
      Icon={AttentionIcon}
      iconStyles={styles.icon}
      title="Price Discrepancy Detected">
      <Text style={styles.informationText}>Print updated front tag</Text>
      <View style={styles.container}>
        <ItemPropertyDisplay
          style={styles.itemProperties}
          label="Scanned"
          value={convertCurrencyToString(scanned)}
        />
        <ItemPropertyDisplay
          style={styles.itemProperties}
          label="System"
          value={convertCurrencyToString(system)}
        />
      </View>
    </ConfirmationModal>
  );
}

const styles = StyleSheet.create({
  icon: { marginTop: 30 },
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
  itemProperties: {
    flex: 1,
    ...BaseStyles.shadow,
    padding: 12,
    borderRadius: 8,
  },
});
