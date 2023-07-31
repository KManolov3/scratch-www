import {
  ReactNode,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { ErrorModal } from '@components/ErrorModal';
import { useConfirmation } from '@hooks/useConfirmation';
import { isErrorWithMessage } from '@lib/error';
import { useNetInfo } from '@react-native-community/netinfo';
import { newRelicService } from '@services/NewRelic';
import { toastService } from '@services/ToastService';
import {
  buildErrorInfo,
  ErrorOptions,
  ModalError,
  ErrorInfo,
} from './formatter';

const ErrorContext = createContext<GlobalErrorHandling | undefined>(undefined);

export type GlobalErrorHandlingSetting = (error: unknown) => ErrorOptions;

export interface GlobalErrorHandling {
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
 */
export class PresentableError extends Error {
  options: ErrorInfo;

  originalError: unknown;

  constructor(options: ErrorInfo, originalError: unknown) {
    super(
      isErrorWithMessage(originalError)
        ? originalError.message
        : 'Presentable Error',
    );

    this.options = options;
    this.originalError = originalError;
  }
}

export interface ErrorContextProviderProps {
  children: ReactNode;
}

export function ErrorContextProvider({ children }: ErrorContextProviderProps) {
  const { isConnected: isConnectedPrimitive } = useNetInfo();
  const isConnectedRef = useRef(isConnectedPrimitive);
  isConnectedRef.current = isConnectedPrimitive;

  const {
    itemToConfirm: errorToVisualise,
    confirmationRequested: isErrorModalVisible,
    askForConfirmation: showErrorModal,
    accept: retry,
    reject: cancel,
  } = useConfirmation<ModalError>();

  const logError = useCallback((error: unknown) => {
    // Intentionally leaving this here so that we can see what errors happen
    // eslint-disable-next-line no-console
    console.error(error);

    newRelicService.onGlobalError(error);
  }, []);

  const executeAndHandleErrors = useCallback(
    async <T,>(
      doRequest: () => Promise<T>,
      interceptError: (error: unknown) => ErrorOptions,
      execCount: number,
    ): Promise<T> => {
      try {
        return await doRequest();
      } catch (error) {
        logError(error);

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

          errorInfo = buildErrorInfo(
            error,
            errorOptions,
            isConnectedRef.current ?? true,
          );
        }

        // Global error handling was explicitly disabled
        if (errorInfo === 'ignored') {
          throw errorToRethrow;
        }

        if (errorInfo.displayAs === 'toast') {
          toastService.showInfoToast(errorInfo.message, {
            props: { containerStyle: errorInfo.toastStyle ?? {} },
          });

          // We still want the error to reach the code that invoked the request initially.
          throw errorToRethrow;
        }

        const canAttemptRetry =
          errorInfo.allowRetries && (errorInfo.maxRetries ?? 2) >= execCount;

        const errorModalPromise = showErrorModal({
          ...errorInfo,
          allowRetries: canAttemptRetry,
        });

        // `errorModalPromise` will resolve to either true or false
        // depending on whether the user has requested a retry of the failed request
        if (canAttemptRetry && (await errorModalPromise)) {
          return executeAndHandleErrors(
            doRequest,
            interceptError,
            execCount + 1,
          );
        }

        throw errorToRethrow;
      }
    },
    [logError, showErrorModal],
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
            isVisible={isErrorModalVisible}
            title={errorToVisualise.title}
            description={errorToVisualise.message}
            withRetry={errorToVisualise.allowRetries}
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
