import { BlockButton } from '@components/Button/Block';
import {
  DrawerNavigation,
  DrawerScreenProps,
} from '@components/Drawer/navigator';
import { LightHeader } from '@components/LightHeader';
import { TextInput } from '@components/TextInput';
import { FixedLayout } from '@layouts/FixedLayout';
import { BaseStyles } from '@lib/baseStyles';
import { Colors } from '@lib/colors';
import { useNavigation } from '@react-navigation/native';
import { noop } from 'lodash-es';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

export interface HelpRequestProps {
  title?: string;
}

export function HelpRequest({
  route: {
    params: { title },
  },
}: DrawerScreenProps<'HelpRequest'>) {
  const { replace } = useNavigation<DrawerNavigation>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const onBackPress = useCallback(
    () => replace('DrawerHome', { title }),
    [replace, title],
  );

  return (
    <FixedLayout style={styles.container}>
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
  container: { backgroundColor: Colors.lightGray },
});
