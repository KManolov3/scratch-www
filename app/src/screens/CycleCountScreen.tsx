import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { gql } from '../__generated__';
import { useQuery } from '@apollo/client';

const QUERY = gql(`
  query cycleCountApp {
    cycleCounts(storeNumber: "0363") {
      storeNumber
      cycleCountName
      cycleCountId
      cycleCountType
      skus
      items {
        sku
        mfrPartNum
        partDesc
        retailPrice
      }
    }
  }
`);

export function CycleCountScreen() {
  const { loading, data, error } = useQuery(QUERY);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!data?.cycleCounts || error) {
    return (
      <View>
        <Text>{error?.message ?? 'Unknown error'}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Cycle Count Application</Text>

      <FlatList
        data={data.cycleCounts}
        renderItem={({ item }) => <Text>{item?.cycleCountName}</Text>}
        keyExtractor={_ => _?.cycleCountId?.toString()!}
      />
    </View>
  );
}
