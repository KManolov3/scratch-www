import { Text } from '@components/Text';
import { FontWeight } from '@lib/font';
import { Pressable, StyleSheet, View } from 'react-native';
import { DocumentType, gql } from 'src/__generated__';
import { QuantityAdjuster } from '@components/QuantityAdjuster';
import _ from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PriceDiscrepancyModal } from '@components/PriceDiscrepancyModal';
import { AttentionIcon } from '@assets/icons';
import { ItemPropertyDisplay } from '@components/ItemPropertyDisplay';
import { soundService } from 'src/services/SoundService';
import { formatPrice } from '@lib/formatPrice';

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
  frontTagPrice?: number;
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

  return _.chain(backstockSlots).compact().sumBy('qty').value();
}

export function ItemInfoHeader({
  itemDetails,
  withQuantityAdjustment = false,
  frontTagPrice,
}: ItemInfoHeaderProps) {
  // TODO: Manage this through the app context. Requirements:
  // 1) It should be incremented whenever a UPC is scanned.
  // 2) It should be able to be modified through the QuantityAdjuster component
  const [newQuantity, setNewQuantity] = useState(1);

  // TODO: Show a price discrepancy modal, in case a front tag is scanned,
  // whose assigned price doesn't match the system price (returned from item lookup queries)
  const priceDiscrepancy = useMemo(
    () => !!frontTagPrice && frontTagPrice !== itemDetails.retailPrice,
    [frontTagPrice, itemDetails.retailPrice],
  );
  const [priceDiscrepancyModalVisible, setPriceDiscrepancyModalVisible] =
    useState(priceDiscrepancy);

  const toggleModal = useCallback(
    () => setPriceDiscrepancyModalVisible(visible => !visible),
    [],
  );

  useEffect(() => {
    if (priceDiscrepancy) {
      // eslint-disable-next-line no-console
      soundService.playSound('error').catch(console.log);
    }
  }, [priceDiscrepancy]);

  const backstockSlots = useMemo(
    () => getBackstockQuantity(itemDetails.backStockSlots),
    [itemDetails.backStockSlots],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityLabel="Product Title">
        {itemDetails.partDesc}
      </Text>

      <View style={styles.row}>
        <ItemPropertyDisplay
          style={styles.itemProperties}
          label="SKU"
          value={itemDetails.sku}
        />
        <ItemPropertyDisplay
          style={styles.itemProperties}
          label="Price"
          value={
            itemDetails.retailPrice
              ? formatPrice(itemDetails.retailPrice)
              : 'undefined'
          }
          icon={
            priceDiscrepancy ? (
              <Pressable onPress={toggleModal}>
                <AttentionIcon />
              </Pressable>
            ) : undefined
          }
        />
      </View>

      <View style={styles.row}>
        <ItemPropertyDisplay
          style={styles.itemProperties}
          label="Part Number"
          value={itemDetails.mfrPartNum}
        />
      </View>

      <View style={styles.row}>
        <ItemPropertyDisplay
          style={styles.itemProperties}
          label="QOH"
          value={itemDetails.mfrPartNum}
        />
        <ItemPropertyDisplay
          style={styles.itemProperties}
          label="Back Stock"
          value={backstockSlots}
        />
        {/* TODO: Right now the api does not return maxi
            so we decided to hide it. Add it back when
            any progress is made
        */}
        {/* <ItemPropertyDisplay
          style={styles.itemProperties}
          label="Maxi"
          value={0}
        /> */}
      </View>

      {withQuantityAdjustment && (
        <QuantityAdjuster quantity={newQuantity} setQuantity={setNewQuantity} />
      )}
      {frontTagPrice && itemDetails.retailPrice && (
        <PriceDiscrepancyModal
          scanned={frontTagPrice}
          system={itemDetails.retailPrice}
          isVisible={priceDiscrepancyModalVisible}
          onCancel={toggleModal}
          onConfirm={toggleModal}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: { fontWeight: FontWeight.Bold, fontSize: 20 },
  title: {
    paddingHorizontal: 16,
    paddingTop: 10,
    fontSize: 20,
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
