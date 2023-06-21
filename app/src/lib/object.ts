export function safeParseJson(data: string) {
  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
}
