import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { SkuSearchBar } from '@components/SkuSearchBar';
import { FixedLayout } from '@layouts/FixedLayout';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';
import { ErrorContainer } from '@components/ErrorContainer';
import { FontWeight } from '@lib/font';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useScanCodeListener } from '@services/ScanCode';
import { toastService } from '@services/ToastService';
import { useOutageState } from '../state';

export function OutageHome() {
  const { requestToAddItem } = useOutageState();

  const {
    trigger: addItem,
    loading,

    // TODO: Reset this when going back to this screen?
    error,
  } = useAsyncAction((sku: string) => requestToAddItem(sku));

  useScanCodeListener({
    onSku: ({ sku }) => addItem(sku),
    onUnsupportedCode() {
      toastService.showInfoToast(
        'Cannot scan this type of barcode. Supported are front tags and backroom tags.',
      );
    },
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

      {!error && !loading && (
        <ScanBarcodeLabel label="Scan For Outage" style={styles.scanBarcode} />
      )}

      {/* TODO: Distinguish between not found and other errors */}
      {!!error && !loading && (
        <ErrorContainer
          title="No Results Found"
          message="Try searching for another SKU or scanning another front tag"
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
