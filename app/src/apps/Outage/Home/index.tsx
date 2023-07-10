import { ActivityIndicator, StyleSheet } from 'react-native';
import { ErrorContainer } from '@components/ErrorContainer';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { SkuSearchBar } from '@components/SkuSearchBar';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useScanCodeListener } from '@services/ScanCode';
import { toastService } from '@services/ToastService';
import { NotFoundError } from '../errors/NotFoundError';
import { useOutageState } from '../state';

export function OutageHome() {
  const { requestToAddItem } = useOutageState();
  const {
    trigger: addItem,
    loading,

    // TODO: Reset this when going back to this screen?
    error: searchError,
  } = useAsyncAction(
    (sku: string) => {
      return requestToAddItem(sku);
    },
    {
      globalErrorHandling: error => {
        if (error instanceof NotFoundError) {
          return 'ignored';
        }

        return {
          displayAs: 'toast',
        };
      },
    },
  );

  useScanCodeListener(code => {
    switch (code.type) {
      case 'front-tag':
      case 'sku':
        addItem(code.sku);
        break;

      default:
        // TODO: Duplication with the other Outage screen
        toastService.showInfoToast(
          'Cannot scan this type of barcode. Supported are front tags and backroom tags.',
        );
    }
  });

  return (
    <FixedLayout style={styles.container}>
      <SkuSearchBar onSubmit={addItem} />

      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.mediumVoid}
          style={styles.loadingIndicator}
        />
      )}

      {!(searchError instanceof NotFoundError) && !loading && (
        <ScanBarcodeLabel label="Scan For Outage" style={styles.scanBarcode} />
      )}

      {searchError instanceof NotFoundError && !loading && (
        <ErrorContainer
          title="No Results Found"
          message="Try searching for another SKU or scanning a front tag"
        />
      )}
    </FixedLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
  },
  loadingIndicator: {
    marginTop: 144,
  },
  scanBarcode: {
    marginTop: 88,
  },
  error: {
    marginVertical: 28,
    marginHorizontal: 30,
  },
  errorTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: FontWeight.Bold,
    color: Colors.advanceBlack,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.black,
  },
});
