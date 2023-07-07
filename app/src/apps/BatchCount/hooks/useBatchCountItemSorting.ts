import { useCallback, useEffect, useState } from 'react';
import { sortBy } from 'lodash-es';
import { useFocusEffect } from '@react-navigation/native';
import { BatchCountItem } from 'src/types/BatchCount';
import { findAndPrependItem } from '@lib/array';
import { useFocusEventBus } from '../../../hooks/useEventBus';

export function useBatchCountItemSorting(batchCountItems: BatchCountItem[]) {
  const [sortedItems, setSortedItems] = useState(batchCountItems);

  const [newItem, setNewItem] = useState<string>();

  const addNewItem = useCallback(
    (sku: string) => {
      const itemToAdd = batchCountItems.find(item => item.item.sku === sku);
      itemToAdd ? setSortedItems([itemToAdd, ...sortedItems]) : setNewItem(sku);
    },
    [sortedItems, batchCountItems],
  );

  useEffect(() => {
    if (newItem && batchCountItems.find(item => item.item.sku === newItem)) {
      addNewItem(newItem);
      setNewItem(undefined);
    }
  }, [addNewItem, newItem, batchCountItems]);

  const updateSortedItems = useCallback((newItems: BatchCountItem[]) => {
    setSortedItems(newItems);
  }, []);
  const withRemovedItem = useCallback(
    (sku: string) => sortedItems.filter(item => item.item.sku !== sku),
    [sortedItems],
  );

  const sortOnRefocus = useCallback(() => {
    setSortedItems(sortBy(sortedItems, item => !item.isBookmarked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(sortOnRefocus);

  useFocusEventBus('add-new-item', addedItem => {
    addNewItem(addedItem);
  });
  useFocusEventBus('updated-item', sku => {
    const updatedItem = batchCountItems.find(item => item.item.sku === sku);
    if (updatedItem) {
      updateSortedItems(findAndPrependItem(sortedItems, updatedItem));
    }
  });
  useFocusEventBus('removed-item', sku =>
    updateSortedItems(withRemovedItem(sku)),
  );

  return sortedItems;
}
