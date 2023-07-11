import { compact } from 'lodash-es';
import { ReactElement, ReactNode, useCallback, useMemo } from 'react';
import {
  Pressable,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import { Svg } from 'react-native-svg';
import { InStoreAppsNative } from 'rtn-in-store-apps';
import { config } from 'src/config';
import { ItemLookupNavigation } from '@apps/ItemLookup/navigator';
import { useGlobalState } from '@apps/state';
import { RightArrowIcon, EmptyRadioButton } from '@assets/icons';
import BackstockManagementIcon from '@assets/icons/app-icons/backstock-management-icon.svg';
import BatchCountIcon from '@assets/icons/app-icons/batch-count-icon.svg';
import CycleCountIcon from '@assets/icons/app-icons/cycle-count-icon.svg';
import ItemLookupIcon from '@assets/icons/app-icons/item-lookup-icon.svg';
import OutageIcon from '@assets/icons/app-icons/outage-icon.svg';
import ReceivingIcon from '@assets/icons/app-icons/receiving-icon.svg';
import ReturnRequestIcon from '@assets/icons/app-icons/return-request-icon.svg';
import ToteAssignmentIcon from '@assets/icons/app-icons/tote-assignment-icon.svg';
import { Text } from '@components/Text';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useNavigation } from '@react-navigation/native';
import { useFlags } from '@services/LaunchDarkly';
import { DrawerNavigation } from './navigator';

const APP_ICONS: Record<string, typeof Svg> = {
  'backstock-management': BackstockManagementIcon,
  'batch-count': BatchCountIcon,
  'cycle-count': CycleCountIcon,
  'item-lookup': ItemLookupIcon,
  outage: OutageIcon,
  receiving: ReceivingIcon,
  'return-request': ReturnRequestIcon,
  'tote-assignment': ToteAssignmentIcon,
};

interface DrawerSectionData {
  label: string;
  icon?: ReactNode;
  backgroundColor?: string;
  onPress?: () => void;
}

type DrawerSection = {
  title: string | ReactElement;
  backgroundColor?: string;
  data: DrawerSectionData[];
};

interface DrawerSectionHeader {
  section: SectionListData<DrawerSectionData, DrawerSection>;
}

export function Drawer() {
  const { replace, goBack } = useNavigation<DrawerNavigation>();
  const { navigate } = useNavigation<ItemLookupNavigation>();

  const { selectedItem, activityName: currentActivityName } = useGlobalState();

  const renderSectionHeader = useCallback<
    (sections: DrawerSectionHeader) => ReactElement | null
  >(({ section: { title: sectionTitle, data } }) => {
    if (data.length === 0) {
      return null;
    }

    if (typeof sectionTitle === 'string') {
      return (
        <Text
          key={sectionTitle}
          style={[
            styles.drawerHeader,
            styles.drawerHeaderText,
            styles.drawerSections,
          ]}>
          {sectionTitle}
        </Text>
      );
    }

    return sectionTitle;
  }, []);

  const { configHamburgerMenuAppFunctions } = useFlags();

  const sections = useMemo(
    () => [
      {
        title: 'Item In Slots',
        data: compact([
          selectedItem
            ? {
                label: 'Print Front Tags',
                onPress: () =>
                  navigate('PrintFrontTag', { itemDetails: selectedItem }),
              }
            : undefined,
          // { label: 'Backstock Moves' },
          // { label: 'Manage Backstock slot' },
        ]),
      },
      {
        title: 'Functions',
        data: configHamburgerMenuAppFunctions
          .filter(_ => _.activity !== currentActivityName)
          .map(({ label, activity, icon }) => {
            const Icon = icon && APP_ICONS[icon];

            return {
              label,
              icon: Icon ? (
                <Icon width={36} height={36} />
              ) : (
                <EmptyRadioButton
                  height={20}
                  width={20}
                  style={styles.defaultIcon}
                />
              ),
              onPress: () => {
                goBack();
                InStoreAppsNative.navigateTo(activity);
              },
            };
          }),
      },
      {
        title: (
          <View
            key="Settings"
            style={[
              styles.drawerSections,
              styles.drawerHeader,
              styles.settings,
            ]}>
            <Text style={styles.drawerHeaderText}>Settings</Text>
            <Text style={styles.version}>
              ver. {config.versionName}
              {config.showDebugUI ? `-${config.buildInfo}` : ''}
            </Text>
          </View>
        ),
        key: 'Settings',
        backgroundColor: Colors.drawerGray,
        data: [
          {
            label: 'Printers',
            onPress: () => replace('SelectPrinter'),
            backgroundColor: Colors.drawerGray,
          },
          {
            label: 'Help Request',
            onPress: () => replace('HelpRequest'),
            backgroundColor: Colors.drawerGray,
          },
        ],
      },
    ],
    [
      configHamburgerMenuAppFunctions,
      navigate,
      goBack,
      replace,
      selectedItem,
      currentActivityName,
    ],
  );

  const renderSectionItem = useCallback(
    ({
      item: { label, icon, onPress, backgroundColor },
      index,
    }: SectionListRenderItemInfo<DrawerSectionData>) => (
      <Pressable
        key={index}
        onPress={onPress}
        style={[{ backgroundColor }, styles.drawerSections]}>
        <View style={styles.drawerSectionsItem}>
          {icon}
          <View style={styles.drawerSectionLabel}>
            <Text style={styles.drawerSectionsItemText}>{label}</Text>
          </View>
          <RightArrowIcon height={12} width={7} />
        </View>
      </Pressable>
    ),
    [],
  );

  return (
    <FixedLayout style={styles.container} withoutHeader>
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderSectionItem}
      />
    </FixedLayout>
  );
}

export const styles = StyleSheet.create({
  container: { backgroundColor: Colors.lightGray },
  drawerSections: {
    paddingHorizontal: 19,
  },
  drawerHeader: {
    paddingVertical: 12,
    marginTop: 4,
  },
  drawerHeaderText: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: FontWeight.Bold,
    color: Colors.black,
  },
  defaultIcon: {
    margin: 8,
  },
  drawerSectionsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.pure,
    borderRadius: 9,
    marginBottom: 12,
    padding: 6,
    paddingRight: 18,
    justifyContent: 'space-between',
  },
  drawerSectionLabel: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  drawerSectionsItemText: {
    fontSize: 17,
    lineHeight: 20,
    fontWeight: FontWeight.Demi,
    color: Colors.darkVoid,
  },
  settings: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.drawerGray,
  },
  version: { fontWeight: FontWeight.Book },
});
