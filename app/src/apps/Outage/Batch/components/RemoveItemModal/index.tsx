import { StyleSheet } from 'react-native';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { ActionModal } from '@components/ActionModal';

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
    <ActionModal
      isVisible={isVisible}
      onConfirm={onConfirm}
      onCancel={onCancel}>
      <Text style={styles.confirmationText}>
        Are you sure you want to remove this item,
        <Text style={styles.productInformation}>
          {` ${activeItem?.partDesc} - ${activeItem?.mfrPartNum}`}
        </Text>
        , from the outage list?
      </Text>
      <Text>(You will no longer be reporting an outage for this item)</Text>
    </ActionModal>
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
});
