import { FontWeight } from '@lib/font';
import { CrossIcon, RightArrowIcon, EmptyRadioButton } from '@assets/icons';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { ReactElement, useCallback, useMemo } from 'react';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  View,
  StyleSheet,
} from 'react-native';
import { FixedLayout } from '@layouts/FixedLayout';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@components/Header';
import { RootNavigation } from '@apps/navigator';
import { SvgType } from '*.svg';
import { DrawerScreenProps } from './navigator';

interface DrawerSectionData {
  label: string;
  Icon?: SvgType;
}

interface DrawerSection {
  title: string;
  backgroundColor?: string;
  data: DrawerSectionData[];
}

const sections = [
  {
    title: 'Item In Slots',
    data: [
      { label: 'Print Front Tags' },
      { label: 'Backstock Moves' },
      { label: 'Manage Backstock slot' },
    ],
  },
  {
    title: 'Functions',
    data: [
      { label: 'Item Lookup', Icon: EmptyRadioButton },
      { label: 'ATI Tote Assignment', Icon: EmptyRadioButton },
      { label: 'Batch Count', Icon: EmptyRadioButton },
      { label: 'New Return Request', Icon: EmptyRadioButton },
      { label: 'Cycle Count', Icon: EmptyRadioButton },
    ],
  },
  {
    title: 'Settings',
    backgroundColor: Colors.darkerGray,
    data: [
      {
        label: 'Printers',
      },
      {
        label: 'Help Request',
      },
    ],
  },
];

interface DrawerSectionHeader {
  section: SectionListData<DrawerSectionData, DrawerSection>;
}

export interface DrawerProps {
  title: string;
}

export function Drawer({
  route: {
    params: { title },
  },
}: DrawerScreenProps<'Drawer'>) {
  const { goBack: closeDrawer } = useNavigation<RootNavigation>();

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

  const renderSectionItem = useCallback(
    ({
      item: { label, Icon },
      index,
    }: SectionListRenderItemInfo<DrawerSectionData>) => (
      <View key={index} style={styles.drawerSectionsItem}>
        <View style={styles.drawerSectionLabel}>
          {Icon ? <Icon height={20} width={20} style={styles.icon} /> : null}
          <Text style={styles.drawerSectionsItemText}>{label}</Text>
        </View>
        <RightArrowIcon height={12} width={7} />
      </View>
    ),
    [],
  );

  const header = useMemo(
    () => (
      <Header
        title={title}
        leftIcon={<CrossIcon height={32} width={32} />}
        onClickLeft={closeDrawer}
      />
    ),
    [closeDrawer, title],
  );

  return (
    <FixedLayout
      style={{ backgroundColor: Colors.lighterVoid }}
      header={header}>
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
