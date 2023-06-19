import { useCallback, useEffect, useMemo, useState } from 'react';
import { ListRenderItem, FlatList, StyleSheet } from 'react-native';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { FixedLayout } from '@layouts/FixedLayout';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { Header } from '@components/Header';
import { useBooleanState } from '@hooks/useBooleanState';
import { WhiteBackArrow } from '@assets/icons';
import { useNavigation } from '@react-navigation/native';
import { toastService } from 'src/services/ToastService';
import { useFocusEventBus } from '@hooks/useEventBus';
import { useBatchCountState } from '../state';
import { BatchCountItemCard } from '../components/BatchCountItemCard';
import { BatchCountNavigation } from '../navigator';

// TODO: Think about extracting part of the shared code between this screen and BatchCountList
// They are nearly the same component, differing only in the `isSummary` property and the action bar
export function BatchCountSummary() {
  const { goBack } = useNavigation<BatchCountNavigation>();

  const {
    submit: submitBatch,
    submitError,
    updateItem,
    removeItem,
    batchCountItems,
  } = useBatchCountState();

  const {
    state: isShrinkageModalVisible,
    enable: enableShrinkageModal,
    disable: disableShrinkageModal,
  } = useBooleanState(false);

  const batchCountItemsSorted = useMemo(
    () =>
      Object.values(batchCountItems).sort(
        (item1, item2) =>
          Number(item2.isBookmarked ?? 0) - Number(item1.isBookmarked ?? 0),
      ),
    [batchCountItems],
  );

  const [expandedSku, setExpandedSku] = useState<string | undefined>();

  const setNewQuantity = useCallback(
    (sku: string, newQty: number) => {
      updateItem(sku, {
        newQty,
      });
    },
    [updateItem],
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

  const bookmarkedItems: { [sku: string]: boolean } = useMemo(
    () =>
      Object.entries(batchCountItems).reduce(
        (acc, [sku, item]) =>
          Object.assign(acc, {
            [sku]: item.isBookmarked ?? false,
          }),
        {},
      ),
    [batchCountItems],
  );
  const onFlag = useCallback(
    (sku: string) => {
      const isCurrentlyBookmarked = bookmarkedItems[sku];
      updateItem(sku, {
        isBookmarked: !isCurrentlyBookmarked,
      });
      if (!isCurrentlyBookmarked) {
        toastService.showInfoToast('Item bookmarked as note to self', {
          props: { containerStyle: styles.toast },
        });
      }
    },
    [bookmarkedItems, updateItem],
  );

  const onCardPress = useCallback(
    (sku: string) => {
      if (expandedSku !== sku) {
        setExpandedSku(sku);
        return;
      }

      setExpandedSku(undefined);
    },
    [expandedSku],
  );

  const renderItem = useCallback<
    ListRenderItem<(typeof batchCountItemsSorted)[number]>
  >(
    ({ item: { item, newQty } }) => (
      <BatchCountItemCard
        item={item}
        newQuantity={newQty}
        setNewQuantity={(quantity: number) =>
          setNewQuantity(item.sku, quantity)
        }
        isExpanded={expandedSku === item.sku}
        isBookmarked={bookmarkedItems[item.sku] ?? false}
        isSummary
        onBookmarkPress={() => onFlag(item.sku)}
        onRemove={() => removeItem(item.sku)}
        onCardPress={() => onCardPress(item.sku)}
      />
    ),
    [
      bookmarkedItems,
      expandedSku,
      onCardPress,
      onFlag,
      removeItem,
      setNewQuantity,
    ],
  );

  const submitBatchCount = useCallback(() => {
    disableShrinkageModal();
    submitBatch();
  }, [disableShrinkageModal, submitBatch]);

  const bottomBarActions: Action[] = useMemo(
    () => [
      {
        label: 'Approve Count',
        onPress: enableShrinkageModal,
      },
    ],
    [enableShrinkageModal],
  );

  useEffect(() => {
    if (submitError) {
      toastService.showInfoToast(
        `Error while submitting batch count. ${submitError.message}`,
        {
          props: { containerStyle: styles.toast },
        },
      );
    }
  }, [submitError]);

  useFocusEventBus('search-error', () => {
    disableShrinkageModal();
    toastService.showInfoToast(
      'No results found. Try searching for another SKU or scanning another barcode.',
      {
        props: { containerStyle: styles.toast },
      },
    );
  });

  useFocusEventBus('search-success', () => {
    disableShrinkageModal();
  });

  // TODO: Show loading indicator on submit

  const header = useMemo(
    () => (
      <Header
        title="Summary"
        leftIcon={<WhiteBackArrow />}
        onClickLeft={goBack}
      />
    ),
    [goBack],
  );

  return (
    <>
      <FixedLayout header={header}>
        <FlatList
          contentContainerStyle={styles.list}
          data={batchCountItemsSorted}
          renderItem={renderItem}
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
        onCancel={disableShrinkageModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 16,
  },
  flex: {
    flex: 1,
  },
  bottomActionBar: {
    paddingTop: 8,
  },
  toast: {
    marginBottom: '10%',
  },
});
