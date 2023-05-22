import { Text } from '@components/Text';
import { FontWeight } from '@lib/font';
import { StyleSheet, View } from 'react-native';
import { DocumentType, gql } from 'src/__generated__';
import { Row } from '@components/Row';
import { QuantityAdjuster } from '@components/QuantityAdjuster';
import _ from 'lodash-es';
import { Colors } from '@lib/colors';

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
  quantityAdjustment?: {
    quantity: number;
    setNewQuantity: (newQty: number) => void;
  };
}

function getBackstockQuantity(
  backstockSlots: DocumentType<
    typeof ITEM_INFO_HEADER_FIELDS
  >['backStockSlots'],
) {
  if (!backstockSlots) {
    return 0;
  }

  return _.chain(backstockSlots)
    .compact()
    .map(({ qty }) => qty)
    .sum()
    .value();
}

export function ItemInfoHeader({
  itemDetails,
  quantityAdjustment,
}: ItemInfoHeaderProps) {
  // TODO: Show a price discrepancy modal, in case a front tag is scanned,
  // whose assigned price doesn't match the system price (returned from item lookup queries)

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityLabel="Product Title">
        {itemDetails.partDesc}
      </Text>
      <View style={styles.table}>
        <View style={styles.column}>
          <Row label="P/N:" value={itemDetails.mfrPartNum ?? 'undefined'} />
          <Row label="SKU:" value={itemDetails.sku ?? 'undefined'} />
          <Row
            label="Price:"
            value={`$${itemDetails.retailPrice ?? 'undefined'}`}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.column}>
          <Row label="Current:" value={itemDetails.onHand ?? 'undefined'} />
          <Row
            label="Bk Stk:"
            value={getBackstockQuantity(itemDetails.backStockSlots)}
          />
          {quantityAdjustment && (
            <Row label="New" value={quantityAdjustment.quantity} />
          )}
        </View>
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
    width: '100%',
  },
  title: {
    paddingHorizontal: 16,
    paddingTop: 10,
    fontSize: 20,
    fontWeight: FontWeight.Demi,
  },
  table: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    paddingHorizontal: 16,
  },
  separator: {
    width: 2,
    backgroundColor: Colors.darkGray,
  },
});
