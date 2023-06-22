export function safeParseJson(data: string | undefined) {
  if (!data) {
    return undefined;
  }

  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
}
