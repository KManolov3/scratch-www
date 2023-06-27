import { ScrollView, StyleSheet } from 'react-native';
import { ItemDetailsInfo, ItemInfoHeader } from '@components/ItemInfoHeader';
import { Locations } from '@components/Locations';
import { BackstockSlotsInfo } from '@components/Locations/BackstockSlotList';
import { PlanogramsInfo } from '@components/Locations/PlanogramList';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';

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
    <ScrollView style={styles.container}>
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
    </ScrollView>
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
