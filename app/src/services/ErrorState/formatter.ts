import { StyleProp, ViewStyle } from 'react-native';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type ToastError = {
  behaviourOnFailure: 'toast';
  message: string;
  toastStyle?: StyleProp<ViewStyle>;
};

export type ModalError = {
  behaviourOnFailure: 'modal';
  shouldRetryRequest: boolean;
  /**
   * Defaults to 2
   */
  maxRetries?: number;
  title: string;
  message: string;
};

export type ErrorInfo = 'ignored' | ToastError | ModalError;
export type ErrorOptions =
  | 'ignored'
  | PartialBy<ToastError, 'message'>
  | PartialBy<ModalError, 'title' | 'message'>;

export function buildErrorInfo(
  error: unknown,
  selectedOptions: ErrorOptions,
  isConnected: boolean,
): ErrorInfo {
  if (selectedOptions === 'ignored') {
    return 'ignored';
  }

  if (!isConnected) {
    // Allowing for retry of request on network failure and overriding
    // the passed behaviour preference. We generally want to prevent further requests
    // while the user does not have a connection, since they are also bound to fail.
    // TODO: Do we take a more "permissive" approach and respect the passed behaviour preference?
    return {
      behaviourOnFailure: 'modal',
      shouldRetryRequest: true,
      maxRetries: Number.POSITIVE_INFINITY,
      title: 'Server Error',
      message:
        'A connection error occured. Please check the network connection and try again.',
    };
  }

  if (selectedOptions.behaviourOnFailure === 'toast') {
    return {
      message: 'Oops! An unexpected error occured.',
      ...selectedOptions,
    };
  }

  return {
    title: 'Server Error',
    // TODO: Think of a better message?
    message: 'A connection error occured. Please contact the help desk.',
    ...selectedOptions,
  };
}
