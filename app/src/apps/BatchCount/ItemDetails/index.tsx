// The store is hardcoded until the launcher can start providing an authentication
// token to the app, containing the current active store.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { useNavigation } from '@react-navigation/native';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { compact } from 'lodash-es';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
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
    submit: submitBatch,
    submitError,
    updateItem,
  } = useBatchCountState();
  const navigation = useNavigation<BatchCountNavigation>();

  const [isShrinkageModalVisible, setIsShrinkageModalVisible] = useState(false);

  const selectedItem = useMemo(() => {
    const item = batchCountItems[selectedItemSku];

    return item;
  }, [batchCountItems, selectedItemSku]);

  const batchCountItemsLength = useMemo(
    () => Object.values(batchCountItems).length,
    [batchCountItems],
  );

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

  const items = useMemo(
    () =>
      Object.values(batchCountItems).map(({ item, newQty }) => ({
        onHand: item.onHand,
        newQty,
        retailPrice: item.retailPrice,
      })),
    [batchCountItems],
  );

  const submitBatchCount = useCallback(() => {
    setIsShrinkageModalVisible(false);
    submitBatch();
  }, [submitBatch]);

  const onVerify = useCallback(() => {
    navigation.navigate('Confirm');
  }, [navigation]);

  const bottomBarActions: Action[] = useMemo(
    () =>
      compact([
        batchCountItemsLength === 1
          ? {
              // TODO: Show variance confirmation modal before submitting
              label: 'FAST ACCEPT',
              onPress: () => setIsShrinkageModalVisible(true),
              buttonStyle: styles.fastAccept,
            }
          : undefined,
        {
          label: 'VERIFY',
          onPress: onVerify,
        },
        // TODO: Fix type
      ]) as Action[],
    [batchCountItemsLength, onVerify],
  );

  useEffect(() => {
    if (submitError) {
      // TODO: Switch with the toast library we decide to use
      ToastAndroid.show(submitError.message, ToastAndroid.LONG);
    }
  }, [submitError]);

  // TODO: Show loading indicator on submit

  // This can happen in the case when the selected item has been removed from BatchCount.
  // But this screen shouldn't be reachable in that case.
  if (!selectedItem) {
    return <> </>;
  }

  return (
    <>
      <FixedLayout style={styles.layout}>
        <ItemDetails
          itemDetails={selectedItem.item}
          quantityAdjustment={quantityAdjustmentDetails}
        />
        <BottomActionBar
          style={styles.bottomActionBar}
          actions={bottomBarActions}
        />
      </FixedLayout>

      <ShrinkageOverageModal
        isVisible={isShrinkageModalVisible}
        countType="Batch Count"
        items={items}
        onConfirm={submitBatchCount}
        // TODO: Should this be in a useCallback?
        onCancel={() => setIsShrinkageModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: Colors.pure,
  },
  bottomActionBar: {
    paddingTop: 8,
  },
  fastAccept: {
    backgroundColor: Colors.lightGray,
    borderColor: Colors.lightGray,
  },
});
