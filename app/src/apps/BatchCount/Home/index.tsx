import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { NoResultsError } from 'src/errors/NoResultsError';
import { ErrorContainer } from '@components/ErrorContainer';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { SkuSearchBar } from '@components/SkuSearchBar';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { useBatchCountSearchAndScanListener } from '../hooks/useBatchCountSearchAndScanListener';

export function BatchCountHome() {
  const { searchAndAddItem, loading, error } =
    useBatchCountSearchAndScanListener();

  const onSubmit = useCallback(
    (sku: string) => {
      if (sku) {
        searchAndAddItem({ sku });
      }
    },
    [searchAndAddItem],
  );
  const hasNoResultsError = error instanceof NoResultsError;

  return (
    <FixedLayout style={styles.container}>
      <SkuSearchBar onSubmit={onSubmit} />
      {!hasNoResultsError && !loading && (
        <ScanBarcodeLabel
          label="Scan to Start Batch Count"
          style={styles.scanBarcode}
        />
      )}
      {loading && (
        <ActivityIndicator
          size="large"
          style={styles.loadingIndicator}
          color={Colors.mediumVoid}
        />
      )}
      {hasNoResultsError && !loading && (
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
