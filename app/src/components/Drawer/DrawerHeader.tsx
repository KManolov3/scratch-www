import { useGlobalState } from '@apps/state';
import { WhiteCrossIcon } from '@assets/icons';
import { Header } from '@components/Header';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigation } from './navigator';

export function DrawerHeader() {
  const { goBack: closeDrawer } = useNavigation<DrawerNavigation>();
  const { applicationName } = useGlobalState();

  return (
    <Header
      title={applicationName}
      leftIcon={<WhiteCrossIcon width={46} height={46} />}
      onClickLeft={closeDrawer}
    />
  );
}
