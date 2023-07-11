import { noop } from 'lodash-es';
import { StyleSheet, View } from 'react-native';
import { AttentionIcon } from '@assets/icons';
import { BlockButton } from '@components/Button/Block';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export interface ErrorModalProps {
  isVisible: boolean;
  title: string;
  description?: string;
  withRetry?: boolean;
  onRetry?: () => void;
  onCancel?: () => void;
}

// TODO: Show a loading indicator while retrying a request
export function ErrorModal({
  isVisible,
  title,
  description,
  withRetry = false,
  onRetry = noop,
  onCancel = noop,
}: ErrorModalProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      style={styles.modal}>
      <View style={styles.container}>
        <AttentionIcon height={40} width={40} style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {withRetry ? (
          <BlockButton
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={onRetry}
            variant="primary">
            Try Again
          </BlockButton>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    paddingTop: 29,
    paddingHorizontal: 8,
    paddingBottom: 22,
  },
  container: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: FontWeight.Bold,
    color: Colors.darkerGray,
    marginBottom: 18,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: Colors.darkerGray,
  },
  button: {
    flex: 1,
    borderRadius: 4,
    marginHorizontal: 80,
    backgroundColor: Colors.advanceYellow,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: FontWeight.Bold,
    textAlign: 'center',
    color: Colors.darkerGray,
  },
});
