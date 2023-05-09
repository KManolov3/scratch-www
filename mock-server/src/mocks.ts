import { faker } from '@faker-js/faker';
import { MockList } from '@graphql-tools/mock';

const storeNumberFaker = () => faker.random.numeric(4);
const planogramIdFaker = () => faker.random.numeric(5);
const skuFaker = () => faker.random.numeric(8);
const quantityFaker = () => faker.datatype.number({min: 0, max: 50});

function toDateISOString(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const itemFakes = {
  sku: skuFaker,
  mfrPartNum: () => faker.random.alphaNumeric(5),
  partDesc: () => faker.commerce.product(),
  upc: () => faker.random.numeric(10),
};

export const mocks = {
  String: () => faker.random.words(),
  Date: () => toDateISOString(faker.date.future()),

  Item: {
    ...itemFakes,

    retailPrice: () =>
      faker.datatype.float({ min: 10, max: 100, precision: 0.01 }),
    onHand: quantityFaker,
  },

  Planogram: {
    planogramId: planogramIdFaker,
    description: () => faker.commerce.productDescription(),
    seqNum: faker.datatype.number(),
  },
  
  BackStockSlot: {
    slotId: () => faker.datatype.number({ min: 0, max: 99999999 }),
    qty: quantityFaker, 
  },

  CycleCount: {
    cycleCountId: () => faker.datatype.number({ min: 10000000, max: 90000000 }),
    storeNumber: storeNumberFaker,
    guid: () => faker.datatype.uuid(),
    skus: () => new MockList([1, 5], skuFaker),
    dueDate: () => toDateISOString(faker.date.soon(5)),
  },

  TruckScan: {
    asnReferenceNumber: () => faker.random.alphaNumeric(10),
    storeNumber: () => faker.random.numeric(4),
  },

  TruckScanItem: {
    ...itemFakes,
  },

  Pog: {
    storeNumber: storeNumberFaker,
    skuNumber: skuFaker,
    pogId: planogramIdFaker,
    pogDescription: () => faker.commerce.productDescription(),
    lastModifiedDate: () => faker.date.past(),
  },
};
