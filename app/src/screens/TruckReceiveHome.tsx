import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FixedLayout } from '../layouts/FixedLayout';
import { useState } from 'react';
import { DocumentType, gql } from '../__generated__';
import { Colors } from '../lib/colors';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

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
        renderItem={({ item }) => <TruckScanListItem truckScan={item!} />}
        ItemSeparatorComponent={Separator}
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

const styles = StyleSheet.create({
  input: {
    margin: 10,
    color: Colors.advanceVoid,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    height: 48,
    lineHeight: 14,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },

  truckScans: {},

  truckScanListItem: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  truckScanTitle: {
    fontSize: 16,
  },

  truckScanSubtext: {
    marginTop: 2,
    color: Colors.darkGray,
  },

  separator: {
    backgroundColor: Colors.grayer,
    height: 1,
    marginHorizontal: 10,
  },
});
