// The store is hardcoded until the launcher can start providing an authentication
// token to the app, containing the current active store.

import { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { useNavigation } from '@react-navigation/native';
import { ItemDetails } from '../../../components/ItemDetails';
import { BatchCountNavigation, BatchCountScreenProps } from '../navigator';
import { useBatchCountState } from '../state';

// TODO: Ensure state is reset (or another screen instance is pushed) when navigating back to ItemLookup
// Otherwise, might face inconsistencies (for example itemBySku state not being cleared, and showing
// its details instaead of the new itemByUpc)
export function BatchCountItemDetails({
  route: {
    params: { selectedItemSku },
  },
}: BatchCountScreenProps<'ItemDetails'>) {
  const {
    batchCountItems,
    submit: submitBatchCount,
    updateItem,
  } = useBatchCountState();
  const navigation = useNavigation<BatchCountNavigation>();

  const selectedItem = useMemo(() => {
    const item = batchCountItems[selectedItemSku];
    if (!item) {
      throw new Error(
        'No item in state for selected SKU. This should not happen.',
      );
    }

    return item;
  }, [batchCountItems, selectedItemSku]);

  const setNewQuantity = useCallback(
    (newQty: number) => {
      updateItem(selectedItemSku, {
        newQty,
      });
    },
    [selectedItemSku, updateItem],
  );

  const quantityAdjustmentDetails = useMemo(
    () => ({
      quantity: selectedItem?.newQty ?? -1,
      setNewQuantity,
    }),
    [selectedItem?.newQty, setNewQuantity],
  );

  const onVerify = useCallback(() => {
    navigation.navigate('Confirm');
  }, [navigation]);

  const bottomBarActions: Action[] = useMemo(
    () => [
      {
        // TODO: Show variance confirmation modal before submitting
        label: 'FAST ACCEPT',
        onPress: submitBatchCount,
      },
      {
        label: 'VERIFY',
        onPress: onVerify,
      },
    ],
    [submitBatchCount, onVerify],
  );

  return (
    <View style={styles.container}>
      <ItemDetails
        itemDetails={selectedItem.item}
        quantityAdjustment={quantityAdjustmentDetails}
      />
      <BottomActionBar actions={bottomBarActions} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
