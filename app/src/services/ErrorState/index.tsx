import {
  ReactNode,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { StyleSheet } from 'react-native/types';
import { ErrorModal } from '@components/ErrorModal';
import { useConfirmation } from '@hooks/useConfirmation';
import { useNetInfo } from '@react-native-community/netinfo';
import { toastService } from '@services/ToastService';
import { ErrorOptions, ErrorState, ErrorInfo, ModalError } from './types';

export const ErrorContext = createContext<ErrorState | undefined>(undefined);

/**
 * Can be thrown in an async block of code making use of the global error handling
 * to provide the details for visualising the error explicitly.
 * NOTE: Do not throw a `PresentableError` inside of an `interceptError` callback,
 * rather throw it inside the wrapped async code.
 * TODO: Should we handle the above case as well?
 */
export class PresentableError extends Error {
  options: ErrorInfo;

  originalError: unknown;

  constructor(options: ErrorInfo, originalError: unknown) {
    super();

    this.options = options;
    this.originalError = originalError;
  }
}

function buildErrorInfo(
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

export interface ErrorStateProps {
  children: ReactNode;
}

export function ErrorStateProvider({ children }: ErrorStateProps) {
  const { isConnected } = useNetInfo();

  const {
    itemToConfirm: errorToVisualise,
    confirmationRequested: isRetryModalVisible,
    askForConfirmation: askToRetry,
    accept: retry,
    reject: cancel,
  } = useConfirmation<ModalError>();

  const executeAndHandleErrors = useCallback(
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
    async <T extends any>(
      doRequest: () => Promise<T>,
      interceptError: (error: unknown) => ErrorOptions,
      execCount = 1,
    ): Promise<T> => {
      try {
        return await doRequest();
      } catch (error) {
        let errorOptions: ErrorOptions;

        if (error instanceof PresentableError) {
          errorOptions = error.options;
        } else {
          errorOptions = interceptError(error);
        }

        const errorInfo = buildErrorInfo(
          error,
          errorOptions,
          isConnected ?? true,
        );

        // Global error handling was explicitly disabled
        if (errorInfo === 'ignored') {
          throw error;
        }

        if (errorInfo.behaviourOnFailure === 'toast') {
          toastService.showInfoToast(errorInfo.message, {
            // We'd almost always want to offset the toast, so that it isn't shown on the bottom bar
            // If a consistent toast position isn't desired, find a way to configure those styles.
            props: { containerStyle: styles.toast },
          });

          // We still want the error to reach the code that invoked the request initially.
          throw error;
        }

        const canAttemptRetry =
          errorInfo.shouldRetryRequest &&
          (errorInfo.maxRetries ?? 0) < execCount;

        if (
          !(await askToRetry({
            ...errorInfo,
            shouldRetryRequest: canAttemptRetry,
          }))
        ) {
          throw error;
        }

        return executeAndHandleErrors(doRequest, interceptError, execCount + 1);
      }
    },
    [askToRetry, isConnected],
  );

  const state = useMemo(
    () => ({
      executeAndHandleErrors,
    }),
    [executeAndHandleErrors],
  );

  return (
    <ErrorContext.Provider value={state}>
      {children}
      {
        // Prefer having an explicit `shouldErrorModalBeVisible` field in the state
        // if we want to control this modal from outside at some point
        errorToVisualise ? (
          <ErrorModal
            isVisible={isRetryModalVisible}
            title={errorToVisualise.title}
            description={errorToVisualise.message}
            withRetry={errorToVisualise.shouldRetryRequest}
            onRetry={retry}
            onCancel={cancel}
          />
        ) : null
      }
    </ErrorContext.Provider>
  );
}

export function useErrorManager() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error(
      'Cannot use useRequestManager outside of ErrorStateProvider',
    );
  }

  return context;
}

const styles = StyleSheet.create({
  toast: {
    marginBottom: '10%',
  },
});
