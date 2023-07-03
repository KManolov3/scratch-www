import { compact } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, ListRenderItem, StyleSheet } from 'react-native';
import { Item } from 'src/__generated__/graphql';
import { toastService } from 'src/services/ToastService';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useConfirmation } from '@hooks/useConfirmation';
import { useFocusEventBus } from '@hooks/useEventBus';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { useNavigation } from '@react-navigation/native';
import { useBatchCountItemSorting } from '@apps/BatchCount/hooks/useBatchCountItemSorting';
import { BatchCountItem } from 'src/types/BatchCount';
import { BatchCountItemCard } from '../components/BatchCountItemCard';
import { BatchCountNavigation } from '../navigator';
import { useBatchCountState } from '../state';

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

  const { confirmationRequested, askForConfirmation, accept, reject } =
    useConfirmation();

  const batchCountItemsSorted = useBatchCountItemSorting(batchCountItems);

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
      if (item.sku === expandedSku) {
        setExpandedSku(undefined);
      }
      removeItem(item.sku);
      toastService.showInfoToast(
        `${item.partDesc} removed from Batch count list`,
        {
          props: { containerStyle: styles.toast },
        },
      );
    },
    [removeItem, expandedSku],
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
        onBookmark={() => onBookmark(item.sku, !!isBookmarked)}
        onRemove={() => onRemove(item)}
        onClick={() => onClick(item.sku)}
        style={styles.card}
      />
    ),
    [expandedSku, onBookmark, onClick, onRemove, setNewQuantity],
  );

  const { trigger: submitBatchCount } = useAsyncAction(async () => {
    if (await askForConfirmation()) {
      submitBatch();
    }
  });

  const onVerify = useCallback(() => {
    navigation.navigate('Summary');
  }, [navigation]);

  const bottomBarActions: Action[] = useMemo(
    () =>
      compact([
        {
          label: 'Fast Accept',
          onPress: submitBatchCount,
          buttonStyle: styles.fastAccept,
          textStyle: styles.fastAcceptText,
          isLoading: submitLoading,
        },
        {
          label: 'Create Summary',
          onPress: onVerify,
        },
      ]),
    [submitBatchCount, onVerify, submitLoading],
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

  const scrollToTopAndDismissKeyboard = useCallback(() => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    Keyboard.dismiss();
  }, []);

  useFocusEventBus('add-new-item', scrollToTopAndDismissKeyboard);

  useFocusEventBus('updated-item', scrollToTopAndDismissKeyboard);

  return (
    <>
      <FixedLayout>
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
