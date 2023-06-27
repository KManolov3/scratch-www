import { FixedLayout } from '@layouts/FixedLayout';
import { useCurrentSessionInfo } from '@services/Auth';
import { ItemLookupHome as Home } from '../components/Home';
import { useItemLookupScanCodeListener } from '../hooks/useItemLookuSscanCodeListener';

export function ItemLookupHome() {
  const { error, loading, searchBySku } = useItemLookupScanCodeListener();
  const { storeNumber } = useCurrentSessionInfo();

  return (
    <FixedLayout>
      <Home
        onSubmit={sku =>
          searchBySku({
            variables: { sku, storeNumber },
          })
        }
        error={error}
        loading={loading}
      />
    </FixedLayout>
  );
}
