import { StyleSheet, View } from 'react-native';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { BlackAttentionIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';

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
    <ConfirmationModal
      isVisible={isVisible}
      onConfirm={onConfirm}
      onCancel={onCancel}
      Icon={BlackAttentionIcon}
      title="Quantity Confirmation"
      cancellationLabel="Edit Quantity"
      confirmationLabel={`Print ${quantity} Tags`}
      iconStyles={styles.icon}>
      <View style={styles.confirmationText}>
        <View style={styles.tagsInformation}>
          <Text style={styles.text}>Are you sure you want to print</Text>
          <Text style={styles.bold}>{quantity} front tags?</Text>
        </View>
      </View>
    </ConfirmationModal>
  );
}
const styles = StyleSheet.create({
  text: {
    color: Colors.black,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    fontWeight: FontWeight.Book,
  },
  tagsInformation: {
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bold: { fontWeight: FontWeight.Bold },
  confirmationText: {
    padding: 16,
    marginBottom: 12,
  },
  icon: { marginTop: 30 },
  buttons: {
    marginBottom: 24,
  },
});
