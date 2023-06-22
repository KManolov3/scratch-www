import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { useNavigation } from '@react-navigation/native';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { compact, sortBy } from 'lodash-es';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { Header } from '@components/Header';
import { useBooleanState } from '@hooks/useBooleanState';
import { toastService } from 'src/services/ToastService';
import { useFocusEventBus } from '@hooks/useEventBus';
import { useSortOnScreenFocus } from '@hooks/useSortOnScreenFocus';
import { Item } from 'src/__generated__/graphql';
import { BatchCountNavigation } from '../navigator';
import { BatchCountItem, useBatchCountState } from '../state';
import { BatchCountItemCard } from '../components/BatchCountItemCard';

export function BatchCountList() {
  const {
    batchCountItems,
    submit: submitBatch,
    submitLoading,
    submitError,
    updateItem,
    removeItem,
  } = useBatchCountState();
  const navigation = useNavigation<BatchCountNavigation>();

  const {
    state: isShrinkageModalVisible,
    enable: enableShrinkageModal,
    disable: disableShrinkageModal,
  } = useBooleanState(false);

  const sortFn = useCallback(
    (items: BatchCountItem[]) => sortBy(items, item => !item.isBookmarked),
    [],
  );
  const keyFn = useCallback(({ item }: BatchCountItem) => item.sku, []);
  const batchCountItemsSorted = useSortOnScreenFocus(
    batchCountItems,
    sortFn,
    keyFn,
  );

  const [expandedSku, setExpandedSku] = useState<string>();

  const flatListRef = useRef<FlatList>(null);

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
      batchCountItems.map(({ item, newQty }) => ({
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

  const onRemove = useCallback(
    (item: BatchCountItem['item']) => {
      removeItem(item.sku);
      toastService.showInfoToast(
        `${item.partDesc} removed from batch count list`,
        {
          props: { containerStyle: styles.toast },
        },
      );
    },
    [removeItem],
  );

  useEffect(() => {
    if (batchCountItems.length === 0) {
      navigation.navigate('Home');
    }
  }, [batchCountItems, navigation]);

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
        onBookmark={() => onBookmark(item.sku, !!isBookmarked)}
        onRemove={() => onRemove(item)}
        onClick={() => onClick(item.sku)}
        style={styles.card}
      />
    ),
    [expandedSku, onBookmark, onClick, onRemove, setNewQuantity],
  );

  const submitBatchCount = useCallback(() => {
    disableShrinkageModal();
    submitBatch();
  }, [disableShrinkageModal, submitBatch]);

  const onVerify = useCallback(() => {
    navigation.navigate('Summary');
  }, [navigation]);

  const bottomBarActions: Action[] = useMemo(
    () =>
      compact([
        {
          label: 'Fast Accept',
          onPress: enableShrinkageModal,
          buttonStyle: styles.fastAccept,
          textStyle: styles.fastAcceptText,
          isLoading: submitLoading,
        },
        {
          label: 'Create Summary',
          onPress: onVerify,
        },
      ]),
    [enableShrinkageModal, onVerify, submitLoading],
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

  useFocusEventBus('search-success', (item?: Item) => {
    disableShrinkageModal();
    if (item && item.sku !== expandedSku) {
      setExpandedSku(undefined);
    }
  });

  useFocusEventBus('add-new-item', () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  });

  const header = <Header title="Batch Count" />;

  return (
    <>
      <FixedLayout header={header}>
        {/* TODO: Extract the FlatList in a separate component and reuse it between here and the BatchCountSummary */}
        <FlatList
          contentContainerStyle={styles.list}
          data={batchCountItemsSorted}
          renderItem={renderItem}
          ref={flatListRef}
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
  bottomActionBar: {
    paddingTop: 8,
  },
  fastAccept: {
    backgroundColor: Colors.advanceVoid,
    borderColor: Colors.advanceVoid,
  },
  fastAcceptText: {
    color: Colors.pure,
  },
  toast: {
    marginBottom: '10%',
  },
});
