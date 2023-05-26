// The store is hardcoded until the launcher can start providing an authentication
// token to the app, containing the current active store.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { FixedLayout } from '@layouts/FixedLayout';
import { VerifyItemsList } from '@components/VerifyItemsList';
import { useNavigation } from '@react-navigation/native';
import { sumBy } from 'lodash-es';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
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

  const [isShrinkageModalVisible, setIsShrinkageModalVisible] = useState(false);

  const onCardPress = useCallback(
    (sku: string) =>
      navigation.navigate('ItemDetails', {
        selectedItemSku: sku,
      }),
    [navigation],
  );

  const batchCountItemsSorted = useMemo(
    () => [
      ...Object.values(batchCountItems)
        .filter(({ isFlagged }) => isFlagged)
        .map(({ item }) => item),
      ...Object.values(batchCountItems)
        .filter(({ isFlagged }) => !isFlagged)
        .map(({ item }) => item),
    ],
    [batchCountItems],
  );

  const shrinkage = useMemo(
    () =>
      sumBy(
        Object.values(batchCountItems),
        ({ item, newQty }) =>
          Math.max(item.onHand ?? 0 - newQty, 0) * (item.retailPrice ?? 0),
      ),
    [batchCountItems],
  );

  const overage = useMemo(
    () =>
      sumBy(
        Object.values(batchCountItems),
        ({ item, newQty }) =>
          Math.max(newQty - (item.onHand ?? 0), 0) * (item.retailPrice ?? 0),
      ),
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
    setIsShrinkageModalVisible(false);
    submitBatch();
  }, [submitBatch]);

  const bottomBarActions: Action[] = useMemo(
    () => [
      {
        label: 'Complete Batch Count',
        onPress: () => setIsShrinkageModalVisible(!isShrinkageModalVisible),
      },
    ],
    [isShrinkageModalVisible],
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
  });

  // TODO: Show loading indicator on submit

  return (
    <>
      <FixedLayout>
        <VerifyItemsList
          items={batchCountItemsSorted}
          quantityAdjustment={quantityAdjustment}
          remove={remove}
          flag={flag}
          onPress={onCardPress}
        />
        <BottomActionBar actions={bottomBarActions} />
      </FixedLayout>
      <ShrinkageOverageModal
        isVisible={isShrinkageModalVisible}
        shrinkage={shrinkage}
        overage={overage}
        onConfirm={submitBatchCount}
        // TODO: Should this be in a useCallback?
        onCancel={() => setIsShrinkageModalVisible(false)}
      />
    </>
  );
}
