import { useNavigation } from '@react-navigation/native';
import { useScanCodeListener } from '@services/ScanCode';
import { gql } from 'src/__generated__';
import { ApolloError, useLazyQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useCurrentSessionInfo } from '@services/Auth';
import { ItemLookupNavigation } from '../navigator';

const ITEM_BY_SKU = gql(`
query ManualItemLookup($sku: String!, $storeNumber: String!) {
  itemBySku(sku: $sku, storeNumber: $storeNumber) {
    ...ItemInfoHeaderFields
    ...PlanogramFields
    ...BackstockSlotFields
  },
}
`);

const ITEM_BY_UPC = gql(`
query AutomaticItemLookup($upc: String!, $storeNumber: String!) {
  itemByUpc(upc: $upc, storeNumber: $storeNumber) {
    ...ItemInfoHeaderFields
    ...PlanogramFields
    ...BackstockSlotFields
  },
}
`);

interface useItemLookupScanCodeListenerProps {
  onError?: (error: ApolloError) => void;
}

export function useItemLookupScanCodeListener({
  onError,
}: useItemLookupScanCodeListenerProps = {}) {
  const { navigate } = useNavigation<ItemLookupNavigation>();
  const { storeNumber } = useCurrentSessionInfo();

  const [queryBySku, { loading: isLoadingItemBySku, error: skuError }] =
    useLazyQuery(ITEM_BY_SKU, { onError });
  const [queryByUpc, { loading: isLoadingItemByUpc, error: upcError }] =
    useLazyQuery(ITEM_BY_UPC, { onError });

  const loading = useMemo(
    () => isLoadingItemBySku && isLoadingItemByUpc,
    [isLoadingItemBySku, isLoadingItemByUpc],
  );
  const error = useMemo(() => skuError ?? upcError, [skuError, upcError]);

  const searchBySku = useCallback(
    (value: string, frontTagPrice?: number) => {
      return queryBySku({
        variables: { sku: value, storeNumber },
        onCompleted: itemDetails => {
          if (itemDetails.itemBySku) {
            navigate('ItemLookup', {
              itemDetails: itemDetails.itemBySku,
              frontTagPrice,
            });
          }
        },
      });
    },
    [navigate, queryBySku, storeNumber],
  );

  useScanCodeListener({
    onSku({ sku }) {
      searchBySku(sku);
    },
    onFrontTag({ sku, frontTagPrice }) {
      searchBySku(sku, frontTagPrice);
    },
    onUpc({ upc }) {
      queryByUpc({
        variables: { storeNumber, upc },
        onCompleted: itemDetails => {
          if (itemDetails.itemByUpc) {
            navigate('ItemLookup', {
              itemDetails: itemDetails.itemByUpc,
            });
          }
        },
      });
    },
  });

  return { searchBySku, loading, error };
}
