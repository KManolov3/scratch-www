import { StyleSheet, View } from 'react-native';
import { ItemDetailsInfo, ItemInfoHeader } from '@components/ItemInfoHeader';
import { Locations } from '@components/Locations';
import { Colors } from '@lib/colors';
import { PlanogramsInfo } from '@components/Locations/PlanogramList';
import { BackstockSlotsInfo } from '@components/Locations/BackstockSlotList';
import { BaseStyles } from '@lib/baseStyles';

export interface ItemDetailsProps {
  itemDetails: ItemDetailsInfo & PlanogramsInfo & BackstockSlotsInfo;
  hasPriceDiscrepancy?: boolean;
  frontTagPrice?: number;
  togglePriceDiscrepancyModal?: () => void;
}

export function ItemDetails({
  itemDetails,
  hasPriceDiscrepancy,
  frontTagPrice,
  togglePriceDiscrepancyModal,
}: ItemDetailsProps) {
  return (
    <View style={styles.container}>
      <ItemInfoHeader
        itemDetails={itemDetails}
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
    padding: 6,
    paddingHorizontal: 15,
  },
  locations: {
    marginHorizontal: 12,
    marginTop: 16,
  },
});
