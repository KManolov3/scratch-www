import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  View,
} from 'react-native';
import { useCallback, useMemo } from 'react';
import { FixedLayout } from '@layouts/FixedLayout';
import { Text } from '@components/Text';
import { CycleCountCard } from './Components/Card';
import { styles } from './styles';
import { sortBy } from 'lodash-es';
import { filterNotNull } from '@lib/array';
import { useNavigation } from '@react-navigation/native';
import { useCycleCountState } from '../Details/state';
import { CycleCountNavigation } from '../navigator';

export function CycleCountHome() {
  const { cycleCounts: data, error, loading } = useCycleCountState();

  const cycleCounts = useMemo(() => {
    if (!data) {
      return [];
    }

    // TODO: Check if the actual API sorts them by dueDate or if we need to sort ourselves
    return sortBy(filterNotNull(data), _ => _?.dueDate);
  }, [data]);

  const navigation = useNavigation<CycleCountNavigation>();

  const renderItem = useCallback<ListRenderItem<(typeof cycleCounts)[number]>>(
    ({ item }) => (
      <CycleCountCard
        cycleCount={item}
        onPress={() =>
          navigation.navigate('PlanogramList', {
            cycleCountId: item.cycleCountId!,
          })
        }
      />
    ),
    [],
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!cycleCounts || error) {
    return (
      <View>
        <Text>{(error as any)?.message ?? 'Unknown error'}</Text>
      </View>
    );
  }

  return (
    <FixedLayout>
      <FlatList
        data={cycleCounts}
        renderItem={renderItem}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        keyExtractor={({ cycleCountId }) => cycleCountId?.toString()!}
        style={styles.cycleCounts}
      />
    </FixedLayout>
  );
}
