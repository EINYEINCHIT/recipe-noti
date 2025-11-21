export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isDefined<T>(v: T | undefined | null): v is T {
  return v !== undefined && v !== null;
}