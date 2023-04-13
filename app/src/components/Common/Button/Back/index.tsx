import { BackArrowIcon } from '@assets/icons';
import { Pressable } from 'react-native';
import styles, { iconHeigh, iconWidth } from './styles';

interface Props {
  disabled?: boolean;
}

function BackButton({ disabled = false }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const navigateBack = () => {};

  return (
    <Pressable
      onPress={navigateBack}
      style={styles.backButton}
      disabled={disabled}>
      <BackArrowIcon height={iconHeigh} width={iconWidth} />
    </Pressable>
  );
}

export default BackButton;
