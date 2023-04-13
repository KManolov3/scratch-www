import { Pressable } from 'react-native';
import { CycleCount } from '../../../__generated__/graphql';
import styles from './styles';
import Text from '../../Common/Text';

export interface Props {
  item: CycleCount;
}

function CycleCountCard({ item }: Props) {
  // TODO: determine whether a cycle count is
  // critical based on its due date
  const critical = true;

  return (
    <Pressable style={[styles.card, critical && styles.critical]}>
      <Text>
        {item.cycleCountId} - {item.cycleCountName}
      </Text>
    </Pressable>
  );
}

export default CycleCountCard;
