import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { DocumentType, gql } from '../../../__generated__';
import { FixedLayout } from '../../../layouts/FixedLayout';
import { styles } from './styles';

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        renderItem={({ item }) => <CycleCountListItem cycleCount={item!} />}
        ItemSeparatorComponent={Separator}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
