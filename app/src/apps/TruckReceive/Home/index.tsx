import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { FixedLayout } from '@layouts/FixedLayout';
import { Text } from '@components/Text';
import { TextInput } from '@components/TextInput';
import { Colors } from '@lib/colors';
import { DocumentType, gql } from '../../../__generated__';
import { styles } from './styles';

const QUERY = gql(`
  query truckScanApp {
    truckScansByStore(storeNumber: "0363") {
      asnReferenceNumber
      status
      storeNumber
    }
  }
`);

export function TruckReceiveHome() {
  const [search, setSearch] = useState('');

  const { loading, data, error } = useQuery(QUERY);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!data?.truckScansByStore || error) {
    return (
      <View>
        <Text>{error?.message ?? 'Unknown error'}</Text>
      </View>
    );
  }

  return (
    <FixedLayout>
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.lightVoid}
        placeholder="Search by ASN number..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        style={styles.truckScans}
        data={data.truckScansByStore}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        renderItem={({ item }) => <TruckScanListItem truckScan={item!} />}
        ItemSeparatorComponent={Separator}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        keyExtractor={_ => _?.asnReferenceNumber?.toString()!}
      />
    </FixedLayout>
  );
}

function TruckScanListItem({ truckScan }: { truckScan: TruckScanFromQuery }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.truckScanListItem}
      onPress={() =>
        navigation.navigate('TruckScanDetails', {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          asn: truckScan.asnReferenceNumber!,
        })
      }>
      <View>
        <Text style={styles.truckScanTitle}>
          ASN {truckScan?.asnReferenceNumber}
        </Text>
        <Text style={styles.truckScanSubtext}>{truckScan?.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

type TruckScanFromQuery = NonNullable<
  NonNullable<DocumentType<typeof QUERY>['truckScansByStore']>[number]
>;

function Separator() {
  return <View style={styles.separator} />;
}
