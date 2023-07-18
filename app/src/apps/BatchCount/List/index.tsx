import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, ListRenderItem, StyleSheet } from 'react-native';
import { toastService } from 'src/services/ToastService';
import { BottomActionBar } from '@components/BottomActionBar';
import { BlockButton } from '@components/Button/Block';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useConfirmation } from '@hooks/useConfirmation';
import { useFocusEventBus } from '@hooks/useEventBus';
import { NoItemResultsError } from '@hooks/useItemSearch';
import { useLatestRef } from '@hooks/useLatestRef';
import { FixedLayout } from '@layouts/FixedLayout';
import { isErrorWithMessage } from '@lib/error';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useErrorManager } from '@services/ErrorContext';
import { BatchCountItemCard } from '../components/BatchCountItemCard';
import { useBatchCountSearchAndScanListener } from '../hooks/useBatchCountSearchAndScanListener';
import { BatchCountNavigation } from '../navigator';
import { BatchCountItem, useBatchCountState } from '../state';

export function BatchCountList() {
  const {
    batchCountItems,
    submit: submitBatch,
    submitLoading,
    submitError,
    updateItem,
    removeItem,
    applySorting,
  } = useBatchCountState();
  const navigation = useNavigation<BatchCountNavigation>();

  const { executeWithGlobalErrorHandling } = useErrorManager();

  const { confirmationRequested, askForConfirmation, accept, reject } =
    useConfirmation();

  const flatListRef = useRef<FlatList>(null);
  const [expandedSku, setExpandedSku] = useState<string>();

  useBatchCountSearchAndScanListener({
    onError: error => {
      if (error instanceof NoItemResultsError) {
        toastService.showInfoToast(
          'No results found. Try searching for another SKU or scanning a barcode.',
          {
            props: { containerStyle: styles.toast },
          },
        );
      }
    },
    onComplete: ({ itemDetails }) => {
      reject();

      if (itemDetails?.sku !== expandedSku) {
        setExpandedSku(undefined);
      }
    },
  });

  const setNewQuantity = useCallback(
    (sku: string, newQty: number) => {
      updateItem(sku, { newQty }, { moveItemToTop: false });
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
      updateItem(
        sku,
        { isBookmarked: !isCurrentlyBookmarked },
        { moveItemToTop: false },
      );
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

  const { trigger: submitBatchCount } = useAsyncAction(
    async () => {
      if (await askForConfirmation()) {
        await executeWithGlobalErrorHandling(submitBatch, () => ({
          displayAs: 'modal',
          message: `Error while submitting batch count. ${
            isErrorWithMessage(submitError)
              ? submitError.message
              : 'An unknown server error has occurred'
          }`,
          allowRetries: true,
        }));
      }
    },
    { globalErrorHandling: () => 'ignored' },
  );

  const onVerify = useCallback(() => {
    navigation.navigate('Summary');
  }, [navigation]);

  const scrollToTopAndDismissKeyboard = useCallback(() => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    Keyboard.dismiss();
  }, [flatListRef]);

  useFocusEventBus('add-item-to-batch-count', scrollToTopAndDismissKeyboard);

  const applySortingRef = useLatestRef(applySorting);
  useFocusEffect(
    useCallback(() => applySortingRef.current(), [applySortingRef]),
  );

  return (
    <>
      <FixedLayout>
        {/* TODO: Extract the FlatList in a separate component and reuse it between here and the BatchCountSummary */}
        <FlatList
          contentContainerStyle={styles.list}
          data={batchCountItems}
          renderItem={renderItem}
          // According to https://reactnative.dev/docs/optimizing-flatlist-configuration#removeclippedsubviews
          // `false` should be the default value. But it isn't.
          removeClippedSubviews={false}
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
