import { sortBy } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { Item } from 'src/__generated__/graphql';
import { toastService } from 'src/services/ToastService';
import { WhiteBackArrow } from '@assets/icons';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { Header } from '@components/Header';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useConfirmation } from '@hooks/useConfirmation';
import { useFocusEventBus } from '@hooks/useEventBus';
import { useSortOnScreenFocus } from '@hooks/useSortOnScreenFocus';
import { FixedLayout } from '@layouts/FixedLayout';
import { useNavigation } from '@react-navigation/native';
import { BatchCountItemCard } from '../components/BatchCountItemCard';
import { BatchCountNavigation } from '../navigator';
import { BatchCountItem, useBatchCountState } from '../state';

// TODO: Think about extracting part of the shared code between this screen and BatchCountList
// They are nearly the same component, differing only in the `isSummary` property and the action bar
export function BatchCountSummary() {
  const { goBack } = useNavigation<BatchCountNavigation>();

  const {
    submit: submitBatch,
    submitLoading,
    submitError,
    updateItem,
    removeItem,
    batchCountItems,
  } = useBatchCountState();
  const navigation = useNavigation<BatchCountNavigation>();

  const { confirmationRequested, askForConfirmation, accept, reject } =
    useConfirmation();

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

  const onRemove = useCallback(
    (item: BatchCountItem['item']) => {
      removeItem(item.sku);
      toastService.showInfoToast(
        `${item.partDesc} removed from Batch count list`,
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
        setNewQuantity={(quantity: number | undefined) =>
          setNewQuantity(item.sku, quantity ?? 0)
        }
        isExpanded={expandedSku === item.sku}
        isBookmarked={!!isBookmarked}
        isSummary
        onBookmark={() => onBookmark(item.sku, !!isBookmarked)}
        onRemove={() => onRemove(item)}
        onClick={() => onClick(item.sku)}
        style={styles.card}
      />
    ),
    [expandedSku, setNewQuantity, onBookmark, onRemove, onClick],
  );

  const { trigger: submitBatchCount } = useAsyncAction(async () => {
    if (await askForConfirmation()) {
      submitBatch();
    }
  });

  const bottomBarActions: Action[] = useMemo(
    () => [
      {
        label: 'Approve Count',
        onPress: submitBatchCount,
        isLoading: submitLoading,
      },
    ],
    [submitBatchCount, submitLoading],
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
    reject();
    toastService.showInfoToast(
      'No results found. Try searching for another SKU or scanning a barcode.',
      {
        props: { containerStyle: styles.toast },
      },
    );
  });

  useFocusEventBus('search-success', (item?: Item) => {
    reject();
    if (item && item.sku !== expandedSku) {
      setExpandedSku(undefined);
    }
  });

  useFocusEventBus('add-new-item', () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  });

  return (
    <>
      <FixedLayout
        header={
          <Header
            title="Summary"
            leftIcon={<WhiteBackArrow />}
            onClickLeft={goBack}
          />
        }>
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
        isVisible={confirmationRequested}
        countType="Batch Count"
        items={items}
        onConfirm={accept}
        onCancel={reject}
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
