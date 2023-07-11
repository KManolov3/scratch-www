export function swallowError<T>(
  func: (...args: unknown[]) => Promise<T>,
  args: unknown[] = [],
) {
  return func(...args).catch(() => {
    // Intentionally ignored
    // the error should be handled somewhere else
  });
}
