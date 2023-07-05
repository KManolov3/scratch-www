import {
  ReactNode,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { ErrorModal } from '@components/ErrorModal';
import { useConfirmation } from '@hooks/useConfirmation';
import { useNetInfo } from '@react-native-community/netinfo';
import { toastService } from '@services/ToastService';
import {
  buildErrorInfo,
  ErrorOptions,
  ModalError,
  ErrorInfo,
} from './formatter';

const ErrorContext = createContext<ErrorState | undefined>(undefined);

export type GlobalErrorHandlingSetting =
  | 'disabled'
  | { interceptError: (error: unknown) => ErrorOptions };

export interface ErrorState {
  /**
   * When registering a request with the global error handling, an `interceptError` callback
   * must be provided. It should return the `ErrorOptions` for handling an error. It can also
   * return `ignored` to just rethrow the error without any additional handling.
   */
  executeWithGlobalErrorHandling: <T>(
    doRequest: () => Promise<T>,
    interceptError: (error: unknown) => ErrorOptions,
  ) => Promise<T>;
}

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
    async <T,>(
      doRequest: () => Promise<T>,
      interceptError: (error: unknown) => ErrorOptions,
      execCount: number,
    ): Promise<T> => {
      try {
        return await doRequest();
      } catch (error) {
        let errorInfo: ErrorInfo;
        let errorToRethrow = error;

        if (error instanceof PresentableError) {
          errorInfo = error.options;
          // TODO: Do we rethrow the PresentableError and not the original one?
          // Currently `originalError` is a mandatory field, but I can think of cases
          // where we might not want this to be true.
          errorToRethrow = error.originalError;
        } else {
          const errorOptions = interceptError(error);

          errorInfo = buildErrorInfo(error, errorOptions, isConnected ?? true);
        }

        // Global error handling was explicitly disabled
        if (errorInfo === 'ignored') {
          throw errorToRethrow;
        }

        if (errorInfo.behaviourOnFailure === 'toast') {
          toastService.showInfoToast(errorInfo.message, {
            // We'd almost always want to offset the toast, so that it isn't shown on the bottom bar
            // If a consistent toast position isn't desired, find a way to configure those styles.
            props: { containerStyle: errorInfo.toastStyle ?? {} },
          });

          // We still want the error to reach the code that invoked the request initially.
          throw errorToRethrow;
        }

        const canAttemptRetry =
          errorInfo.shouldRetryRequest &&
          (errorInfo.maxRetries ?? 2) < execCount;

        if (
          !(await askToRetry({
            ...errorInfo,
            shouldRetryRequest: canAttemptRetry,
          }))
        ) {
          throw errorToRethrow;
        }

        return executeAndHandleErrors(doRequest, interceptError, execCount + 1);
      }
    },
    [askToRetry, isConnected],
  );

  const executeWithGlobalErrorHandling = useCallback(
    <T,>(
      doRequest: () => Promise<T>,
      interceptError: (error: unknown) => ErrorOptions,
    ): Promise<T> => executeAndHandleErrors(doRequest, interceptError, 1),
    [executeAndHandleErrors],
  );

  const state = useMemo(
    () => ({
      executeWithGlobalErrorHandling,
    }),
    [executeWithGlobalErrorHandling],
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
