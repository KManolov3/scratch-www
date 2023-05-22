export enum PrinterOptions {
  Counter1 = 'Printer Counter 1',
  Counter2 = 'Printer Counter 2',
  Counter3 = 'Printer Counter 3',
  Portable = 'Portable',
}

export interface DefaultSettings {
  defaultPrinterOption: PrinterOptions;
}

export function useDefaultSettings(): DefaultSettings {
  return { defaultPrinterOption: PrinterOptions.Counter1 };
}
