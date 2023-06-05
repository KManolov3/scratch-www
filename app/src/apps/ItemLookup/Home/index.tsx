import { useLazyQuery } from '@apollo/client';
import { ScanBarcodeLabel } from '@components/ScanBarcodeLabel';
import { SearchBar } from '@components/SearchBar';
import { Text } from '@components/Text';
import { FixedLayout } from '@layouts/FixedLayout';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { gql } from 'src/__generated__';
import { ItemLookupNavigation } from '../navigator';

const ITEM_BY_SKU = gql(`
  query ItemLookupHomeManualItemLookup($sku: String!, $storeNumber: String!) {
    itemBySku(sku: $sku, storeNumber: $storeNumber) {
      ...ItemInfoHeaderFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

export function ItemLookupHome() {
  const navigation = useNavigation<ItemLookupNavigation>();
  const { storeNumber } = useCurrentSessionInfo();
  const [searchBySku, { loading: isLoadingItemBySku, error: errorBySku }] =
    useLazyQuery(ITEM_BY_SKU);

  const onSubmit = useCallback(
    (value: string) => {
      return searchBySku({
        variables: { sku: value, storeNumber },
        onCompleted: item => {
          if (item.itemBySku) {
            return navigation.navigate('ItemLookup', {
              itemDetails: item.itemBySku,
            });
          }
        },
      });
    },
    [navigation, searchBySku, storeNumber],
  );

  if (errorBySku) {
    return (
      <View>
        <Text>{errorBySku?.message ?? 'Unknown error'}</Text>
      </View>
    );
  }
  return (
    <FixedLayout>
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
