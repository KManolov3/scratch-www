import { StyleSheet, View } from 'react-native';
import { Modal } from '@components/Modal';
import { Text } from '@components/Text';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';
import { noop } from 'lodash-es';
import { AttentionIcon } from '@assets/icons';
import { BlockButton } from '@components/Button/Block';
import { ErrorType } from '@services/ErrorState/types';
import { useMemo } from 'react';

export interface ErrorModalProps {
  isVisible: boolean;
  errorType: ErrorType;
  errorCode?: string;
  description?: string;
  onRetry?: () => void;
}

function getErrorDetailsByType(errorType: ErrorType) {
  switch (errorType) {
    case ErrorType.NoConnection:
      return {
        // This is ServerError in the designs, but in this case it doesn't make much sense
        // TODO: Decide whether to hardcode the title to `Server Error`
        title: 'Connection error',
        description:
          'A connection error occured. Please check the network connection and try again.',
      };
    case ErrorType.Timeout:
      return {
        title: 'Connection Error',
        description:
          'Request timed out. This could indicate a problem with the server, or with your network connection',
      };
    case ErrorType.GenericError:
    case ErrorType.ServerError:
    case ErrorType.UnexpectedClientError:
    default:
      return {
        title: 'Server Error',
        description: 'Oops! An unexpected error occured.',
      };
  }
}

function getErrorDetails(
  errorType: ErrorType,
  customDescription?: string,
  errorCode?: string,
) {
  if (customDescription) {
    return {
      title: 'Server Error',
      description: customDescription,
    };
  }

  const { title, description } = getErrorDetailsByType(errorType);

  return {
    title,
    description: errorCode
      ? `${description} Please contact the Help Desk.`
      : description,
  };
}

export function ErrorModal({
  isVisible,
  errorType,
  description: customDescription,
  errorCode,
  onRetry,
}: ErrorModalProps) {
  const { title, description } = useMemo(
    () => getErrorDetails(errorType, customDescription, errorCode),
    [customDescription, errorCode, errorType],
  );
  return (
    <Modal isVisible={isVisible} onBackdropPress={noop} style={styles.modal}>
      <View style={styles.container}>
        <AttentionIcon height={40} width={40} style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {errorCode && (
          <Text style={[styles.description, styles.bold]}>
            {`Error code: ${errorCode}`}
          </Text>
        )}
        {onRetry && (
          <BlockButton
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={onRetry}
          />
        )}
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
    // TODO: This padding is probably not needed
    paddingTop: 20,
    paddingBottom: 10,
    // TODO: Find out why the outer part of the modal is not the specified background color here
    backgroundColor: Colors.pure,
  },
  icon: {
    justifyContent: 'center',
    alignContent: 'center',
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
  bold: {
    fontWeight: FontWeight.Bold,
  },
  button: {
    flex: 1,
    borderRadius: 4,
    padding: 12,
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
