import { useCallback } from 'react';

export enum PrinterOptions {
  Counter1 = 'Printer Counter 1',
  Counter2 = 'Printer Counter 2',
  Counter3 = 'Printer Counter 3',
  Portable = 'Portable',
}

export interface DefaultSettings {
  defaultPrinterOption: PrinterOptions;
  storeNumber: string;
}

export function useDefaultSettings(): DefaultSettings & {
  set: <Key extends keyof DefaultSettings, Value = DefaultSettings[Key]>(
    key: Key,
    value: Value,
  ) => void;
} {
  const set = useCallback(
    <Key extends keyof DefaultSettings, Value = DefaultSettings[Key]>(
      _key: Key,
      _value: Value,
    ) => {
      // TODO: set the value in **whereever these values are kept**
    },
    [],
  );
  return {
    // TODO: hardcoded for now, change when we implement the launcher
    defaultPrinterOption: PrinterOptions.Counter1,
    storeNumber: '0363',
    set,
  };
}
