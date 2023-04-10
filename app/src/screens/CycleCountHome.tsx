import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { DocumentType, gql } from '../__generated__';
import { useQuery } from '@apollo/client';
import { FixedLayout } from '../layouts/FixedLayout';
import { Colors } from '../lib/colors';
import { useNavigation } from '@react-navigation/native';

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

export function CycleCountHome() {
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
    <FixedLayout>
      <FlatList
        style={styles.cycleCounts}
        data={data.cycleCounts}
        renderItem={({ item }) => <CycleCountListItem cycleCount={item!} />}
        ItemSeparatorComponent={Separator}
        keyExtractor={_ => _?.cycleCountId?.toString()!}
      />
    </FixedLayout>
  );
}

type CycleCountFromQuery = NonNullable<
  NonNullable<DocumentType<typeof QUERY>['cycleCounts']>[number]
>;

function CycleCountListItem({
  cycleCount,
}: {
  cycleCount: CycleCountFromQuery;
}) {
  return (
    <TouchableHighlight style={styles.cycleCount}>
      <Text style={styles.cycleCountTitle}>{cycleCount?.cycleCountName}</Text>
      <Text style={styles.cycleCountSubtext}>
        {cycleCount?.skus?.join(', ')}
      </Text>
    </TouchableHighlight>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  cycleCounts: {},

  cycleCount: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  cycleCountTitle: {
    fontSize: 16,
  },

  cycleCountSubtext: {
    marginTop: 2,
    color: Colors.darkGray,
  },

  separator: {
    backgroundColor: Colors.grayer,
    height: 1,
    marginHorizontal: 10,
  },
});
