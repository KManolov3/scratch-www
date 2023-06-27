export class Deferred<T> {
  resolve!: (value: T) => void;

  reject!: (error: unknown) => void;

  readonly promise = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
}
