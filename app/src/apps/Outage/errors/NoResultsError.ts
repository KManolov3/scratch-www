export class NoResultsError extends Error {
  originalError: unknown;

  constructor(message: string, originalError: unknown) {
    super(message);
    this.originalError = originalError;
  }
}
