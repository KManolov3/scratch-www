import { RefObject, useCallback, useEffect, useState } from 'react';
import { sortBy } from 'lodash-es';
import { useFocusEffect } from '@react-navigation/native';
import { BatchCountItem } from 'src/types/BatchCount';
import { findAndPrependItem } from '@lib/array';
import { FlatList, Keyboard } from 'react-native';
import { useFocusEventBus } from '../../../hooks/useEventBus';

export function useBatchCountItemSorting(
  batchCountItems: BatchCountItem[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flatListRef: RefObject<FlatList<any>>,
) {
  const [sortedItems, setSortedItems] = useState(batchCountItems);

  const [newItem, setNewItem] = useState<string>();

  const addNewItem = useCallback(
    (sku: string) => {
      const itemToAdd = batchCountItems.find(({ item }) => item.sku === sku);
      if (itemToAdd) {
        setSortedItems([itemToAdd, ...sortedItems]);
      } else {
        setNewItem(sku);
      }
    },
    [sortedItems, batchCountItems],
  );

  useEffect(() => {
    if (newItem && batchCountItems.find(({ item }) => item.sku === newItem)) {
      addNewItem(newItem);
      setNewItem(undefined);
    }
  }, [addNewItem, newItem, batchCountItems]);

  const updateSortedItems = useCallback((newItems: BatchCountItem[]) => {
    setSortedItems(newItems);
  }, []);
  const withRemovedItem = useCallback(
    (sku: string) => sortedItems.filter(({ item }) => item.sku !== sku),
    [sortedItems],
  );

  useFocusEffect(() => {
    setSortedItems(sortBy(sortedItems, item => !item.isBookmarked));
  });

  const scrollToTopAndDismissKeyboard = useCallback(() => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    Keyboard.dismiss();
  }, [flatListRef]);

  useFocusEventBus('add-new-item', addedItem => {
    addNewItem(addedItem);
    scrollToTopAndDismissKeyboard();
  });
  useFocusEventBus('updated-item', sku => {
    const updatedItem = batchCountItems.find(({ item }) => item.sku === sku);
    if (updatedItem) {
      updateSortedItems(findAndPrependItem(sortedItems, updatedItem));
      scrollToTopAndDismissKeyboard();
    }
  });
  useFocusEventBus('removed-item', sku =>
    updateSortedItems(withRemovedItem(sku)),
  );

  return sortedItems;
}
