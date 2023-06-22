import { View } from 'react-native';
import { Text } from '@components/Text';
import { DocumentType, gql } from 'src/__generated__';
import { convertCurrencyToString } from '@lib/currency';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { BackstockSlotsInfo } from '@components/Locations/BackstockSlotList';
import { styles } from './styles';
import { WarningMessage } from '../WarningMessage';

function formatBackstockSlots(slots: BackstockSlotsInfo['backStockSlots']) {
  return `Slot: ${slots
    ?.map(slot => slot?.slotId?.toString())
    .filter(Boolean)
    .join(', ')}`;
}

export const OutageItemInfoFragment = gql(`
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
  outageItem: DocumentType<typeof OutageItemInfoFragment>;
}

export function OutageItemInfo({ outageItem }: OutageItemCardProps) {
  const { partDesc, mfrPartNum, retailPrice, onHand } = outageItem;

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{partDesc}</Text>
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

      {outageItem?.backStockSlots?.length ? (
        <WarningMessage
          warningText={formatBackstockSlots(outageItem.backStockSlots)}
        />
      ) : null}
    </View>
  );
}
