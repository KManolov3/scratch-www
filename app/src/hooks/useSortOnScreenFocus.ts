import { sortBy } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Sorts an array according to keys in another array.
 *
 * The parameters should be pretty self-explanatory but here is an example:
 *
 *
 * const products = [{ id: 3, ... }, { id: 1, ... }, { id: 2, ... }]
 * const idsToSortLike = [2, 1, 3]
 *
 * const sortedProducts = sortLike(products, _ => _.id, idsToSortLike)
 *
 * sortedProducts //=> [{ id: 2, ... }, { id: 1, ... }, { id: 3, ... }]
 */
export function sortLike<T, K>(
  arrayToSort: T[],
  keyFn: (item: T) => K,
  arrayOfKeysToSortLike: K[],
  { shouldAddUnknownToStart }: { shouldAddUnknownToStart?: boolean } = {},
) {
  const inverseKeyIndex = new Map<K, number>();

  arrayOfKeysToSortLike.forEach((key, index) =>
    inverseKeyIndex.set(key, index),
  );

  return sortBy(
    arrayToSort,
    item =>
      inverseKeyIndex.get(keyFn(item)) ??
      (shouldAddUnknownToStart ? -1 : Infinity),
  );
}

/**
 * Sorts @param arr in an order defined by @param sortFn.
 * `sortFn` is only reapplied when the navigation screen is focused
 * (for example, going into another screen and then returning to the original one)
 * Any further items passed between `sortFn` calls
 * are attached to the beginning of the sorted array. Items are distinguised by
 * their keys, which are extracted by @param keyFn, to avoid having to do deep comparisons.
 */
export function useSortOnScreenFocus<T, K>(
  arr: T[],
  sortFn: (arr: T[]) => T[],
  keyFn: (arr: T) => K,
) {
  const [prevSortedSkus, setPrevSortedSkus] = useState(() =>
    sortFn(arr).map(item => keyFn(item)),
  );

  useFocusEffect(
    useCallback(
      () => setPrevSortedSkus(sortFn(arr).map(item => keyFn(item))),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    ),
  );

  const sortedItems = useMemo(
    () =>
      sortLike(arr, keyFn, prevSortedSkus, { shouldAddUnknownToStart: true }),
    [arr, keyFn, prevSortedSkus],
  );

  return sortedItems;
}
