import Sound from 'react-native-sound';
import { Text } from '@components/Text';
import { FontWeight } from '@lib/font';
import { Pressable, StyleSheet, View } from 'react-native';
import { DocumentType, gql } from 'src/__generated__';
import { QuantityAdjuster } from '@components/QuantityAdjuster';
import _ from 'lodash-es';
import { Colors } from '@lib/colors';
import { useEffect, useState } from 'react';
import { PriceDiscrepancyModal } from '@components/PriceDiscrepancyModal';
// import { AttentionIcon } from '@assets/icons';
import ding from '@assets/sounds/ding.mp3';

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

  const priceDiscrepancy =
    !!frontTagPrice && frontTagPrice !== itemDetails.retailPrice;

  const [priceDiscrepancyModalVisible, setPriceDiscrepancyModalVisible] =
    useState(false);

  const toggleModal = () => {
    setPriceDiscrepancyModalVisible(visible => !visible);
  };

  useEffect(() => {
    const sound = new Sound(ding, error => {
      if (error) {
        return;
      }

      // Play the sound
      if (priceDiscrepancy) {
        sound.play();
      }
    });

    // Clean up the sound when the component unmounts
    return () => {
      sound.release();
    };
  }, [priceDiscrepancy]);

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityLabel="Product Title">
        {itemDetails.partDesc}
      </Text>

      <View style={styles.rowContainer}>
        <View style={styles.rowItem}>
          <Text>SKU</Text>
          <Text style={styles.header}>{itemDetails.sku}</Text>
        </View>
        <View style={styles.rowItem}>
          <Text>Price</Text>
          <Text style={styles.header}>${itemDetails.retailPrice}</Text>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.rowItem}>
          <Text>Part Number</Text>
          <Text style={styles.header}>{itemDetails.mfrPartNum}</Text>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.rowItem}>
          <Text>QOH</Text>
          <Text style={styles.header}>{itemDetails.onHand}</Text>
        </View>
        <View style={styles.rowItem}>
          <Text>Back Stock</Text>
          <Text style={styles.header}>
            {getBackstockQuantity(itemDetails.backStockSlots)}
          </Text>
        </View>
        <View style={styles.rowItem}>
          <Text>Maxi</Text>
          <Text style={styles.header}>0</Text>
        </View>
      </View>

      {withQuantityAdjustment && (
        <QuantityAdjuster quantity={newQuantity} setQuantity={setNewQuantity} />
      )}
      {priceDiscrepancy && (
        <Pressable onPress={toggleModal}>
          <Text style={styles.priceDiscrepancy}>
            Price Discrepancy Detected. SEE MORE
          </Text>
        </Pressable>
      )}
      <PriceDiscrepancyModal
        scanned={frontTagPrice}
        system={itemDetails.retailPrice}
        isVisible={priceDiscrepancyModalVisible}
        onCancel={toggleModal}
        onConfirm={toggleModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  priceDiscrepancy: {
    color: Colors.advanceRed,
    fontWeight: FontWeight.Demi,
  },
  icon: { margin: 4 },
  rowContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 8,
  },
  rowItem: {
    flexDirection: 'column',
    padding: 16,
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.pure,
    borderRadius: 8,

    shadowColor: Colors.advanceVoid,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.16,
    elevation: 8,
  },
});
