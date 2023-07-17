import { gql } from 'src/__generated__/gql';
import { ResultOf } from '@graphql-typed-document-node/core';
import { SearchResult, useItemSearch } from '@hooks/useItemSearch';
import { useScanCodeListener } from '@services/ScanCode';
import { toastService } from '@services/ToastService';
import { useBatchCountState } from '../state';

export const ITEM_BY_SKU = gql(`
  query BatchCountItemBySkuLookup($sku: String!, $storeNumber: String!) {
    itemBySku(sku: $sku, storeNumber: $storeNumber) {
      ...ItemInfoFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

export const ITEM_BY_UPC = gql(`
  query BatchCountItemByUpcLookup($upc: String!, $storeNumber: String!) {
    itemByUpc(upc: $upc, storeNumber: $storeNumber) {
      ...ItemInfoFields
      ...PlanogramFields
      ...BackstockSlotFields
    },
  }
`);

type SearchResultType = SearchResult<
  | ResultOf<typeof ITEM_BY_SKU>['itemBySku']
  | ResultOf<typeof ITEM_BY_UPC>['itemByUpc']
>;

export interface useBatchCountSearchProps {
  onError?: (error: unknown) => void;
  onComplete?: (searchResult: SearchResultType) => void;
}

export function useBatchCountSearchAndScanListener({
  onError,
  onComplete,
}: useBatchCountSearchProps = {}) {
  const { addItem } = useBatchCountState();
  const { search, loading, error } = useItemSearch({
    onError,
    onComplete: (searchResult: SearchResultType) => {
      onComplete?.(searchResult);
      if (searchResult.itemDetails) {
        addItem(searchResult.itemDetails, searchResult.searchType === 'upc');
      }
    },
    skuQuery: ITEM_BY_SKU,
    upcQuery: ITEM_BY_UPC,
  });

  useScanCodeListener(code => {
    switch (code.type) {
      case 'front-tag':
      case 'sku':
        return search({ sku: code.sku });
      case 'UPC':
        return search({ upc: code.upc });
      default:
        toastService.showInfoToast('Scanned barcode is not supported');
    }
  });

  return { searchAndAddItem: search, loading, error };
}
