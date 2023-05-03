import { Text } from '@components/Text';
import { FontWeight } from '@lib/font';
import { StyleSheet, View } from 'react-native';
import { DocumentType, gql } from 'src/__generated__';
import { Row } from '@components/Row';
import { QuantityAdjuster } from '@components/QuantityAdjuster';
import _ from 'lodash-es';
import { Colors } from '@lib/colors';
import { useState } from 'react';

export const ITEM_INFO_HEADER_FIELDS = gql(`
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

export interface ItemInfoHeaderProps {
  itemDetails: NonNullable<DocumentType<typeof ITEM_INFO_HEADER_FIELDS>>;
  withQuantityAdjustment?: boolean;
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
    .compact()
    .reduce((totalQty, currQty) => totalQty + currQty, 0)
    .value();
}

export function ItemInfoHeader({
  itemDetails,
  withQuantityAdjustment = false,
}: ItemInfoHeaderProps) {
  // TODO: Manage this through the app context. Requirements:
  // 1) It should be incremented whenever a UPC is scanned.
  // 2) It should be able to be modifnewQuantityed through the QuantityAdjuster component
  const [newQuantity, setNewQuantity] = useState(1);

  // TODO: Show a price discrepancy modal, in case a front tag is scanned,
  // whose assigned price doesn't match the system price (returned from item lookup queries)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{itemDetails.partDesc}</Text>
      <View style={styles.table}>
        <View style={styles.column}>
          <Row label="P/N:" value={itemDetails.mfrPartNum ?? ''} />
          <Row label="SKU:" value={itemDetails.sku ?? ''} />
          <Row label="Price:" value={`$${itemDetails.retailPrice ?? 0}`} />
        </View>
        <View style={styles.separator} />
        <View style={[styles.column]}>
          <Row label="Current:" value={itemDetails.onHand ?? 0} />
          <Row
            label="Bk Stk:"
            value={getBackstockQuantity(itemDetails.backStockSlots)}
          />
          {withQuantityAdjustment && <Row label="New" value={newQuantity} />}
        </View>
      </View>
      {withQuantityAdjustment && (
        <QuantityAdjuster quantity={newQuantity} setQuantity={setNewQuantity} />
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
