import { Text } from '@components/Text';
import { FontWeight } from '@lib/font';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { DocumentType, gql } from 'src/__generated__';
import { useMemo } from 'react';
import { AttentionIcon } from '@assets/icons';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { convertCurrencyToString } from '@lib/currency';
import { getBackstockQuantity } from '@lib/common';

const ITEM_INFO_HEADER_FIELDS = gql(`
  fragment ItemInfoHeaderFields on Item {
    mfrPartNum
    sku
    retailPrice
    onHand
    partDesc
    backStockSlots {
      qty
    }
  }
`);

export type ItemDetailsInfo = NonNullable<
  DocumentType<typeof ITEM_INFO_HEADER_FIELDS>
>;

export interface ItemInfoHeaderProps {
  itemDetails: ItemDetailsInfo;
  hasPriceDiscrepancy?: boolean;
  frontTagPrice?: number;
  togglePriceDiscrepancyModal?: () => void;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}

export function ItemInfoHeader({
  itemDetails,
  hasPriceDiscrepancy,
  frontTagPrice,
  togglePriceDiscrepancyModal,
  style,
  itemStyle,
}: ItemInfoHeaderProps) {
  const backstockSlots = useMemo(
    () => getBackstockQuantity(itemDetails.backStockSlots),
    [itemDetails.backStockSlots],
  );

  const price = useMemo(() => {
    if (hasPriceDiscrepancy) {
      return frontTagPrice ? convertCurrencyToString(frontTagPrice) : undefined;
    }
    return itemDetails.retailPrice
      ? convertCurrencyToString(itemDetails.retailPrice)
      : 'undefined';
  }, [frontTagPrice, hasPriceDiscrepancy, itemDetails.retailPrice]);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title} accessibilityLabel="Product Title">
        {itemDetails.partDesc}
      </Text>

      <View style={styles.row}>
        <ItemPropertyDisplay
          style={[styles.itemProperties, itemStyle]}
          label="SKU"
          value={itemDetails.sku}
        />
        <ItemPropertyDisplay
          style={[styles.itemProperties, itemStyle]}
          label="Price"
          value={price}
          icon={
            hasPriceDiscrepancy ? (
              <Pressable onPress={togglePriceDiscrepancyModal}>
                <AttentionIcon />
              </Pressable>
            ) : undefined
          }
        />
      </View>

      <View style={styles.row}>
        <ItemPropertyDisplay
          style={[styles.itemProperties, itemStyle]}
          label="Part Number"
          value={itemDetails.mfrPartNum}
        />
      </View>

      <View style={styles.row}>
        <ItemPropertyDisplay
          style={[styles.itemProperties, itemStyle]}
          label="QOH"
          value={itemDetails.onHand}
        />
        <ItemPropertyDisplay
          style={[styles.itemProperties, itemStyle]}
          label="Backstock"
          value={backstockSlots}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    paddingHorizontal: 16,
    paddingTop: 8,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: FontWeight.Bold,
  },
  icon: { margin: 4 },
  row: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 8,
  },
  itemProperties: { flex: 1 },
});
