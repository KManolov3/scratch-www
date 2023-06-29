import { ErrorModal } from '@components/ErrorModal';
import {
  ReactNode,
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { PresentableError } from 'src/errors/presentable-error';
import { useNetInfo } from '@react-native-community/netinfo';
import { ApolloError } from '@apollo/client';
import { toastService } from '@services/ToastService';
import { StyleSheet } from 'react-native/types';
import {
  ErrorType,
  ErrorOptions,
  ErrorHandlingStrategy,
  BehaviourOnFailure,
  ErrorState,
  ErrorInfo,
} from './types';

export const ErrorContext = createContext<ErrorState | undefined>(undefined);

function extractErrorInfo(error: unknown, isConnected: boolean): ErrorInfo {
  if (!isConnected) {
    return {
      errorType: ErrorType.NoConnection,
    };
  }

  if (error instanceof ApolloError) {
    const { graphQLErrors } = error;

    // TODO: Handle other fields set on ApolloError (for example clientErrors)
    // Note: Those will only be set on queries, since in `useManagedMutation`
    // we throw the ApolloError manually with just the graphQL errors

    // TODO: Do we handle more than the first error? How?
    if (graphQLErrors.length > 0) {
      // TODO: Do we use/check any of the fields of the error (message/stack/...)
      // We'll certainly log them once NewRelic is set up, but do we use it to show
      // the client information beside that? Current Figma designs prefer rather generic
      // messaging, so adhering to that for now.

      // TODO: Find out where an error code will be set in the error and return it
      return {
        errorType: ErrorType.ServerError,
      };
    }
  }

  if (error instanceof PresentableError) {
    return {
      errorType: ErrorType.Presentable,
      customMessage: error.message,
    };
  }

  return {
    errorType: ErrorType.GenericError,
  };
}

function determineErrorHandling(
  error: unknown,
  selectedOptions: ErrorOptions,
  isConnected: boolean,
): ErrorHandlingStrategy {
  if (selectedOptions.behaviourOnFailure === BehaviourOnFailure.Ignored) {
    return {
      options: {
        behaviourOnFailure: BehaviourOnFailure.Ignored,
      },
      // This should never actually be used.
      // TODO: Find a way to write the types more elegantly, so this
      // line can be omitted entirely.
      errorInfo: {
        errorType: ErrorType.GenericError,
      },
    };
  }

  const errorInfo = extractErrorInfo(error, isConnected);

  if (errorInfo.errorType === ErrorType.NoConnection) {
    // Allowing for retry of request on network failure and overriding
    // the passed behaviour preference. We generally want to prevent further requests
    // while the user does not have a connection, since they are also bound to fail.
    // TODO: Do we take a more "permissive" approach and respect the passed behaviour preference?
    return {
      options: {
        behaviourOnFailure: BehaviourOnFailure.Modal,
        shouldRetryRequest: true,
        maxRetries: Number.POSITIVE_INFINITY,
      },
      errorInfo: {
        errorType: ErrorType.NoConnection,
      },
    };
  }

  return {
    options: selectedOptions,
    errorInfo,
  };
}

function concatenatePhrases(phrases: string[]) {
  return phrases
    .filter(phrase => phrase.length > 0)
    .reduce((text, phrase) => `${text} ${phrase}`);
}

function constructToastMessage({
  errorType,
  errorCode,
  customMessage,
}: ErrorInfo) {
  let baseMessage = '';
  const errorCodeMessage = errorCode
    ? `Error code: ${errorCode}. Please contact the help desk.`
    : '';
  switch (errorType) {
    case ErrorType.NoConnection:
      baseMessage =
        'A connection error occured. Please check the network connection and try again.';
      break;
    case ErrorType.Timeout:
      baseMessage = 'Request timed out.';
      break;
    case ErrorType.GenericError:
    case ErrorType.ServerError:
    case ErrorType.UnexpectedClientError:
    default:
      baseMessage = 'Oops! An unexpected error occured.';
  }

  return concatenatePhrases([
    baseMessage,
    errorCodeMessage,
    customMessage ?? '',
  ]);
}

function showErrorToast(errorInfo: ErrorInfo) {
  return toastService.showInfoToast(constructToastMessage(errorInfo), {
    // We'd almost always want to offset the toast, so that it isn't shown on the bottom bar
    // If a consistent toast position isn't desired, find a way to configure those styles.
    props: { containerStyle: styles.toast },
  });
}

export interface ErrorStateProps {
  children: ReactNode;
}

export function ErrorStateProvider({ children }: ErrorStateProps) {
  const [{ errorToVisualise, onRetry }, setErrorState] = useState<{
    errorToVisualise?: ErrorInfo;
    onRetry?: () => void;
  }>({
    errorToVisualise: undefined,
    onRetry: undefined,
  });

  const { isConnected } = useNetInfo();

  // TODO: Try to rewrite this using `useConfirmation` hook
  const executeAndHandleErrors = useCallback(
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
    <T extends any>(
      doRequest: () => Promise<T>,
      interceptError: (error: unknown) => ErrorOptions,
      executionCount = 1,
    ) => {
      try {
        const isRetry = executionCount > 1;
        if (isRetry) {
          setErrorState({
            errorToVisualise: undefined,
            onRetry: undefined,
          });
        }

        return doRequest();
        // Should the error be of specific type?
      } catch (error) {
        let passedOptions: ErrorOptions = {
          behaviourOnFailure: BehaviourOnFailure.Ignored,
        };
        let customError: PresentableError | undefined;

        try {
          passedOptions = interceptError(error);
        } catch (interceptorError) {
          // This can happen when the original error has been overriden
          // with a custom visualisation
          // eslint-disable-next-line max-depth
          if (!(interceptorError instanceof PresentableError)) {
            // eslint-disable-next-line no-console
            console.error('Unexpected error type thrown from `interceptError`');
            throw interceptorError;
          }
          passedOptions = interceptorError.options;
          // TODO: I am rather dissatisfied with how the `PresentableError` abstraction
          // turned out - we are currently only using the message from it. We can just add
          // a `customMessage` property to ErrorOptions instead. Should we remove it?
          // Leaving it like that for now in case we decide to add and use more properties to it.
          customError = interceptorError;
        }

        const { options, errorInfo } = determineErrorHandling(
          customError ?? error,
          passedOptions,
          isConnected ?? true,
        );
        switch (options.behaviourOnFailure) {
          case BehaviourOnFailure.Toast:
            showErrorToast(errorInfo);
            break;
          case BehaviourOnFailure.Modal:
            setErrorState({
              errorToVisualise: errorInfo,
              // TODO: !!We are setting `onRetry`, but we need to actually propagate
              // the result back to the function caller after the request is retried.
              onRetry:
                options.shouldRetryRequest &&
                (options.maxRetries ?? 2) >= executionCount
                  ? async () => {
                      await executeAndHandleErrors(
                        doRequest,
                        interceptError,
                        executionCount + 1,
                      );

                      setErrorState({
                        errorToVisualise: undefined,
                        onRetry: undefined,
                      });
                    }
                  : undefined,
            });
            break;
          case BehaviourOnFailure.Ignored:
          default:
        }
        // We still want the error to be handled by the code that invoked the request initially.
        throw error;
      }
    },
    [isConnected],
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
            isVisible={!!errorToVisualise}
            errorType={errorToVisualise?.errorType}
            description={errorToVisualise?.customMessage}
            errorCode={errorToVisualise?.errorCode}
            onRetry={onRetry}
          />
        ) : null
      }
    </ErrorContext.Provider>
  );
}

export function useRequestManager() {
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
