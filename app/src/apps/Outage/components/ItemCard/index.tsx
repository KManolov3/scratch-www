import { Pressable, View } from 'react-native';
import { BlackCrossIcon } from '@assets/icons';
import { Separator } from '@components/Separator';
import { Text } from '@components/Text';
import { OutageItemInfo, OutageItemInfoProps } from '../ItemInfo';
import { styles } from './styles';

export interface OutageItemCardProps {
  outageItem: OutageItemInfoProps['outageItem'];
  isLast?: boolean;
  onRemove?: () => void;
}

export function OutageItemCard({
  outageItem,
  isLast,
  onRemove,
}: OutageItemCardProps) {
  return (
    <View style={[styles.card, isLast && styles.lastCard]}>
      <OutageItemInfo outageItem={outageItem} />

      {!outageItem.backStockSlots?.length && <Separator />}

      {onRemove ? (
        <Pressable onPress={onRemove} style={styles.removeItemButton}>
          <BlackCrossIcon />
          <Text style={styles.removeItemText}>Remove Item</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
