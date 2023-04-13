import { BackArrowIcon } from '@assets/icons';
import { Pressable } from 'react-native';
import { styles, iconHeight, iconWidth } from './styles';

interface Props {
  disabled?: boolean;
}

export function BackButton({ disabled = false }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const navigateBack = () => {};

  return (
    <Pressable
      onPress={navigateBack}
      style={styles.backButton}
      disabled={disabled}>
      <BackArrowIcon height={iconHeight} width={iconWidth} />
    </Pressable>
  );
}
