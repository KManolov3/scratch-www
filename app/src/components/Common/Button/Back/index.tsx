import React from 'react';
import styles, { iconHeigh, iconWidth } from './styles';
import { BackArrowIcon } from '@assets/icons';
import { Pressable } from 'react-native';

interface Props {
  disabled?: boolean;
}

const BackButton = ({ disabled = false }: Props) => {
  const navigateBack = () => {};

  return (
    <Pressable
      onPress={navigateBack}
      style={styles.backButton}
      disabled={disabled}>
      <BackArrowIcon height={iconHeigh} width={iconWidth} />
    </Pressable>
  );
};

export default BackButton;
