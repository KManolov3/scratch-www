import { FixedLayout } from '@layouts/FixedLayout';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from '@components/SearchBar';
import { Barcode } from '@components/Barcode';
import { OutageNavigation } from '../navigator';

export function OutageHome() {
  const { navigate } = useNavigation<OutageNavigation>();

  const onSubmit = useCallback(
    (value: string) =>
      navigate('OutageBatch', {
        itemSku: value,
      }),
    [navigate],
  );

  return (
    <FixedLayout>
      <SearchBar onSubmit={onSubmit} />
      <Barcode label="Scan a front tag" />
    </FixedLayout>
  );
}
