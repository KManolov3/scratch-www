import { compact } from 'lodash-es';
import { ReactElement, useCallback, useMemo } from 'react';
import {
  Pressable,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import type Svg from 'react-native-svg';
import { InStoreAppsNative } from 'rtn-in-store-apps';
import { config } from 'src/config';
import { ItemLookupNavigation } from '@apps/ItemLookup/navigator';
import { useGlobalState } from '@apps/state';
import { RightArrowIcon, EmptyRadioButton } from '@assets/icons';
import { Text } from '@components/Text';
import { FixedLayout } from '@layouts/FixedLayout';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { useNavigation } from '@react-navigation/native';
import { useFlags } from '@services/LaunchDarkly';
import { DrawerNavigation } from './navigator';

interface DrawerSectionData {
  label: string;
  Icon?: typeof Svg;
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
          .map(({ label, activity }) => ({
            label,
            Icon: EmptyRadioButton,
            onPress: () => {
              goBack();
              InStoreAppsNative.navigateTo(activity);
            },
          })),
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
      item: { label, Icon, onPress, backgroundColor },
      index,
    }: SectionListRenderItemInfo<DrawerSectionData>) => (
      <Pressable
        key={index}
        onPress={onPress}
        style={[{ backgroundColor }, styles.drawerSections]}>
        <View style={styles.drawerSectionsItem}>
          <View style={styles.drawerSectionLabel}>
            {Icon ? <Icon height={20} width={20} style={styles.icon} /> : null}
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
  icon: {
    marginRight: 10,
  },
  drawerSectionsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.pure,
    borderRadius: 9,
    marginBottom: 12,
    paddingVertical: 14,
    paddingLeft: 23,
    paddingRight: 18,
    justifyContent: 'space-between',
  },
  drawerSectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
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
