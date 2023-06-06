import { RootNavigation, RootScreenProps } from '@apps/navigator';
import { CrossIcon } from '@assets/icons';
import { BlockButton } from '@components/Button/Block';
import { Header } from '@components/Header';
import { LightHeader } from '@components/LightHeader';
import { TextInput } from '@components/TextInput';
import { FixedLayout } from '@layouts/FixedLayout';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { useNavigation } from '@react-navigation/native';
import { noop } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

export interface HelpRequestProps {
  title: string;
}

export function HelpRequest({
  route: {
    params: { title },
  },
}: RootScreenProps<'HelpRequest'>) {
  const { goBack: closeDrawer, replace } = useNavigation<RootNavigation>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

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

  const onBackPress = useCallback(
    () => replace('Drawer', { title }),
    [replace, title],
  );

  return (
    <FixedLayout
      style={{ backgroundColor: Colors.lighterVoid }}
      header={header}>
      <LightHeader onPress={onBackPress} label="Help Request" />
      {/* TODO: the designs here are not clear so leaving it like this for now */}
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={Colors.advanceBlack}
        keyboardType="default"
        style={styles.input}
      />
      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Descrisption"
        value={description}
        keyboardType="default"
        onChangeText={setDescription}
        placeholderTextColor={Colors.advanceBlack}
      />
      <BlockButton label="Submit" onPress={noop} />
    </FixedLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    margin: 10,
    color: Colors.advanceVoid,
    backgroundColor: Colors.pure,
    borderRadius: 8,
    height: 48,
    lineHeight: 14,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    ...BaseStyles.shadow,
  },
  description: { height: 146 },
});
