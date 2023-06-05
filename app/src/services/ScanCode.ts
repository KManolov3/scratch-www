import { ScanInfo } from 'react-native-modules/RTNInStoreApps/js/ScanInfo';

type ScannedCode =
  | {
      type: 'SKU';
      sku: string;
      frontTagPrice: number;
    }
  | { type: 'UPC'; upc: string };

const frontTagRegex = /^99(\w+)(\d{5})$/;

class ScanCode {
  parse({ code }: ScanInfo): ScannedCode {
    const frontTag = code.match(frontTagRegex);
    if (frontTag && frontTag[1] && frontTag[2]) {
      return {
        type: 'SKU',
        sku: frontTag[1],
        frontTagPrice: parseInt(frontTag[2], 10) / 100,
      };
    }
    return { type: 'UPC', upc: code };
  }
}

export const scanCodeService = new ScanCode();
