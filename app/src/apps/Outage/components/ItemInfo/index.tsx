import { View } from 'react-native';
import { DocumentType, gql } from 'src/__generated__';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { Text } from '@components/Text';
import { convertCurrencyToString } from '@lib/currency';
import { WarningMessage } from '../WarningMessage';
import { styles } from './styles';

function formatBackstockSlots(slots: OutageItem['backStockSlots']) {
  return `Slot: ${slots
    ?.map(slot => slot?.slotName?.toString())
    .filter(Boolean)
    .join(', ')}`;
}

const OUTAGE_ITEM_INFO_FIELDS = gql(`
  fragment OutageItemInfoFields on Item {
    partDesc
    mfrPartNum
    sku
    retailPrice
    onHand
    backStockSlots {
      slotName
    }
  }
`);

type OutageItem = DocumentType<typeof OUTAGE_ITEM_INFO_FIELDS>;

export interface OutageItemInfoProps {
  outageItem: OutageItem;
}

export function OutageItemInfo({ outageItem }: OutageItemInfoProps) {
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
