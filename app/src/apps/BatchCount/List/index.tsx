import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, ListRenderItem, StyleSheet } from 'react-native';
import { Item } from 'src/__generated__/graphql';
import { toastService } from 'src/services/ToastService';
import { BatchCountItem } from 'src/types/BatchCount';
import { BottomActionBar } from '@components/BottomActionBar';
import { BlockButton } from '@components/Button/Block';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useConfirmation } from '@hooks/useConfirmation';
import { useFocusEventBus } from '@hooks/useEventBus';
import { FixedLayout } from '@layouts/FixedLayout';
import { useNavigation } from '@react-navigation/native';
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
    sortByBookmark,
  } = useBatchCountState();
  const navigation = useNavigation<BatchCountNavigation>();

  const { confirmationRequested, askForConfirmation, accept, reject } =
    useConfirmation();

  const flatListRef = useRef<FlatList>(null);
  const [expandedSku, setExpandedSku] = useState<string>();

  const setNewQuantity = useCallback(
    (sku: string, newQty: number) => {
      updateItem(
        sku,
        {
          newQty,
        },
        true,
      );
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
  }, [flatListRef]);

  useFocusEventBus(
    ['add-new-item', 'updated-item'],
    scrollToTopAndDismissKeyboard,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(sortByBookmark, []);

  return (
    <>
      <FixedLayout>
        {/* TODO: Extract the FlatList in a separate component and reuse it between here and the BatchCountSummary */}
        <FlatList
          contentContainerStyle={styles.list}
          data={batchCountItems}
          renderItem={renderItem}
          ref={flatListRef}
        />

        <BottomActionBar>
          <BlockButton
            variant="dark"
            style={styles.actionButton}
            onPress={submitBatchCount}
            isLoading={submitLoading}>
            Fast Accept
          </BlockButton>

          <BlockButton
            variant="primary"
            style={styles.actionButton}
            onPress={onVerify}>
            Create Summary
          </BlockButton>
        </BottomActionBar>
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
  actionButton: {
    flex: 1,
  },
  toast: {
    marginBottom: '10%',
  },
});
