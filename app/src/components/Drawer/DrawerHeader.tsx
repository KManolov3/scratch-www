import { WhiteCrossIcon } from '@assets/icons';
import { Header } from '@components/Header';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigation } from './navigator';

export function DrawerHeader({ options: { title } }: NativeStackHeaderProps) {
  const { goBack: closeDrawer } = useNavigation<DrawerNavigation>();

  return (
    <Header
      title={title}
      leftIcon={<WhiteCrossIcon height={32} width={32} />}
      onClickLeft={closeDrawer}
    />
  );
}
