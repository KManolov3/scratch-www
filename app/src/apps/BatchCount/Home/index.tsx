import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ErrorContainer } from '@components/ErrorContainer';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { SkuSearchBar } from '@components/SkuSearchBar';
import { useFocusEventBus } from '@hooks/useEventBus';
import { useManagedLazyQuery } from '@hooks/useManagedLazyQuery';
import { FixedLayout } from '@layouts/FixedLayout';
import { isApolloNoResultsError } from '@lib/apollo';
import { Colors } from '@lib/colors';
import { useCurrentSessionInfo } from '@services/Auth';
import { ITEM_BY_SKU, useBatchCountState } from '../state';

export function BatchCountHome() {
  const { addItem } = useBatchCountState();
  const { storeNumber } = useCurrentSessionInfo();
  const [hasNoResultsError, setHasNoResultsError] = useState<boolean>(false);

  const { trigger: searchBySku, loading: isLoadingItemBySku } =
    useManagedLazyQuery(ITEM_BY_SKU, {
      onCompleted: item => {
        if (item.itemBySku) {
          addItem(item.itemBySku, false);
        }

        setHasNoResultsError(false);
      },
      globalErrorHandling: error => {
        const isNoResultsError = isApolloNoResultsError(error);
        setHasNoResultsError(isNoResultsError);
        if (isNoResultsError) {
          return 'ignored';
        }

        return {
          displayAs: 'toast',
        };
      },
    });

  const onSubmit = useCallback(
    (sku: string) => {
      if (sku) {
        searchBySku({ variables: { sku, storeNumber } });
      }
    },
    [searchBySku, storeNumber],
  );

  useFocusEventBus('search-error', ({ isNoResultsError }) => {
    setHasNoResultsError(isNoResultsError);
  });

  useFocusEventBus('search-success', () => {
    setHasNoResultsError(false);
  });

  return (
    <FixedLayout style={styles.container}>
      <SkuSearchBar onSubmit={onSubmit} />
      {!hasNoResultsError && !isLoadingItemBySku && (
        <ScanBarcodeLabel
          label="Scan to Start Batch Count"
          style={styles.scanBarcode}
        />
      )}
      {isLoadingItemBySku && (
        <ActivityIndicator
          size="large"
          style={styles.loadingIndicator}
          color={Colors.mediumVoid}
        />
      )}
      {hasNoResultsError && !isLoadingItemBySku && (
        <ErrorContainer
          title="No Results Found"
          message="Try searching for another SKU or scanning a barcode"
        />
      )}
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
  loadingIndicator: {
    marginTop: 144,
  },
});
