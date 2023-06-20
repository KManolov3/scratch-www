import { StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { Text } from '@components/Text';
import { BlackAttentionIcon } from '@assets/icons';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { ItemDetailsInfo } from '@components/ItemInfoHeader';
import { OutageItemInfo } from '../ItemInfo';

export interface BackstockWarningModalProps {
  isVisible: boolean;
  item?: ItemDetailsInfo;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BackstockWarningModal({
  isVisible,
  item,
  onConfirm,
  onCancel,
}: BackstockWarningModalProps) {
  return (
    <ConfirmationModal
      isVisible={isVisible}
      Icon={BlackAttentionIcon}
      title="Backstock"
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmationLabel="Add to Outage">
      <Text style={styles.informationText}>
        This item has quantity assigned to a backstock slot. Backstock slot will
        also be cleared.
      </Text>
      {item && <OutageItemInfo outageItem={item} />}
    </ConfirmationModal>
  );
}

const styles = StyleSheet.create({
  informationText: {
    color: Colors.black,
    textAlign: 'center',
    alignSelf: 'center',
    lineHeight: 24,
    fontSize: 16,
    fontWeight: FontWeight.Book,
  },
});
