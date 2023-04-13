import { Pressable } from 'react-native';
import { Text } from '@components/Text';
import { CycleCount } from 'src/__generated__/graphql';
import { styles } from './styles';

export interface Props {
  cycleCount: CycleCount;
}

export function CycleCountCard({ cycleCount }: Props) {
  // TODO: determine whether a cycle count is
  // critical based on its due date
  const critical = true;

  return (
    <Pressable style={[styles.card, critical && styles.critical]}>
      <Text>
        {cycleCount.cycleCountId} - {cycleCount.cycleCountName}
      </Text>
      <Text>{cycleCount?.skus?.join(', ')}</Text>
    </Pressable>
  );
}
