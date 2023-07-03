import { ApolloError } from '@apollo/client';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { SkuSearchBar } from '@components/SkuSearchBar';
import { useFocusEventBus } from '@hooks/useEventBus';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { useCurrentSessionInfo } from '@services/Auth';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ErrorContainer } from '@components/ErrorContainer';
import { useManagedLazyQuery } from '@hooks/useManagedLazyQuery';
import { BehaviourOnFailure } from '@services/ErrorState/types';
import { ITEM_BY_SKU, useBatchCountState } from '../state';

export function BatchCountHome() {
  const { addItem } = useBatchCountState();
  const { storeNumber } = useCurrentSessionInfo();
  const [error, setError] = useState<ApolloError>();

  const { perform: searchBySku, loading: isLoadingItemBySku } =
    useManagedLazyQuery(ITEM_BY_SKU, {
      onError(searchError) {
        setError(searchError);
      },
      onCompleted: item => {
        addItem(item.itemBySku ?? undefined, false);
        setError(undefined);
      },
      globalErrorHandling: {
        interceptError: () => ({
          behaviourOnFailure: BehaviourOnFailure.Toast,
        }),
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

  useFocusEventBus('search-error', searchError => {
    setError(searchError);
  });

  useFocusEventBus('search-success', () => {
    setError(undefined);
  });

  return (
    <FixedLayout style={styles.container}>
      <SkuSearchBar onSubmit={onSubmit} />
      {/* TODO: Check the error, don't assume every error is NotFound */}
      {!error && !isLoadingItemBySku && (
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
      {error && !isLoadingItemBySku && (
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
