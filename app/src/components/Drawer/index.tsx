import { FontWeight } from '@lib/font';
import { RightArrowIcon, EmptyRadioButton } from '@assets/icons';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { ReactElement, useCallback, useEffect, useMemo } from 'react';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { FixedLayout } from '@layouts/FixedLayout';
import { useNavigation } from '@react-navigation/native';
import { Activity, InStoreAppsNative } from 'rtn-in-store-apps';
import { ItemLookupNavigation } from '@apps/ItemLookup/navigator';
import { ItemDetails } from 'src/types/ItemLookup';
import { compact } from 'lodash-es';
import { config } from 'src/config';
import { SvgType } from '*.svg';
import { DrawerNavigation, DrawerScreenProps } from './navigator';

interface DrawerSectionData {
  label: string;
  Icon?: SvgType;
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

export interface DrawerProps {
  title?: string;
  item?: ItemDetails;
}

export function Drawer({
  route: {
    params: { title, item },
  },
}: DrawerScreenProps<'DrawerHome'>) {
  const { replace, getParent, goBack } = useNavigation<DrawerNavigation>();
  const { navigate } = useNavigation<ItemLookupNavigation>();

  useEffect(() => getParent()?.setOptions({ title }), [getParent, title]);

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

  const navigateTo = useCallback(
    (activityName: Activity) => {
      goBack();
      InStoreAppsNative.navigateTo(activityName);
    },
    [goBack],
  );

  const sections = useMemo(
    () => [
      {
        title: 'Item In Slots',
        data: compact([
          item
            ? {
                label: 'Print Front Tags',
                onPress: () => navigate('PrintFrontTag', { itemDetails: item }),
              }
            : undefined,
          // { label: 'Backstock Moves' },
          // { label: 'Manage Backstock slot' },
        ]),
      },
      {
        // TODO: These should be based on access level
        title: 'Functions',
        data: [
          {
            label: 'Item Lookup',
            Icon: EmptyRadioButton,
            onPress: () => navigateTo(Activity.ItemLookupActivity),
          },
          { label: 'ATI Tote Assignment', Icon: EmptyRadioButton },
          {
            label: 'Batch Count',
            Icon: EmptyRadioButton,
            onPress: () => navigateTo(Activity.BatchCountActivity),
          },
          { label: 'New Return Request', Icon: EmptyRadioButton },
          {
            label: 'Cycle Count',
            Icon: EmptyRadioButton,
            onPress: () => navigateTo(Activity.CycleCountActivity),
          },
          {
            label: 'Receiving',
            Icon: EmptyRadioButton,
          },
          {
            label: 'Backstock Managment',
            Icon: EmptyRadioButton,
          },
          {
            label: 'Outage',
            Icon: EmptyRadioButton,
            onPress: () => navigateTo(Activity.OutageActivity),
          },
        ].filter(({ label }) => label !== title),
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
              ver. {config.version}
              {config.build ? `-${config.build}` : ''}
            </Text>
          </View>
        ),
        key: 'Settings',
        backgroundColor: Colors.drawerGray,
        data: [
          {
            label: 'Printers',
            onPress: () => replace('SelectPrinter', { title }),
            backgroundColor: Colors.drawerGray,
          },
          {
            label: 'Help Request',
            onPress: () => replace('HelpRequest', { title }),
            backgroundColor: Colors.drawerGray,
          },
        ],
      },
    ],
    [item, navigate, navigateTo, replace, title],
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
    <FixedLayout style={styles.container}>
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
