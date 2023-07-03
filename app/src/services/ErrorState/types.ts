export enum BehaviourOnFailure {
  Toast,
  Modal,
  Ignored,
}

export type ErrorOptions =
  | {
      behaviourOnFailure: BehaviourOnFailure.Ignored | BehaviourOnFailure.Toast;
      shouldRetryRequest?: never;
      maxRetries?: never;
    }
  | {
      behaviourOnFailure: BehaviourOnFailure.Modal;
      shouldRetryRequest: boolean;
      maxRetries?: number;
    };

export type GlobalErrorHandlingSetting =
  | 'disabled'
  | { interceptError: (error: unknown) => ErrorOptions };

export interface ErrorState {
  executeAndHandleErrors: <T>(
    doRequest: () => Promise<T>,
    // Invoked with an error, when such is received. Should return desired
    // error handling behaviour (for example, whether to show a toast, modal or ignore the error).
    // This function is also expected to throw a `PresentableError`, with title and description
    // in case we want to override the default modal presentation. The thrown error should also include
    // an `options` object with the rest of the desired error options.
    interceptError: (error: unknown) => ErrorOptions,
  ) => Promise<T>;
}

export enum ErrorType {
  NoConnection,
  // TODO: Start detecting timeouts
  Timeout,
  // TODO: Think on how to detect client errors. We can't just use status code
  // in graphQL; default Apollo behaviour is to set a clientError field if such occurs
  UnexpectedClientError,
  ServerError,
  GenericError,
  Presentable,
}

export type ErrorInfo =
  | {
      errorType: ErrorType;
      errorCode?: never;
      customMessage?: never;
    }
  | {
      errorType: ErrorType.ServerError;
      errorCode?: string;
      customMessage?: never;
    }
  | {
      errorType: ErrorType.Presentable;
      errorCode?: never;
      // TODO: Currently we are allowing for `customMessage` only in the
      // case when throwing a PresentableError. Do we want to allow setting
      // one in other cases as well?
      customMessage?: string;
    };

export type ErrorHandlingStrategy = {
  options: ErrorOptions;
  errorInfo: ErrorInfo;
};
