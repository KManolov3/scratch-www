import { BackArrowIcon } from '@assets/icons';
import { Pressable } from 'react-native';
import { RootNavigation } from '@apps/navigator';
import { useNavigation } from '@react-navigation/native';
import { styles, iconHeight, iconWidth } from './styles';

interface Props {
  disabled?: boolean;
}

export function BackButton({ disabled = false }: Props) {
  const navigation = useNavigation<RootNavigation>();

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={styles.backButton}
      disabled={disabled}>
      <BackArrowIcon height={iconHeight} width={iconWidth} />
    </Pressable>
  );
}
