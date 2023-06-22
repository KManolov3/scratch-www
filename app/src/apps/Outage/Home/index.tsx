import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { SkuSearchBar } from '@components/SearchBar';
import { FixedLayout } from '@layouts/FixedLayout';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';
import { Header } from '@components/Header';
import { ErrorContainer } from '@components/ErrorContainer';
import { FontWeight } from '@lib/font';
import { useOutageState } from '../state';

export function OutageHome() {
  const { addItem, itemLoading, itemError } = useOutageState();

  const header = <Header title="Outage" />;

  return (
    <FixedLayout style={styles.container} header={header}>
      <SkuSearchBar onSubmit={addItem} />

      {itemLoading && (
        <ActivityIndicator
          size="large"
          color={Colors.mediumVoid}
          style={styles.loadingIndicator}
        />
      )}

      {!itemError && !itemLoading && (
        <ScanBarcodeLabel label="Scan For Outage" style={styles.scanBarcode} />
      )}

      {itemError && !itemLoading && (
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
