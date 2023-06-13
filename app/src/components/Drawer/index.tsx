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
import { ItemDetails } from 'src/types/ItemLookup';
import { compact } from 'lodash-es';
import { SvgType } from '*.svg';
import { DrawerNavigation, DrawerScreenProps } from './navigator';

interface DrawerSectionData {
  label: string;
  Icon?: SvgType;
  onPress?: () => void;
}

interface DrawerSection {
  title: string;
  backgroundColor?: string;
  data: DrawerSectionData[];
}

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
  const { replace, getParent } = useNavigation<DrawerNavigation>();

  useEffect(() => getParent()?.setOptions({ title }), [getParent, title]);

  const renderSectionHeader = useCallback<
    (sections: DrawerSectionHeader) => ReactElement
  >(
    ({ section: { title: sectionTitle } }) => (
      <Text key={sectionTitle} style={styles.drawerHeader}>
        {sectionTitle}
      </Text>
    ),
    [],
  );

  const sections = useMemo(
    () => [
      {
        title: 'Item In Slots',
        data: compact([
          item ? { label: 'Print Front Tags' } : undefined,
          // TODO: hardcoded for now
          { label: 'Backstock Moves' },
          { label: 'Manage Backstock slot' },
        ]),
      },
      {
        // TODO: These should be based on access level
        title: 'Functions',
        data: [
          {
            label: 'Item Lookup',
            Icon: EmptyRadioButton,
            onPress: () =>
              InStoreAppsNative.navigateTo(Activity.ItemLookupActivity),
          },
          { label: 'ATI Tote Assignment', Icon: EmptyRadioButton },
          {
            label: 'Batch Count',
            Icon: EmptyRadioButton,
            onPress: () =>
              InStoreAppsNative.navigateTo(Activity.BatchCountActivity),
          },
          { label: 'New Return Request', Icon: EmptyRadioButton },
          {
            label: 'Cycle Count',
            Icon: EmptyRadioButton,
            onPress: () =>
              InStoreAppsNative.navigateTo(Activity.CycleCountActivity),
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
            onPress: () =>
              InStoreAppsNative.navigateTo(Activity.OutageActivity),
          },
        ],
      },
      {
        title: 'Settings',
        backgroundColor: Colors.darkerGray,
        data: [
          {
            label: 'Printers',
            onPress: () => replace('SelectPrinter', { title }),
          },
          {
            label: 'Help Request',
            onPress: () => replace('HelpRequest', { title }),
          },
        ],
      },
    ],
    [item, replace, title],
  );

  const renderSectionItem = useCallback(
    ({
      item: { label, Icon, onPress },
      index,
    }: SectionListRenderItemInfo<DrawerSectionData>) => (
      <Pressable key={index} onPress={onPress}>
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
    <FixedLayout style={{ backgroundColor: Colors.lighterVoid }}>
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderSectionItem}
        style={styles.drawerSections}
      />
    </FixedLayout>
  );
}

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.advanceBlack,
    paddingHorizontal: 14,
  },
  crossIcon: {
    marginRight: 26,
  },
  hamburgerIcon: {
    marginRight: 36,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: FontWeight.Demi,
    color: Colors.pure,
    marginLeft: 36,
  },
  drawerSections: {
    paddingHorizontal: 19,
    paddingBottom: 32,
  },
  drawerHeader: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: FontWeight.Bold,
    color: Colors.black,
    marginTop: 32,
  },
  icon: {
    marginRight: 10,
  },
  drawerSectionsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.pure,
    borderRadius: 9,
    marginTop: 12,
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
});
