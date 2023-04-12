import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import { gql } from '../__generated__';

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        keyExtractor={_ => _?.cycleCountId?.toString()!}
      />
    </View>
  );
}
