type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type ToastError = {
  behaviourOnFailure: 'toast';
  shouldRetryRequest?: never;
  maxRetries?: never;
  message: string;
};

export type ModalError = {
  behaviourOnFailure: 'modal';
  shouldRetryRequest: boolean;
  maxRetries?: number;
  title: string;
  message: string;
};

export type ErrorInfo = 'ignored' | ToastError | ModalError;
export type ErrorOptions =
  | 'ignored'
  | PartialBy<ToastError, 'message'>
  | PartialBy<ModalError, 'title' | 'message'>;

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
