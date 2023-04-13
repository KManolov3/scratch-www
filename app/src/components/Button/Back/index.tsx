import { BackArrowIcon } from '@assets/icons';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles, iconHeight, iconWidth } from './styles';

interface Props {
  disabled?: boolean;
}

export function BackButton({ disabled = false }: Props) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={styles.backButton}
      disabled={disabled}>
      <BackArrowIcon height={iconHeight} width={iconWidth} />
    </Pressable>
  );
}
