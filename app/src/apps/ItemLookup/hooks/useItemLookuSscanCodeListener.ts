import { ApolloError } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { useScanCodeListener } from '@services/ScanCode';
import { toastService } from '@services/ToastService';
import { ItemLookupNavigation } from '../navigator';
import { useItemLookup } from './useItemLookup';

interface useItemLookupScanCodeListenerProps {
  onError?: (error: ApolloError) => void;
  onComplete?: () => void;
}

export function useItemLookupScanCodeListener({
  onError,
  onComplete,
}: useItemLookupScanCodeListenerProps = {}) {
  const { navigate } = useNavigation<ItemLookupNavigation>();
  const { storeNumber } = useCurrentSessionInfo();

  const { searchBySku, searchByUpc, loading, error } = useItemLookup({
    onError,
    onComplete,
  });

  useScanCodeListener(code => {
    switch (code.type) {
      case 'front-tag':
        return searchBySku({
          variables: { sku: code.sku, storeNumber },
          onCompleted: itemDetails => {
            if (itemDetails.itemBySku) {
              onComplete?.();
              navigate('ItemLookup', {
                itemDetails: itemDetails.itemBySku,
                frontTagPrice: code.frontTagPrice,
              });
            }
          },
        });
      case 'sku':
        return searchBySku({
          variables: { sku: code.sku, storeNumber },
        });
      case 'UPC':
        return searchByUpc({
          variables: { upc: code.upc, storeNumber },
        });
      default:
        toastService.showInfoToast('Scanned barcode is not supported.');
    }
  });

  return { searchBySku, loading, error };
}
