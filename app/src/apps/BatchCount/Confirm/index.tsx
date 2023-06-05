// The store is hardcoded until the launcher can start providing an authentication
// token to the app, containing the current active store.

import { useCallback, useEffect, useMemo } from 'react';
import {
  ListRenderItem,
  ToastAndroid,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { FixedLayout } from '@layouts/FixedLayout';
import { ActionableItemCard } from '@components/ActionableItemCard';
import { useNavigation } from '@react-navigation/native';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { useBooleanState } from '@hooks/useBooleanState';
import { useBatchCountState } from '../state';
import { BatchCountNavigation } from '../navigator';

export function BatchCountConfirm() {
  const {
    submit: submitBatch,
    submitError,
    updateItem,
    removeItem,
    batchCountItems,
  } = useBatchCountState();

  const navigation = useNavigation<BatchCountNavigation>();

  const {
    state: shouldShowShrinkageModal,
    toggle: toggleShrinkageModal,
    disable: disableShrinkageModal,
  } = useBooleanState(false);

  const onCardPress = useCallback(
    (sku: string) =>
      navigation.navigate('ItemDetails', {
        selectedItemSku: sku,
      }),
    [navigation],
  );

  const batchCountItemsSorted = useMemo(
    () =>
      Object.values(batchCountItems)
        .sort(
          (item1, item2) =>
            Number(item1.isFlagged ?? 0) - Number(item2.isFlagged ?? 0),
        )
        .map(({ item }) => item),
    [batchCountItems],
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

  const setNewQuantity = useCallback(
    (sku: string) => (newQty: number) => {
      updateItem(sku, {
        newQty,
      });
    },
    [updateItem],
  );

  const quantityAdjustment = useMemo(
    () =>
      Object.entries(batchCountItems).reduce(
        (acc, [sku, item]) =>
          Object.assign(acc, {
            [sku]: {
              quantity: item.newQty,
              setNewQuantity: setNewQuantity(sku),
            },
          }),
        {},
      ),
    [batchCountItems, setNewQuantity],
  );

  const submitBatchCount = useCallback(() => {
    disableShrinkageModal();
    submitBatch();
  }, [disableShrinkageModal, submitBatch]);

  const bottomBarActions: Action[] = useMemo(
    () => [
      {
        label: 'Complete Batch Count',
        onPress: toggleShrinkageModal,
      },
    ],
    [toggleShrinkageModal],
  );

  // TODO: export transformer functions in a util file?
  const remove = useMemo(() => ({ onRemove: removeItem }), [removeItem]);
  const flaggedItems: { [sku: string]: boolean } = useMemo(
    () =>
      Object.entries(batchCountItems).reduce(
        (acc, [sku, item]) =>
          Object.assign(acc, {
            [sku]: item.isFlagged ?? false,
          }),
        {},
      ),
    [batchCountItems],
  );
  const onFlag = useCallback(
    (sku: string) =>
      updateItem(sku, {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        isFlagged: !flaggedItems[sku]!,
      }),
    [flaggedItems, updateItem],
  );
  const flag = useMemo(
    () => ({
      onFlag,
      flagged: flaggedItems,
    }),
    [flaggedItems, onFlag],
  );

  const renderItem = useCallback<
    ListRenderItem<(typeof batchCountItemsSorted)[number]>
  >(
    ({ item }) => (
      <ActionableItemCard
        item={item}
        quantityAdjustment={quantityAdjustment}
        remove={remove}
        flag={flag}
        onPress={onCardPress}
      />
    ),
    [flag, onCardPress, quantityAdjustment, remove],
  );

  useEffect(() => {
    if (submitError) {
      // TODO: Switch with the toast library we decide to use
      ToastAndroid.show(submitError.message, ToastAndroid.LONG);
    }
  }, [submitError]);

  useEffect(() => {
    if (Object.values(batchCountItems).length === 0) {
      navigation.navigate('Home');
    }
  }, [batchCountItems, navigation]);

  // TODO: Show loading indicator on submit

  return (
    <>
      <FixedLayout>
        <FlatList
          data={batchCountItemsSorted}
          renderItem={renderItem}
          style={styles.flex}
        />
        <BottomActionBar actions={bottomBarActions} />
      </FixedLayout>
      <ShrinkageOverageModal
        isVisible={shouldShowShrinkageModal}
        countType="Batch Count"
        items={items}
        onConfirm={submitBatchCount}
        // TODO: Should this be in a useCallback?
        onCancel={disableShrinkageModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
