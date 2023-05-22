// The store is hardcoded until the launcher can start providing an authentication
// token to the app, containing the current active store.

import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Action, BottomActionBar } from '@components/BottomActionBar';
import { toPairs } from 'lodash-es';
import { List } from '@components/List';
import { BatchCountItem, useBatchCountState } from '../state';

export function BatchCountConfirm() {
  const { submit: submitBatchCount, batchCountItems } = useBatchCountState();

  const batchCountItemArr: BatchCountItem[] = useMemo(
    () => toPairs(batchCountItems).map(([sku, item]) => ({ sku, ...item })),
    [batchCountItems],
  );

  const bottomBarActions: Action[] = useMemo(
    () => [
      {
        label: 'COMPLETE BATCH COUNT',
        // TODO: add price confirmation modal
        onPress: submitBatchCount,
      },
    ],
    [submitBatchCount],
  );

  const listItemInfo = useMemo(
    () => [
      {
        label: 'P/N',
        getValue: ({ item }: BatchCountItem) => item.mfrPartNum ?? 'undefined',
      },
      {
        label: 'Current',
        getValue: ({ item }: BatchCountItem) => item.onHand ?? -1,
      },
      {
        label: 'New',
        getValue: ({ newQty }: BatchCountItem) => newQty,
      },
    ],
    [],
  );

  return (
    <View style={styles.container}>
      <List itemInfo={listItemInfo} data={batchCountItemArr} />
      <BottomActionBar actions={bottomBarActions} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
