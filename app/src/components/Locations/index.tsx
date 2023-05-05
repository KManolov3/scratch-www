import { useState } from 'react';
import { TabSelector } from '@components/TabSelector';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';
import { compact } from 'lodash-es';
import { PlanogramsInfo, PlanogramList } from './PlanogramList';
import { BackstockSlotList, BackstockSlotsInfo } from './BackstockSlotList';

const locationTypes = ['POG Locations', 'Slot Locations'] as const;

export interface LocationsProps {
  locationDetails: PlanogramsInfo & BackstockSlotsInfo;
}

export function Locations({ locationDetails }: LocationsProps) {
  const [selectedValue, setSelectedValue] = useState<
    (typeof locationTypes)[number]
  >(locationTypes[0]);
  // TODO: Handle cases where either type of locations is empty (e.g. item does not exist in backstock)
  return (
    <View style={styles.container}>
      <TabSelector
        values={locationTypes}
        selected={selectedValue}
        setSelected={setSelectedValue}
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
  },
  locationContainer: {
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: Colors.backdropVoid,
    flex: 1,
  },
});
