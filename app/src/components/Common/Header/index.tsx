import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import BackButton from '../Button/Back';

const Spacer = () => (
  <View style={styles.spacerContainer}>
    <View style={styles.spacer} />
  </View>
);

interface Props {
  title?: string;
  withBackButton?: boolean;
}

const Header = ({ title = '', withBackButton = false }: Props) => {
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
};

export default Header;
