import { Header } from '@components/Header';
import { FixedLayout } from '@layouts/FixedLayout';
import { ItemLookupHome as Home } from '../components/Home';

export function ItemLookupHome() {
  return (
    <FixedLayout header={<Header title="Item Lookup" />}>
      <Home />
    </FixedLayout>
  );
}
