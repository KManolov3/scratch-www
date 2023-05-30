import { Pressable, View } from 'react-native';
import { Text } from '@components/Text';
import { DocumentType, gql } from 'src/__generated__';
import { convertCurrencyToString } from '@lib/currency';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { CrossIcon } from '@assets/icons';
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
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{partDesc}</Text>
        <Pressable onPress={removeItem} style={styles.removeItem}>
          <CrossIcon />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.productInformation}>
          <ItemPropertyDisplay
            label="Part Number"
            value={mfrPartNum ?? 'undefined'}
            style={styles.property}
          />
          {active ? (
            <>
              <ItemPropertyDisplay
                label="SKU"
                value={sku ?? 'undefined'}
                style={styles.property}
              />
              <ItemPropertyDisplay
                label="Price"
                value={
                  retailPrice
                    ? convertCurrencyToString(retailPrice)
                    : 'undefined'
                }
                style={styles.property}
              />
            </>
          ) : null}
        </View>
        <View style={styles.quantityUpdate}>
          <View style={styles.quantityInformation}>
            <ItemPropertyDisplay
              label="Current"
              value={onHand ?? 'undefined'}
              style={styles.property}
            />
            <ItemPropertyDisplay
              label="New"
              value={0}
              style={styles.property}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
