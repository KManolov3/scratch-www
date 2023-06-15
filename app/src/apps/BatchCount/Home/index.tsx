import { useLazyQuery } from '@apollo/client';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { SearchBar } from '@components/SearchBar';
import { Text } from '@components/Text';
import { FixedLayout } from '@layouts/FixedLayout';
import { useCurrentSessionInfo } from '@services/Auth';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';
import { Header } from '@components/Header';
import { ITEM_BY_SKU, useBatchCountState } from '../state';

export function BatchCountHome() {
  const { addItem } = useBatchCountState();
  const { storeNumber } = useCurrentSessionInfo();
  // TODO: use loading state to display a loading indicator
  // TODO: since there is a "search" functionality on the BatchCountConfirm
  // page as well, I wonder if I should extract this in the `state` component
  const [searchBySku, { loading: isLoadingItemBySku, error: errorBySku }] =
    useLazyQuery(ITEM_BY_SKU, {
      onCompleted: item => addItem(item.itemBySku ?? undefined),
    });

  const onSubmit = useCallback(
    (sku: string) => {
      if (sku) {
        searchBySku({ variables: { sku, storeNumber } });
      }
    },
    [searchBySku, storeNumber],
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
