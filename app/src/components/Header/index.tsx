import { Text } from '@components/Text';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { ReactNode } from 'react';
import { HamburgerMenu } from '@assets/icons';
import { useNavigation } from '@react-navigation/native';
import { RootNavigation } from '@apps/navigator';

type HeaderProps = {
  title: string;
  leftIcon?: ReactNode;
  onClickLeft?: () => void;
} & (
  | {
      rightIcon: ReactNode;
      onClickRight: () => void;
    }
  | {
      rightIcon?: undefined;
      onClickRight?: undefined;
    }
);

export function Header({
  title,
  rightIcon,
  leftIcon = <HamburgerMenu />,
  onClickLeft,
  onClickRight,
}: HeaderProps) {
  const navigation = useNavigation<RootNavigation>();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Pressable
          onPress={
            onClickLeft ?? (() => navigation.navigate('Drawer', { title }))
          }>
          {leftIcon}
        </Pressable>
        <Text style={styles.text}>{title}</Text>
      </View>
      <View style={styles.right}>
        <Pressable onPress={onClickRight}>{rightIcon}</Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.advanceBlack,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 25,
  },
  text: {
    color: Colors.pure,
    fontWeight: FontWeight.Demi,
    padding: 16,
    fontSize: 20,
  },
  right: { marginRight: 25 },
});
