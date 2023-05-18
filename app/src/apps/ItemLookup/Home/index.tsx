import { Text } from '@components/Text';
import { useScanListener } from '@hooks/useScanListener';

export function ItemLookupHome() {
  useScanListener(scan => {
    // Keeping this to test for now
    // eslint-disable-next-line no-console
    console.log('useScanListener', scan);
  });

  return <Text>Item Lookup Home</Text>;
}
