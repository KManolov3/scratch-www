import { compact } from 'lodash-es';
import { useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { TabSelector } from '@components/TabSelector';
import { BackstockSlotList, BackstockSlotsInfo } from './BackstockSlotList';
import { PlanogramsInfo, PlanogramList } from './PlanogramList';

const locationTypes = ['POG Locations', 'Slot Locations'] as const;
type LocationTypes = (typeof locationTypes)[number];

export interface LocationsProps {
  locationDetails: PlanogramsInfo & BackstockSlotsInfo;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Locations({ locationDetails, containerStyle }: LocationsProps) {
  const [selectedValue, setSelectedValue] = useState<LocationTypes>(
    locationTypes[0],
  );
  // TODO: Handle cases where either type of locations is empty (e.g. item does not exist in backstock)
  return (
    <View style={[styles.container, containerStyle]}>
      <TabSelector
        values={locationTypes}
        selected={selectedValue}
        onSelect={setSelectedValue}
      />
      <View style={styles.locationContainer}>
        {selectedValue === 'POG Locations' ? (
          <PlanogramList planograms={compact(locationDetails.planograms)} />
        ) : (
          <BackstockSlotList
            backstockSlots={compact(locationDetails.backStockSlots)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
  },
  locationContainer: {
    flex: 1,
  },
});
