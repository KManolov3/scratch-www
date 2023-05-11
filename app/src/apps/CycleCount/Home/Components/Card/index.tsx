import { Pressable, View } from 'react-native';
import { useMemo } from 'react';
import { DateTime } from 'luxon';
import { Text } from '@components/Text';
import { pluralize, pluralizeLabel } from '@lib/pluralize';
import { DocumentType, gql } from 'src/__generated__';
import { useDateTime } from '@hooks/useDateTime';
import { styles } from './styles';

export const CycleCountCardFragment = gql(`
  fragment CycleCountCardFragment on CycleCount {
    cycleCountId
    cycleCountName
    dueDate
  }
`);

export interface CycleCountCardProps {
  cycleCount: DocumentType<typeof CycleCountCardFragment>;
  onPress: () => void;
}

export function CycleCountCard({ cycleCount, onPress }: CycleCountCardProps) {
  // TODO: Need to check if this is always present
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const dueDate = useDateTime(cycleCount.dueDate!);

  const daysLeft = useMemo(() => {
    const today = DateTime.now().startOf('day');

    return dueDate.diff(today, 'days').days;
  }, [dueDate]);

  // See https://advanceautoparts.atlassian.net/browse/RIP-295 for the constant
  const critical = daysLeft <= 3;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, critical && styles.critical]}>
      {critical && <CriticalLabel daysLeft={daysLeft} />}

      <View style={styles.content}>
        <Text style={styles.title}>
          {cycleCount.cycleCountId} - {cycleCount.cycleCountName}
        </Text>
        <Text>
          <DueDateLabel daysLeft={daysLeft} /> (
          {dueDate.toLocaleString(DateTime.DATE_SHORT)})
        </Text>
      </View>
    </Pressable>
  );
}

function CriticalLabel({ daysLeft }: { daysLeft: number }) {
  if (daysLeft === 0) {
    return (
      <View style={styles.criticalContainer}>
        <Text style={styles.criticalDays}>Today</Text>
      </View>
    );
  }

  if (daysLeft < 0) {
    return (
      <View style={styles.criticalContainer}>
        <Text style={styles.criticalDays}>Overdue</Text>
      </View>
    );
  }

  return (
    <View style={styles.criticalContainer}>
      <Text style={styles.criticalDays}>{daysLeft}</Text>

      <Text style={styles.criticalLabel}>
        {pluralizeLabel(daysLeft, 'day', 'days')}
      </Text>
    </View>
  );
}

function DueDateLabel({ daysLeft }: { daysLeft: number }) {
  if (daysLeft === 0) {
    return <>Due today</>;
  }

  if (daysLeft < 0) {
    return <>Past due date</>;
  }

  return <>Due in {pluralize(daysLeft, 'day', 'days')}</>;
}
