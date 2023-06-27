import { ScanInfo, ScanLabelType } from 'rtn-in-store-apps';
import { useScanListener } from './Scanner';
import { toastService } from './ToastService';

type FrontTag = {
  type: 'front-tag';
  sku: string;
  frontTagPrice: number;
};

type Sku = {
  type: 'sku';
  sku: string;
};

type Upc = { type: 'UPC'; upc: string };

type ContaienerLabel = {
  type: 'container-label';
  storeNumber: string;
  containerNumber: number;
};

type BackstockSlot = { type: 'backstock-slot'; slotNumber: number };

type ScannedCode = FrontTag | Sku | Upc | ContaienerLabel | BackstockSlot;

class ScanCodeService {
  parse({ code, type }: ScanInfo): ScannedCode {
    switch (type) {
      case ScanLabelType.UPCA:
      case ScanLabelType.UPCE0:
      case ScanLabelType.UPCE1:
        return { type: 'UPC', upc: code };

      default: {
        const knownFormat =
          // Reading the alternative front tag first since it includes a `,` symbol and the
          // others don't, while it can start with `9` or `99` same as the other formats
          this.readAlternativeFrontTag(code) ||
          this.readFrontTag(code) ||
          this.readContainerLabel(code) ||
          this.readBackstockSlot(code);
        if (knownFormat) return knownFormat;

        // Just in case this is a UPC number encoded in another barcode type
        // There shouldn't be any SKUs with this number of symbols
        if (code.length === 12) {
          return { type: 'UPC', upc: code };
        }

        // If all else fails, then it's probably a backroom tag containing just the SKU
        // and no other markers
        return { type: 'sku', sku: code };
      }
    }
  }

  private readonly FRONT_TAG_REGEX = /^99(\w+)(\d{5})$/;

  private readFrontTag(code: string) {
    const match = code.match(this.FRONT_TAG_REGEX);
    if (!match) {
      return;
    }

    if (!match[1] || !match[2]) {
      throw new Error('Invalid front tag regex');
    }

    return {
      type: 'front-tag',
      sku: match[1],
      frontTagPrice: parseInt(match[2], 10) / 100,
    } as const;
  }

  private readonly CONTAINER_REGEX = /^90(\d{4})(\d{6})$/;

  private readContainerLabel(code: string) {
    const match = code.match(this.CONTAINER_REGEX);
    if (!match) {
      return;
    }

    if (!match[1] || !match[2]) {
      throw new Error('Invalid container label regex');
    }

    return {
      type: 'container-label',
      storeNumber: match[1],
      containerNumber: parseInt(match[2], 10),
    } as const;
  }

  private readonly BACKSTOCK_SLOT_REGEX = /^22(\d{10})$/;

  private readBackstockSlot(code: string) {
    const match = code.match(this.BACKSTOCK_SLOT_REGEX);
    if (!match) {
      return;
    }

    if (!match[1] || !match[2]) {
      throw new Error('Invalid backstock slot regex');
    }

    return {
      type: 'backstock-slot',
      slotNumber: parseInt(match[1], 10),
    } as const;
  }

  private readonly ALTERNATIVE_FRONT_TAG_REGEX = /^(\w+),(\d+)$/;

  private readAlternativeFrontTag(code: string) {
    const match = code.match(this.ALTERNATIVE_FRONT_TAG_REGEX);
    if (!match) {
      return;
    }

    if (!match[1] || !match[2]) {
      throw new Error('Invalid alternative front tag regex');
    }

    return {
      type: 'front-tag',
      sku: match[1],
      frontTagPrice: parseInt(match[2], 10) / 100,
    } as const;
  }
}

const scanCodeService = new ScanCodeService();

interface ScanActions {
  onFrontTag?: (frontTag: FrontTag) => void;
  onSku?: (sku: Sku) => void;
  onUpc?: (upc: Upc) => void;
  onContainerLabel?: (contaienerLabel: ContaienerLabel) => void;
  onBackstockSlot?: (backstockSlot: BackstockSlot) => void;
  onUnsupportedCode?: (scannedCode: ScannedCode) => void;
}

export function useScanCodeListener({
  onUnsupportedCode = () => toastService.showUnsupportedScanCodeToast(),
  onBackstockSlot = onUnsupportedCode,
  onContainerLabel = onUnsupportedCode,
  onSku = onUnsupportedCode,
  onUpc = onUnsupportedCode,
  onFrontTag = onSku
    ? ({ sku }) => onSku({ sku, type: 'sku' })
    : onUnsupportedCode,
}: ScanActions) {
  useScanListener(scan => {
    const parsedScanCode = scanCodeService.parse(scan);
    switch (parsedScanCode.type) {
      case 'sku':
        onSku(parsedScanCode);
        break;

      case 'UPC':
        onUpc(parsedScanCode);
        break;

      case 'backstock-slot':
        onBackstockSlot(parsedScanCode);
        break;

      case 'container-label':
        onContainerLabel(parsedScanCode);
        break;

      case 'front-tag':
        onFrontTag(parsedScanCode);
        break;
    }
  });
}
