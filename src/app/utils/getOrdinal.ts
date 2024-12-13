type StringEnum = { [key: string]: string };

export function getOrdinal<T extends StringEnum>(enumObj: T, value: string): number {
  return Object.values(enumObj).indexOf(value);
}
