// The store is hardcoded until the launcher can start providing an authentication
// token to the app, containing the current active store.

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  ToastAndroid,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { useNavigation } from '@react-navigation/native';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { compact } from 'lodash-es';
import { ShrinkageOverageModal } from '@components/ShrinkageOverageModal';
import { Header } from '@components/Header';
import { useBooleanState } from '@hooks/useBooleanState';
import { toastService } from 'src/services/ToastService';
import { BatchCountNavigation } from '../navigator';
import { useBatchCountState } from '../state';
import { BatchCountItemCard } from '../components/BatchCountItemCard';

export function BatchCountList() {
  const {
    batchCountItems,
    submit: submitBatch,
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
        },
        {
          label: 'Create Summary',
          onPress: onVerify,
        },
      ]),
    [enableShrinkageModal, onVerify],
  );

  useEffect(() => {
    if (submitError) {
      ToastAndroid.show(submitError.message, ToastAndroid.LONG);
    }
  }, [submitError]);

  const header = useMemo(() => <Header title="Batch Count" />, []);

  // TODO: Show loading indicator on submit

  return (
    <>
      <FixedLayout header={header}>
        <FlatList data={batchCountItemsSorted} renderItem={renderItem} />
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
        // TODO: Should this be in a useCallback?
        onCancel={disableShrinkageModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
