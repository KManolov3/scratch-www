import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { SearchBar } from '@components/SearchBar';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { Text } from '@components/Text';
import { gql } from 'src/__generated__';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Header } from '@components/Header';
import { ItemLookupNavigation } from '../navigator';

const ITEM_BY_SKU = gql(`
  query ManualItemLookup($sku: String!) {
    itemBySku(sku: $sku, storeNumber: "0363") {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

export function ItemLookupHome() {
  const navigation = useNavigation<ItemLookupNavigation>();
  const [searchBySku, { loading: isLoadingItemBySku, error: errorBySku }] =
    useLazyQuery(ITEM_BY_SKU);

  const onSubmit = useCallback(
    (value: string) => {
      return searchBySku({
        variables: { sku: value },
        onCompleted: item => {
          if (item.itemBySku) {
            return navigation.navigate('ItemLookup', {
              itemDetails: item.itemBySku,
            });
          }
        },
      });
    },
    [navigation, searchBySku],
  );

  const header = useMemo(() => <Header title="Item Lookup" />, []);

  if (errorBySku) {
    return (
      <View>
        <Text>{errorBySku?.message ?? 'Unknown error'}</Text>
      </View>
    );
  }

  return (
    <FixedLayout header={header}>
      <SearchBar onSubmit={onSubmit} />
      {isLoadingItemBySku ? (
        <ActivityIndicator />
      ) : (
        <ScanBarcodeLabel label="Scan Barcode" style={styles.scanBarcode} />
      )}
    </FixedLayout>
  );
}

const styles = StyleSheet.create({
  scanBarcode: {
    margin: 20,
    marginTop: 88,
  },
});
