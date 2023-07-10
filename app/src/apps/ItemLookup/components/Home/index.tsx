import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { SearchError } from '@apps/ItemLookup/hooks/useItemLookup';
import { ErrorContainer } from '@components/ErrorContainer';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { SkuSearchBar } from '@components/SkuSearchBar';
import { Colors } from '@lib/colors';

interface ItemLookupHomeProps {
  onSubmit?(value: string): void;
  error?: SearchError;
  loading: boolean;
  searchBarStyle?: StyleProp<ViewStyle>;
}

export function ItemLookupHome({
  onSubmit,
  searchBarStyle,
  error,
  loading,
}: ItemLookupHomeProps) {
  const hasNotFoundError = error && error.isNotFoundError;
  return (
    <>
      <SkuSearchBar onSubmit={onSubmit} containerStyle={searchBarStyle} />
      {!hasNotFoundError && !loading && (
        <ScanBarcodeLabel label="Scan Barcode" style={styles.scanBarcode} />
      )}
      {loading && (
        <ActivityIndicator
          size="large"
          style={styles.loadingIndicator}
          color={Colors.mediumVoid}
        />
      )}
      {hasNotFoundError && !loading && (
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
