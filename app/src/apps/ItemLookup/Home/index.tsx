import { FixedLayout } from '@layouts/FixedLayout';
import { ItemLookupHome as Home } from '../components/Home';
import { useItemLookupScanCodeListener } from '../hooks/useItemLookuSscanCodeListener';

export function ItemLookupHome() {
  const { error, loading, searchBySku } = useItemLookupScanCodeListener();

  return (
    <FixedLayout>
      <Home onSubmit={searchBySku} error={error} loading={loading} />
    </FixedLayout>
  );
}
