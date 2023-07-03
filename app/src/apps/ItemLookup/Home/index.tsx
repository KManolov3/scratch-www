import { FixedLayout } from '@layouts/FixedLayout';
import { ItemLookupHome as Home } from '../components/Home';
import { useItemLookupScanCodeListener } from '../hooks/useItemLookupScanCodeListener';

export function ItemLookupHome() {
  const { error, loading, search } = useItemLookupScanCodeListener();

  return (
    <FixedLayout>
      <Home onSubmit={sku => search({ sku })} error={error} loading={loading} />
    </FixedLayout>
  );
}
