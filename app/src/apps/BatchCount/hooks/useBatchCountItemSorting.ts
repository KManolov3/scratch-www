import { useCallback, useState } from 'react';
import { sortBy } from 'lodash-es';
import { useFocusEffect } from '@react-navigation/native';
import { BatchCountItem } from 'src/types/BatchCount';
import { useFocusEventBus } from '../../../hooks/useEventBus';
import { sortLike } from '../../../hooks/useSortOnScreenFocus';

export function useBatchCountItemSorting(batchCountItems: BatchCountItem[]) {
  const sortFn = useCallback(
    (items: BatchCountItem[]) => sortBy(items, item => item.isBookmarked),
    [],
  );
  const keyFn = useCallback(({ item }: BatchCountItem) => item.sku, []);
  const [sortedItems, setSortedItems] = useState(batchCountItems);

  const updateSortedItems = useCallback(
    (newItems?: BatchCountItem[]) => {
      setSortedItems(newItems ?? batchCountItems);
    },
    [batchCountItems],
  );

  const withPrependedItem = useCallback(
    (sku: string) => {
      const itemToPrepend = batchCountItems.find(
        item => item.item.sku === sku,
        sortedItems,
      );
      return itemToPrepend
        ? [itemToPrepend, ...sortedItems.filter(item => item.item.sku !== sku)]
        : batchCountItems;
    },
    [batchCountItems, sortedItems],
  );

  const withRemovedItem = useCallback(
    (sku: string) => sortedItems.filter(item => item.item.sku !== sku),
    [sortedItems],
  );

  const [prevSortedSkus, setPrevSortedSkus] = useState(() =>
    sortFn(batchCountItems).map(item => keyFn(item)),
  );

  const sortOnRefocus = useCallback(() => {
    setPrevSortedSkus(sortFn(batchCountItems).map(item => keyFn(item)));

    const resortedItems = sortLike(batchCountItems, keyFn, prevSortedSkus, {
      shouldAddUnknownToStart: true,
    });
    setSortedItems(resortedItems);
  }, [batchCountItems, keyFn, prevSortedSkus, sortFn]);

  useFocusEffect(sortOnRefocus);

  useFocusEventBus('add-new-item', newItem => {
    updateSortedItems([newItem, ...sortedItems]);
  });
  useFocusEventBus('updated-item', sku =>
    updateSortedItems(withPrependedItem(sku)),
  );
  useFocusEventBus('removed-item', sku =>
    updateSortedItems(withRemovedItem(sku)),
  );

  return sortedItems;
}
