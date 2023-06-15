import { useState } from 'react';
import { TabSelector } from '@components/TabSelector';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { compact } from 'lodash-es';
import { FontWeight } from '@lib/font';
import { PlanogramsInfo, PlanogramList } from './PlanogramList';
import { BackstockSlotList, BackstockSlotsInfo } from './BackstockSlotList';

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
        setSelected={setSelectedValue}
        textStyle={styles.tabSelectorText}
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
  tabSelectorText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: FontWeight.Bold,
    // 0.01em === 0.72px
    letterSpacing: -0.72,
  },
});
