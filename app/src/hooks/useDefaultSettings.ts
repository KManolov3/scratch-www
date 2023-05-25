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

export function useDefaultSettings(): DefaultSettings {
  return {
    // TODO: hardcoded for now, change when we implement the launcher
    defaultPrinterOption: PrinterOptions.Counter1,
    storeNumber: '0363',
  };
}
