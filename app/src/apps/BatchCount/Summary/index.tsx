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
import { BatchCountItem, useBatchCountState } from '../state';
import { BatchCountItemCard } from '../components/BatchCountItemCard';
import { BatchCountNavigation } from '../navigator';

// TODO: Think about extracting part of the shared code between this screen and BatchCountList
// They are nearly the same component, differing only in the `isSummary` property and the action bar
export function BatchCountSummary() {
  const { goBack } = useNavigation<BatchCountNavigation>();

  const {
    submit: submitBatch,
    submitLoading,
    submitError,
    updateItem,
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

  const [expandedSku, setExpandedSku] = useState<string>();

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

  const onBookmark = useCallback(
    (sku: string, isCurrentlyBookmarked: boolean) => {
      updateItem(sku, {
        isBookmarked: !isCurrentlyBookmarked,
      });
      if (!isCurrentlyBookmarked) {
        toastService.showInfoToast('Item bookmarked as note to self', {
          props: { containerStyle: styles.toast },
        });
      }
    },
    [updateItem],
  );

  const onClick = useCallback(
    (sku: string) => {
      if (expandedSku !== sku) {
        setExpandedSku(sku);
        return;
      }

      setExpandedSku(undefined);
    },
    [expandedSku],
  );

  const renderItem = useCallback<ListRenderItem<BatchCountItem>>(
    ({ item: { item, newQty, isBookmarked } }) => (
      <BatchCountItemCard
        item={item}
        newQuantity={newQty}
        setNewQuantity={(quantity: number) =>
          setNewQuantity(item.sku, quantity)
        }
        isExpanded={expandedSku === item.sku}
        isBookmarked={!!isBookmarked}
        isSummary
        onBookmark={() => onBookmark(item.sku, !!isBookmarked)}
        onClick={() => onClick(item.sku)}
        style={styles.card}
      />
    ),
    [expandedSku, onClick, onBookmark, setNewQuantity],
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
        isLoading: submitLoading,
      },
    ],
    [enableShrinkageModal, submitLoading],
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

  const header = (
    <Header
      title="Summary"
      leftIcon={<WhiteBackArrow />}
      onClickLeft={goBack}
    />
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
  card: {
    marginHorizontal: 21,
    marginVertical: 4,
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
