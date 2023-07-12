import { StyleProp, ViewStyle } from 'react-native';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type ToastError = {
  displayAs: 'toast';
  message: string;
  toastStyle?: StyleProp<ViewStyle>;
};

export type ModalError = {
  displayAs: 'modal';
  allowRetries: boolean;
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

  if (selectedOptions.displayAs === 'toast') {
    return {
      message: 'Oops! An unexpected error occured.',
      ...selectedOptions,
    };
  }

  if (!isConnected) {
    // Allowing for retry of request on network failure. We generally want to prevent further requests
    // while the user does not have a connection, since they are also bound to fail.
    return {
      displayAs: 'modal',
      allowRetries: true,
      maxRetries: Number.POSITIVE_INFINITY,
      title: 'Server Error',
      message:
        'A connection error occurred. Please check the network connection and try again.',
    };
  }

  return {
    title: 'Server Error',
    message:
      'An unexpected server error occurred. Please contact the help desk',
    ...selectedOptions,
  };
}
