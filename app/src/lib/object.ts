export function safeParseJson(data: string | undefined) {
  if (!data) {
    return undefined;
  }

  try {
    return JSON.parse(data);
  } catch {
    // eslint-disable-next-line no-console
    console.error('Could not parse ', data);
    return undefined;
  }
}
