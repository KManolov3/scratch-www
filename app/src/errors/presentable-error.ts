import { ErrorOptions } from '@services/ErrorState/types';

export interface PresentableErrorProps {
  message: string;
  options: ErrorOptions;
}

// TODO: Extract to another file
export class PresentableError {
  message: string;

  options: ErrorOptions;

  constructor({ message, options }: PresentableErrorProps) {
    this.message = message;
    this.options = options;
    // No error stack included, since this is not expected to be logged in a monitoring system.
    // We'd likely prefer logging the original error instead.
  }
}
