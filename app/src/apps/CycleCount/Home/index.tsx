import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  View,
} from 'react-native';
import { useCallback, useMemo } from 'react';
import { FixedLayout } from '@layouts/FixedLayout';
import { Text } from '@components/Text';
import { sortBy } from 'lodash-es';
import { filterNotNull } from '@lib/array';
import { useNavigation } from '@react-navigation/native';
import { useCycleCountState } from '../state';
import { CycleCountNavigation } from '../navigator';
import { CycleCountCard } from './Components/Card';
import { styles } from './styles';

export function CycleCountHome() {
  const { cycleCounts: data, error, loading } = useCycleCountState();

  const cycleCounts = useMemo(() => {
    if (!data) {
      return [];
    }

    // TODO: Check if the actual API sorts them by dueDate or if we need to sort ourselves
    return sortBy(filterNotNull(data), _ => _.dueDate);
  }, [data]);

  const navigation = useNavigation<CycleCountNavigation>();

  const renderItem = useCallback<ListRenderItem<(typeof cycleCounts)[number]>>(
    ({ item }) => (
      <CycleCountCard
        key={item.cycleCountId?.toString()}
        cycleCount={item}
        onPress={() =>
          navigation.navigate('PlanogramList', {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            cycleCountId: item.cycleCountId!,
          })
        }
      />
    ),
    [navigation],
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!cycleCounts || error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorMessage = (error as any)?.message ?? 'Unknown error';

    return (
      <View>
        <Text>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <FixedLayout>
      <FlatList
        data={cycleCounts}
        renderItem={renderItem}
        style={styles.cycleCounts}
      />
    </FixedLayout>
  );
}
