import { useScanCodeListener } from '@services/ScanCode';
import { toastService } from '@services/ToastService';
import { useItemLookup, UseItemLookupProps } from './useItemLookup';

export function useItemLookupScanCodeListener({
  onError,
  onComplete,
}: UseItemLookupProps = {}) {
  const { search, loading, error } = useItemLookup({
    onError,
    onComplete,
  });

  useScanCodeListener(code => {
    switch (code.type) {
      case 'front-tag':
        return search({ sku: code.sku, frontTagPrice: code.frontTagPrice });
      case 'sku':
        return search({ sku: code.sku });

      case 'UPC':
        return search({ upc: code.upc });

      default:
        toastService.showInfoToast('Scanned barcode is not supported.');
    }
  });

  return { search, loading, error };
}
