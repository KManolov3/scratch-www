import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, ListRenderItem, StyleSheet } from 'react-native';
import { NoResultsError } from 'src/errors/NoResultsError';
import { toastService } from 'src/services/ToastService';
import { WhiteBackArrow } from '@assets/icons';
import { BottomActionBar } from '@components/BottomActionBar';
import { BlockButton } from '@components/Button/Block';
import { Header } from '@components/Header';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useConfirmation } from '@hooks/useConfirmation';
import { useFocusEventBus } from '@hooks/useEventBus';
import { useLatestRef } from '@hooks/useLatestRef';
import { FixedLayout } from '@layouts/FixedLayout';
import { isErrorWithMessage } from '@lib/error';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useErrorManager } from '@services/ErrorContext';
import { BatchCountItemCard } from '../components/BatchCountItemCard';
import { useBatchCountSearchAndScanListener } from '../hooks/useBatchCountSearchAndScanListener';
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
    applySorting,
    batchCountItems,
  } = useBatchCountState();
  const navigation = useNavigation<BatchCountNavigation>();

  const { confirmationRequested, askForConfirmation, accept, reject } =
    useConfirmation();

  const { executeWithGlobalErrorHandling } = useErrorManager();

  const flatListRef = useRef<FlatList>(null);

  const [expandedSku, setExpandedSku] = useState<string>();

  useBatchCountSearchAndScanListener({
    onError: error => {
      if (error instanceof NoResultsError) {
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
      Object.values(batchCountItems).map(({ item, newQty }) => ({
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
        isSummary
        onBookmark={() => onBookmark(item.sku, !!isBookmarked)}
        onRemove={() => onRemove(item)}
        onClick={() => onClick(item.sku)}
        style={styles.card}
      />
    ),
    [expandedSku, setNewQuantity, onBookmark, onRemove, onClick],
  );

  const { trigger: submitBatchCount } = useAsyncAction(
    async () => {
      if (await askForConfirmation()) {
        await executeWithGlobalErrorHandling(submitBatch, () => ({
          displayAs: 'modal',
          message: `Error while submitting batch count. ${
            isErrorWithMessage(submitError)
              ? submitError.message
              : 'An unknown server error has occured'
          }`,
          allowRetries: true,
        }));
      }
    },
    {
      globalErrorHandling: 'disabled',
    },
  );

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
          data={batchCountItems}
          renderItem={renderItem}
          ref={flatListRef}
        />

        <BottomActionBar>
          <BlockButton
            variant="primary"
            style={styles.actionButton}
            onPress={submitBatchCount}
            isLoading={submitLoading}>
            Approve Count
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
