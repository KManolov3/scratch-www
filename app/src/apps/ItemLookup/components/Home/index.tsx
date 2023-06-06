import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { SearchBar } from '@components/SearchBar';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { Text } from '@components/Text';
import { gql } from 'src/__generated__';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ItemLookupNavigation } from '@apps/ItemLookup/navigator';

const ITEM_BY_SKU = gql(`
  query ManualItemLookup($sku: String!) {
    itemBySku(sku: $sku, storeNumber: "0363") {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

interface ItemLookupHomeProps {
  onSubmit?(): void;
}

export function ItemLookupHome({ onSubmit }: ItemLookupHomeProps) {
  const navigation = useNavigation<ItemLookupNavigation>();
  const [searchBySku, { loading: isLoadingItemBySku, error: errorBySku }] =
    useLazyQuery(ITEM_BY_SKU);

  const submit = useCallback(
    (value: string) => {
      return searchBySku({
        variables: { sku: value },
        onCompleted: item => {
          onSubmit?.();
          if (item.itemBySku) {
            return navigation.navigate('ItemLookup', {
              itemDetails: item.itemBySku,
            });
          }
        },
      });
    },
    [navigation, onSubmit, searchBySku],
  );

  if (errorBySku) {
    return (
      <View>
        <Text>{errorBySku?.message ?? 'Unknown error'}</Text>
      </View>
    );
  }

  return (
    <>
      <SearchBar onSubmit={submit} />
      {isLoadingItemBySku ? (
        <ActivityIndicator />
      ) : (
        <ScanBarcodeLabel label="Scan Barcode" style={styles.scanBarcode} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scanBarcode: {
    margin: 20,
    marginTop: 88,
  },
});
