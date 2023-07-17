import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ErrorContainer } from '@components/ErrorContainer';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { SkuSearchBar } from '@components/SkuSearchBar';
import { NoItemResultsError } from '@hooks/useItemSearch';
import { Colors } from '@lib/colors';

interface ItemLookupHomeProps {
  onSubmit?(value: string): void;
  error?: unknown;
  loading: boolean;
  searchBarStyle?: StyleProp<ViewStyle>;
  barcodeStyle?: StyleProp<ViewStyle>;
}

export function ItemLookupHome({
  onSubmit,
  searchBarStyle,
  barcodeStyle,
  error,
  loading,
}: ItemLookupHomeProps) {
  const hasNoItemResultsError = error instanceof NoItemResultsError;
  return (
    <>
      <SkuSearchBar onSubmit={onSubmit} containerStyle={searchBarStyle} />
      {!hasNoItemResultsError && !loading && (
        <ScanBarcodeLabel
          label="Scan Barcode"
          style={[styles.scanBarcode, barcodeStyle]}
        />
      )}
      {loading && (
        <ActivityIndicator
          size="large"
          style={styles.loadingIndicator}
          color={Colors.mediumVoid}
        />
      )}
      {hasNoItemResultsError && !loading && (
        <ErrorContainer
          title="No Results Found"
          message="Try searching for another SKU or scanning a barcode"
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scanBarcode: {
    margin: 20,
    marginTop: 88,
  },
  loadingIndicator: {
    marginTop: 144,
  },
});
