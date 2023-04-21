import { Text } from '@components/Text';
import { FixedLayout } from '@layouts/FixedLayout';
import { View } from 'react-native';
import { useCycleCountState } from '../state';
import { useMemo } from 'react';
import { uniqBy } from 'lodash-es';
import { filterNotNull } from '@lib/array';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CycleCountRouteProps } from '@apps/CycleCount/navigator';

export function CycleCountPlanogram({
  route: {
    params: { cycleCountId, planogramId },
  },
}: NativeStackScreenProps<CycleCountRouteProps, 'Planogram'>) {
  const { cycleCounts } = useCycleCountState();

  const cycleCount = useMemo(() => {
    if (!cycleCounts) {
      return;
    }

    const cycleCount = cycleCounts.find(_ => _?.cycleCountId === cycleCountId);

    return cycleCount;
  }, [cycleCounts]);

  const planogram = useMemo(() => {
    const planograms = uniqBy(
      cycleCount?.items?.flatMap(item => item?.planograms),
      _ => _?.planogramId,
    );

    return planograms.find(planogram => planogram?.planogramId === planogramId);
  }, [cycleCount]);

  const planogramItems = useMemo(() => {
    return filterNotNull(
      cycleCount?.items?.filter(item => {
        const itemIsPartOfPlanogram = item?.planograms?.some(
          _ => _?.planogramId === planogramId,
        );

        return itemIsPartOfPlanogram;
      }) ?? [],
    );
  }, [cycleCount]);

  if (!planogram) {
    return null;
  }

  return (
    <FixedLayout>
      <View>
        {planogramItems.map(item => (
          <Text key={item.sku!}>{item.sku}</Text>
        ))}
      </View>
    </FixedLayout>
  );
}
