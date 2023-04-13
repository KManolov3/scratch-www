import { ActivityIndicator, View } from 'react-native';
import { useQuery } from '@apollo/client';
import { FixedLayout } from '@layouts/FixedLayout';
import { ScreenProps } from '@config/routes';
import { Text } from '@components/Text';
import { gql } from '../../../__generated__';
import { styles } from './styles';

export interface TruckScanDetailsProps {
  asn: string;
}

const QUERY = gql(`
  query truckScanDetails($asn: String!) {
    truckScanByASN(asnReferenceNumber: $asn) {
      asnReferenceNumber
      status
      storeNumber
      items { sku upc mfrPartNum partDesc expectedCount actualCount }
    }
  }
`);

export function TruckReceiveScanDetails({
  route,
}: ScreenProps<'TruckScanDetails'>) {
  const { loading, data, error } = useQuery(QUERY, {
    variables: { asn: route.params.asn },
  });

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!data?.truckScanByASN || error) {
    return (
      <View>
        <Text>{error?.message ?? 'Unknown error'}</Text>
      </View>
    );
  }

  return (
    <FixedLayout>
      <View style={styles.summary}>
        <Text>ASN: {data.truckScanByASN.asnReferenceNumber}</Text>
        <Text>Status: {data.truckScanByASN.status}</Text>
        <Text>Store Number: {data.truckScanByASN.storeNumber}</Text>
      </View>

      <Text>Truck Scan Details</Text>
    </FixedLayout>
  );
}
