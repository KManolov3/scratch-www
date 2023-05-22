import { StyleSheet, View } from 'react-native';
import { ItemDetailsInfo, ItemInfoHeader } from '@components/ItemInfoHeader';
import { Locations } from '@components/Locations';
import { Colors } from '@lib/colors';
import { PlanogramsInfo } from '@components/Locations/PlanogramList';
import { BackstockSlotsInfo } from '@components/Locations/BackstockSlotList';

export interface ItemDetailsProps {
  itemDetails: ItemDetailsInfo & PlanogramsInfo & BackstockSlotsInfo;
  withQuantityAdjustment?: boolean;
  frontTagPrice?: number;
}

export function ItemDetails({
  itemDetails,
  withQuantityAdjustment = false,
  frontTagPrice,
}: ItemDetailsProps) {
  return (
    <View style={styles.container}>
      <ItemInfoHeader
        itemDetails={itemDetails}
        withQuantityAdjustment={withQuantityAdjustment}
        frontTagPrice={frontTagPrice}
      />
      <Locations locationDetails={itemDetails} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.pure,
    flex: 1,
  },
});
