import { uniqBy } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, Pressable } from 'react-native';
import {
  CycleCountNavigation,
  CycleCountScreenProps,
} from '@apps/CycleCount/navigator';
import { Text } from '@components/Text';
import { FixedLayout } from '@layouts/FixedLayout';
import { filterNotNull } from '@lib/array';
import { useNavigation } from '@react-navigation/native';
import { useCycleCountState } from '../../state';

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

    const results =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      filterNotNull(cycleCount.items!.flatMap(_ => _?.planograms)) ?? [];

    return uniqBy(results, _ => _.planogramId);
  }, [cycleCounts, cycleCountId]);

  const navigation = useNavigation<CycleCountNavigation>();

  const renderItem = useCallback<ListRenderItem<(typeof planograms)[number]>>(
    ({ item: planogram }) => (
      <Pressable
        key={planogram.planogramId}
        onPress={() =>
          navigation.navigate('Planogram', {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            planogramId: planogram.planogramId!,
            cycleCountId,
          })
        }>
        <Text>
          {planogram.planogramId} - {planogram.description}
        </Text>
      </Pressable>
    ),
    [cycleCountId, navigation],
  );

  return (
    <FixedLayout>
      <FlatList data={planograms} renderItem={renderItem} />
    </FixedLayout>
  );
}
