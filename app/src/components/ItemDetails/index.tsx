import { StyleSheet, View } from 'react-native';
import { ItemDetailsInfo, ItemInfoHeader } from '@components/ItemInfoHeader';
import { Locations } from '@components/Locations';
import { Colors } from '@lib/colors';
import { PlanogramsInfo } from '@components/Locations/PlanogramList';
import { BackstockSlotsInfo } from '@components/Locations/BackstockSlotList';
import { BaseStyles } from '@lib/baseStyles';

export interface ItemDetailsProps {
  itemDetails: ItemDetailsInfo & PlanogramsInfo & BackstockSlotsInfo;
  // TODO: remove quantity adjustment from here and below
  quantityAdjustment?: {
    quantity: number;
    setNewQuantity: (newQty: number) => void;
  };
  hasPriceDiscrepancy?: boolean;
  frontTagPrice?: number;
  togglePriceDiscrepancyModal?: () => void;
}

export function ItemDetails({
  itemDetails,
  quantityAdjustment,
  hasPriceDiscrepancy,
  frontTagPrice,
  togglePriceDiscrepancyModal,
}: ItemDetailsProps) {
  return (
    <View style={styles.container}>
      <ItemInfoHeader
        itemDetails={itemDetails}
        quantityAdjustment={quantityAdjustment}
        hasPriceDiscrepancy={hasPriceDiscrepancy}
        togglePriceDiscrepancyModal={togglePriceDiscrepancyModal}
        itemStyle={styles.detailsItem}
        frontTagPrice={frontTagPrice}
      />
      <Locations
        locationDetails={itemDetails}
        containerStyle={styles.locations}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.pure,
    flex: 1,
  },
  detailsItem: {
    ...BaseStyles.shadow,
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
  },
  locations: {
    margin: 13,
  },
});
