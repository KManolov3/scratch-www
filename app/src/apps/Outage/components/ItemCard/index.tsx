import { Pressable, View } from 'react-native';
import { Text } from '@components/Text';
import { DocumentType, gql } from 'src/__generated__';
import { convertCurrencyToString } from '@lib/currency';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { CrossIcon } from '@assets/icons';
import { BackstockSlotsInfo } from '@components/Locations/BackstockSlotList';
import { Seperator } from '@components/Seperator';
import { styles } from './styles';
import { WarningMessage } from '../WarningMessage';

function formatBackstockSlots(slots: BackstockSlotsInfo['backStockSlots']) {
  return `Slot: ${slots
    ?.map(slot => slot?.slotId?.toString())
    .filter(Boolean)
    .join(', ')}`;
}

export const OutageItemCardFragment = gql(`
  fragment OutageItemCard on Item {
    partDesc
    mfrPartNum
    sku
    retailPrice
    onHand
    backStockSlots {
      slotId
    }
  }
`);

export interface OutageItemCardProps {
  outageItem: DocumentType<typeof OutageItemCardFragment>;
  isLast?: boolean;
  removeItem?: () => void;
  flatten?: boolean;
}

export function OutageItemCard({
  outageItem,
  isLast,
  removeItem,
  flatten,
}: OutageItemCardProps) {
  const { partDesc, mfrPartNum, retailPrice, onHand } = outageItem;

  return (
    <View
      style={[
        styles.card,
        isLast && styles.lastCard,
        !flatten && styles.cardWithShadow,
      ]}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{partDesc}</Text>
        {removeItem ? (
          <Pressable onPress={removeItem} style={styles.removeItem}>
            <CrossIcon />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.content}>
        <ItemPropertyDisplay
          label="Part Number"
          value={mfrPartNum ?? 'undefined'}
          style={styles.property}
        />
        <ItemPropertyDisplay
          label="Price"
          value={
            retailPrice ? convertCurrencyToString(retailPrice) : 'undefined'
          }
          style={styles.property}
        />
        <ItemPropertyDisplay
          label="Current"
          value={onHand ?? 'undefined'}
          style={styles.property}
        />
        <ItemPropertyDisplay label="New" value={0} style={styles.property} />
      </View>
      {outageItem.backStockSlots?.length ? (
        <WarningMessage
          warningText={formatBackstockSlots(outageItem.backStockSlots)}
        />
      ) : (
        <Seperator />
      )}
      {removeItem ? (
        <Pressable onPress={removeItem} style={styles.removeItem}>
          <CrossIcon />
          <Text style={styles.removeItemText}>Remove Item</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
