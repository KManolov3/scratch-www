import { Pressable, View } from 'react-native';
import { Text } from '@components/Text';
import { DocumentType, gql } from 'src/__generated__';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { convertCurrencyToString } from '@lib/currency';
import { styles } from './styles';

export const OutageItemCardFragment = gql(`
  fragment OutageItemCard on Item {
    partDesc
    mfrPartNum
    sku
    retailPrice
    onHand
  }
`);

export interface OutageItemCardProps {
  outageItem: DocumentType<typeof OutageItemCardFragment>;
  active: boolean;
  onPress: () => void;
  removeItem: () => void;
}

export function OutageItemCard({
  outageItem,
  active,
  onPress,
  removeItem,
}: OutageItemCardProps) {
  const { partDesc, mfrPartNum, sku, retailPrice, onHand } = outageItem;

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{partDesc}</Text>

      <View style={styles.content}>
        <View style={styles.productInformation}>
          <ItemPropertyDisplay label="P/N" value={mfrPartNum ?? 'undefined'} />
          {active ? (
            <>
              <ItemPropertyDisplay
                label="SKU"
                value={sku ?? 'undefined'}
                style={styles.itemProperty}
              />
              <ItemPropertyDisplay
                label="Price:"
                value={
                  retailPrice
                    ? convertCurrencyToString(retailPrice)
                    : 'undefined'
                }
                style={styles.itemProperty}
              />
              <ItemPropertyDisplay
                label="Current:"
                value={onHand ?? 'undefined'}
                style={styles.itemProperty}
              />
            </>
          ) : null}
        </View>
        <View style={styles.quantityUpdate}>
          <View style={styles.quantityInformation}>
            <ItemPropertyDisplay
              label="Current"
              value={onHand ?? 'undefined'}
              style={styles.rowItem}
            />
            <ItemPropertyDisplay
              label="New"
              value={0}
              valueStyle={styles.zero}
            />
          </View>
          {active ? (
            <Pressable onPress={removeItem} style={styles.removeItem}>
              <Text style={styles.removeItemText}>Remove Item</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
