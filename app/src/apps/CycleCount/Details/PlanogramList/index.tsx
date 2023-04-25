import { FixedLayout } from '@layouts/FixedLayout';
import { FlatList, ListRenderItem, Pressable, View } from 'react-native';
import { useCycleCountState } from '../state';
import { useCallback, useMemo } from 'react';
import { filterNotNull } from '@lib/array';
import { uniqBy } from 'lodash-es';
import { Text } from '@components/Text';
import { useNavigation } from '@react-navigation/native';
import {
  CycleCountNavigation,
  CycleCountScreenProps,
} from '@apps/CycleCount/navigator';

// TODO: Helper type for the prop types
export function CycleCountPlanogramList({
  route: {
    params: { cycleCountId },
  },
}: CycleCountScreenProps<'PlanogramList'>) {
  // TODO: Single item state? Another hook?
  const { cycleCounts } = useCycleCountState();

  const planograms = useMemo(() => {
    if (!cycleCounts) {
      return [];
    }

    const cycleCount = cycleCounts.find(_ => _?.cycleCountId === cycleCountId);
    if (!cycleCount) {
      return [];
    }

    const planograms =
      filterNotNull(cycleCount.items!.flatMap(_ => _?.planograms)) ?? [];

    return uniqBy(planograms, _ => _.planogramId);
  }, [cycleCounts, cycleCountId]);

  const navigation = useNavigation<CycleCountNavigation>();

  const renderItem = useCallback<ListRenderItem<(typeof planograms)[number]>>(
    ({ item: planogram }) => (
      <Pressable
        onPress={() =>
          navigation.navigate('Planogram', {
            planogramId: planogram.planogramId!,
            cycleCountId,
          })
        }>
        <Text>
          {planogram.planogramId} - {planogram.description}
        </Text>
      </Pressable>
    ),
    [],
  );

  return (
    <FixedLayout>
      <FlatList
        data={planograms}
        renderItem={renderItem}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        keyExtractor={({ planogramId }) => planogramId!}
      />
    </FixedLayout>
  );
}
