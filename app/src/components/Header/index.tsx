import { View } from 'react-native';
import { Text } from '@components/Text';
import { BackButton } from '../Button/Back';
import { styles } from './styles';

function Spacer() {
  return (
    <View style={styles.spacerContainer}>
      <View style={styles.spacer} />
    </View>
  );
}

interface Props {
  title?: string;
  withBackButton?: boolean;
}

export function Header({ title = '', withBackButton = false }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {withBackButton ? <BackButton /> : <Spacer />}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.side}>
        <Spacer />
      </View>
    </View>
  );
}
