import { Text } from '@components/Text';
import { FixedLayout } from '@layouts/FixedLayout';
import { View } from 'react-native';
import { useMemo } from 'react';
import { uniqBy } from 'lodash-es';
import { filterNotNull } from '@lib/array';
import { CycleCountScreenProps } from '@apps/CycleCount/navigator';
import { useCycleCountState } from '../../state';

export function CycleCountPlanogram({
  route: {
    params: { cycleCountId, planogramId },
  },
}: CycleCountScreenProps<'Planogram'>) {
  const { cycleCounts } = useCycleCountState();

  const cycleCount = useMemo(() => {
    if (!cycleCounts) {
      return;
    }

    return cycleCounts.find(_ => _?.cycleCountId === cycleCountId);
  }, [cycleCounts, cycleCountId]);

  const planogram = useMemo(() => {
    const planograms = uniqBy(
      cycleCount?.items?.flatMap(item => item?.planograms),
      _ => _?.planogramId,
    );

    return planograms.find(_ => _?.planogramId === planogramId);
  }, [cycleCount, planogramId]);

  const planogramItems = useMemo(() => {
    return filterNotNull(
      cycleCount?.items?.filter(item => {
        const itemIsPartOfPlanogram = item?.planograms?.some(
          _ => _?.planogramId === planogramId,
        );

        return itemIsPartOfPlanogram;
      }) ?? [],
    );
  }, [cycleCount, planogramId]);

  if (!planogram) {
    return null;
  }

  return (
    <FixedLayout>
      <View>
        {planogramItems.map(item => (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          <Text key={item.sku!}>{item.sku}</Text>
        ))}
      </View>
    </FixedLayout>
  );
}
