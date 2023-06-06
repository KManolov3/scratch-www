import { Header } from '@components/Header';
import { FixedLayout } from '@layouts/FixedLayout';
import { useMemo } from 'react';
import { ItemLookupHome as Home } from '../components/Home';

export function ItemLookupHome() {
  const header = useMemo(() => <Header title="Item Lookup" />, []);

  return (
    <FixedLayout header={header}>
      <Home />
    </FixedLayout>
  );
}
