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
import { QuantityAdjuster } from '@components/QuantityAdjuster';
import _ from 'lodash-es';
import { useMemo } from 'react';
import { AttentionIcon } from '@assets/icons';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { convertCurrencyToString } from '@lib/currency';

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
  togglePriceDiscrepancyModal?: () => void;
  quantityAdjustment?: {
    quantity: number;
    setNewQuantity: (newQty: number) => void;
  };
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}

function getBackstockQuantity(
  backstockSlots: DocumentType<
    typeof ITEM_INFO_HEADER_FIELDS
  >['backStockSlots'],
) {
  if (!backstockSlots) {
    return 0;
  }

  return _.chain(backstockSlots).compact().sumBy('qty').value();
}

// TODO: Rename this to a more suitable name
export function ItemInfoHeader({
  itemDetails,
  quantityAdjustment,
  hasPriceDiscrepancy,
  togglePriceDiscrepancyModal,
  style,
  itemStyle,
}: ItemInfoHeaderProps) {
  const backstockSlots = useMemo(
    () => getBackstockQuantity(itemDetails.backStockSlots),
    [itemDetails.backStockSlots],
  );

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
          value={
            itemDetails.retailPrice
              ? convertCurrencyToString(itemDetails.retailPrice)
              : 'undefined'
          }
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

        {quantityAdjustment && (
          <ItemPropertyDisplay
            style={[styles.itemProperties, itemStyle]}
            label="New Qty"
            value={quantityAdjustment.quantity}
          />
        )}
      </View>
      {quantityAdjustment && (
        <QuantityAdjuster
          quantity={quantityAdjustment.quantity}
          setQuantity={quantityAdjustment.setNewQuantity}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    paddingHorizontal: 8,
    paddingTop: 16,
    fontSize: 28,
    fontWeight: FontWeight.Bold,
    marginBottom: 12,
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
