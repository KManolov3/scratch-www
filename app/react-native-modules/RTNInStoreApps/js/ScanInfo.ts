// See https://techdocs.zebra.com/datawedge/latest/guide/output/intent/ for the complete list
export enum ScanLabelType {
  AUSPOSTAL = 'LABEL-TYPE-AUSPOSTAL',
  AZTEC = 'LABEL-TYPE-AZTEC',
  BOOKLAND = 'LABEL-TYPE-BOOKLAND',
  CANPOSTAL = 'LABEL-TYPE-CANPOSTAL',
  CHINESE = 'LABEL-TYPE-CHINESE-2OF5',
  CODABAR = 'LABEL-TYPE-CODABAR',
  CODE11 = 'LABEL-TYPE-CODE11',
  CODE128 = 'LABEL-TYPE-CODE128',
  CODE32 = 'LABEL-TYPE-CODE32',
  CODE39 = 'LABEL-TYPE-CODE39',
  CODE93 = 'LABEL-TYPE-CODE93',
  COMPOSITE_AB = 'LABEL-TYPE-COMPOSITE-AB',
  COMPOSITE_C = 'LABEL-TYPE-COMPOSITE-C',
  COUPON = 'LABEL-TYPE-COUPON',
  D2OF5 = 'LABEL-TYPE-D2OF5',
  DATABAR = 'LABEL-TYPE-DATABAR-COUPON',
  DATAMATRIX = 'LABEL-TYPE-DATAMATRIX',
  DOTCODE = 'LABEL-TYPE-DOTCODE',
  DUTCHPOSTAL = 'LABEL-TYPE-DUTCHPOSTAL',
  EAN128 = 'LABEL-TYPE-EAN128',
  EAN13 = 'LABEL-TYPE-EAN13',
  EAN8 = 'LABEL-TYPE-EAN8',
  FINNISHPOSTAL = 'LABEL-TYPE-FINNISHPOSTAL-4S',
  GRIDMATRIX = 'LABEL-TYPE-GRIDMATRIX',
  GS1 = 'LABEL-TYPE-GS1-DATABAR',
  GS1_DATAMATRIX = 'LABEL-TYPE-GS1-DATAMATRIX',
  GS1_EXP = 'LABEL-TYPE-GS1-DATABAR-EXP',
  GS1_LIM = 'LABEL-TYPE-GS1-DATABAR-LIM',
  GS1_QRCODE = 'LABEL-TYPE-GS1-QRCODE',
  HANXIN = 'LABEL-TYPE-HANXIN',
  I2OF5 = 'LABEL-TYPE-I2OF5',
  IATA2OF5 = 'LABEL-TYPE-IATA2OF5',
  ISBT128 = 'LABEL-TYPE-ISBT128',
  JAPPOSTAL = 'LABEL-TYPE-JAPPOSTAL',
  KOREAN = 'LABEL-TYPE-KOREAN-3OF5',
  MAILMARK = 'LABEL-TYPE-MAILMARK',
  MATRIX = 'LABEL-TYPE-MATRIX-2OF5',
  MAXICODE = 'LABEL-TYPE-MAXICODE',
  MICROPDF = 'LABEL-TYPE-MICROPDF',
  MICROQR = 'LABEL-TYPE-MICROQR',
  MSI = 'LABEL-TYPE-MSI',
  MULTICODE_DATA_FORMAT = 'MULTICODE-DATA-FORMAT',
  OCR = 'LABEL-TYPE-OCR',
  PDF417 = 'LABEL-TYPE-PDF417',
  QRCODE = 'LABEL-TYPE-QRCODE',
  SIGNATURE = 'LABEL-TYPE-SIGNATURE',
  TLC39 = 'LABEL-TYPE-TLC39',
  TRIOPTIC39 = 'LABEL-TYPE-TRIOPTIC39',
  UKPOSTAL = 'LABEL-TYPE-UKPOSTAL',
  UNDEFINED = 'LABEL-TYPE-UNDEFINED',
  UPCA = 'LABEL-TYPE-UPCA',
  UPCE0 = 'LABEL-TYPE-UPCE0',
  UPCE1 = 'LABEL-TYPE-UPCE1',
  US4STATE = 'LABEL-TYPE-US4STATE',
  US4STATE_FICS = 'LABEL-TYPE-US4STATE-FICS',
  USPLANET = 'LABEL-TYPE-USPLANET',
  USPOSTNET = 'LABEL-TYPE-USPOSTNET',
  WEBCODE = 'LABEL-TYPE-WEBCODE',
}

export interface ScanInfo {
  type: ScanLabelType;
  code: string;
}
