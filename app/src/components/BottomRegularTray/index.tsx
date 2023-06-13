import { ReactNode } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { Modal } from '@components/Modal';
import { TrayIndicator } from '@assets/icons';
import { Colors } from '@lib/colors';

interface BottomRegularTrayProps {
  hideTray(): void;
  children: ReactNode;
  isVisible: boolean;
}

export function BottomRegularTray({
  hideTray,
  children,
  isVisible,
}: BottomRegularTrayProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={hideTray}
      onBackButtonPress={hideTray}
      style={styles.absolutePosition}>
      <StatusBar backgroundColor={Colors.backdropBlack} />
      <View style={styles.tray}>
        <TrayIndicator width={48} height={4} />
      </View>
      {children}
    </Modal>
  );
}

const styles = StyleSheet.create({
  absolutePosition: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -20,

    margin: 0,
  },
  tray: {
    alignItems: 'center',
  },
});
