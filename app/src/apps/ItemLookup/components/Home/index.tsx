import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ApolloError, useLazyQuery } from '@apollo/client';
import { SkuSearchBar } from '@components/SearchBar';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { gql } from 'src/__generated__';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ItemLookupNavigation } from '@apps/ItemLookup/navigator';
import { ErrorContainer } from '@components/ErrorContainer';
import { Colors } from '@lib/colors';
import { useCurrentSessionInfo } from '@services/Auth';
import { useFocusEventBus } from '@hooks/useEventBus';

const ITEM_BY_SKU = gql(`
  query ItemLookupHomeManualItemLookup($sku: String!, $storeNumber: String!) {
    itemBySku(sku: $sku, storeNumber: $storeNumber) {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

interface ItemLookupHomeProps {
  onSubmit?(): void;
  searchBarStyle?: StyleProp<ViewStyle>;
}

export function ItemLookupHome({
  onSubmit,
  searchBarStyle,
}: ItemLookupHomeProps) {
  const { navigate } = useNavigation<ItemLookupNavigation>();
  const [error, setError] = useState<ApolloError>();

  const [searchBySku, { loading: isLoadingItemBySku }] = useLazyQuery(
    ITEM_BY_SKU,
    {
      onError(searchError) {
        setError(searchError);
      },
      onCompleted: item => {
        onSubmit?.();
        if (item.itemBySku) {
          setError(undefined);
          return navigate('ItemLookup', {
            itemDetails: item.itemBySku,
          });
        }
      },
    },
  );

  const { storeNumber } = useCurrentSessionInfo();

  useFocusEventBus('search-error', searchError => {
    setError(searchError);
  });

  useFocusEventBus('search-success', () => {
    setError(undefined);
  });

  const submit = useCallback(
    (value: string) => {
      return searchBySku({
        variables: { sku: value, storeNumber },
      });
    },
    [searchBySku, storeNumber],
  );

  return (
    <>
      <SkuSearchBar onSubmit={submit} containerStyle={searchBarStyle} />
      {!error && !isLoadingItemBySku && (
        <ScanBarcodeLabel label="Scan Barcode" style={styles.scanBarcode} />
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
          message="Try searching for another SKU or scanning another barcode"
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
