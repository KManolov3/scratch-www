import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { RootNavigation } from '@apps/navigator';
import { GlobalStateItemDetails, useGlobalState } from '@apps/state';
import { HamburgerMenu } from '@assets/icons';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useNavigation } from '@react-navigation/native';

type HeaderProps = {
  title?: string;
  leftIcon?: ReactNode;
  onClickLeft?: () => void;
  item?: GlobalStateItemDetails;
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
  item,
}: HeaderProps) {
  const { navigate } = useNavigation<RootNavigation>();
  const { applicationName, setSelectedItem } = useGlobalState();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Pressable
          onPress={
            onClickLeft ??
            (() => {
              setSelectedItem(item);
              navigate('Drawer', { screen: 'DrawerHome' });
            })
          }>
          {leftIcon}
        </Pressable>
        <Text style={styles.text}>{title ?? applicationName}</Text>
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
