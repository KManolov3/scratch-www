import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { Text } from '@components/Text';
import { ManualItemLookupQuery } from 'src/__generated__/graphql';
import { gql } from 'src/__generated__';
import { SearchBar } from '@components/SearchBar';
import { Header } from '@components/Header';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { Colors } from '@lib/colors';
import { BatchCountNavigation } from '../navigator';
import { useBatchCountState } from '../state';

export type LookupType = 'UPC' | 'SKU';

const ITEM_BY_SKU = gql(`
  query ManualItemLookup($sku: String!) {
    itemBySku(sku: $sku, storeNumber: "0363") {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

// TODO: Handle this type of search inside of scan-barcode listener
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ITEM_BY_UPC = gql(`
  query AutomaticItemLookup($upc: String!) {
    itemByUpc(upc: $upc, storeNumber: "0363") {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

// TODO: Expand this so that it supports scanning front tags, which will provide additional info.
// Front Tags Barcode Structure - 99{SKU}{PRICE}
// TODO: Add option to navigate here with SKU
export function BatchCountHome() {
  const navigation = useNavigation<BatchCountNavigation>();
  const { batchCountItems, updateItem, addItem } = useBatchCountState();

  const onLookupCompleted = useCallback(
    (item: ManualItemLookupQuery) => {
      if (item?.itemBySku) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const itemInState = batchCountItems[item.itemBySku.sku!];

        if (!itemInState) {
          addItem({
            item: {
              ...item.itemBySku,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              sku: item.itemBySku.sku!,
            },
            newQty: 1,
          });
        } else {
          // Updating with the retrieved information even if the item already exists in the state
          // in case something changed (for example, the price) on the backend.
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          updateItem(item.itemBySku.sku!, {
            item: {
              ...item.itemBySku,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              sku: item.itemBySku.sku!,
            },
          });
        }
        navigation.navigate('List');
      }
    },
    [addItem, batchCountItems, navigation, updateItem],
  );

  // TODO: use loading state to display a loading indicator
  // TODO: since there is a "search" functionality on the BatchCountConfirm
  // page as well, I wonder if I should extract this in the `state` component
  const [searchBySku, { loading: isLoadingItemBySku, error: errorBySku }] =
    useLazyQuery(ITEM_BY_SKU, {
      onCompleted: onLookupCompleted,
    });

  const onSubmit = useCallback(
    (value: string) => {
      if (value) {
        searchBySku({ variables: { sku: value } });
      }
    },
    [searchBySku],
  );

  const header = useMemo(() => <Header title="Batch Count" />, []);

  if (isLoadingItemBySku) {
    return <ActivityIndicator size="large" />;
  }

  if (errorBySku) {
    return (
      <View>
        <Text>{errorBySku?.message ?? 'Unknown error'}</Text>
      </View>
    );
  }

  // TODO: Add no result modal

  return (
    <FixedLayout style={styles.container} header={header}>
      <SearchBar onSubmit={onSubmit} />
      <ScanBarcodeLabel
        label="Scan to Start Batch Count"
        style={styles.scanBarcode}
      />
    </FixedLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
  },
  scanBarcode: {
    margin: 20,
    marginTop: 88,
  },
});
