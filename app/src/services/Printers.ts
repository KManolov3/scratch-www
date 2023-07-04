export type Printer =
  | {
      type: 'portable';
      networkName: string;
    }
  | {
      type: 'counter';
      id: (typeof Printers.availableCounterPrinters)[number]['id'];
    };

export const Printers = {
  availableCounterPrinters: Object.freeze([
    { id: 1, name: 'Counter Printer 1' },
    { id: 2, name: 'Counter Printer 2' },
    { id: 3, name: 'Counter Printer 3' },
  ] as const),

  labelOf(printer: Printer) {
    switch (printer.type) {
      case 'counter':
        return Printers.availableCounterPrinters.find(_ => _.id === printer.id)
          ?.name;
      case 'portable':
        return `Portable ${printer.networkName}`;
    }
  },

  serverIdOf(printer: Printer) {
    switch (printer.type) {
      case 'counter':
        return Printers.availableCounterPrinters.find(_ => _.id === printer.id)
          ?.name;
      case 'portable':
        return printer.networkName;
    }
  },
};
