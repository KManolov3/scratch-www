import { faker } from '@faker-js/faker';
import {
  IMocks,
  MockList,
  addMocksToSchema,
  createMockStore,
} from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFile } from 'fs/promises';
import { TestItemInput } from '../../e2e-tests/__generated__/graphql.js';

const innerSchema = makeExecutableSchema({
  typeDefs: await Promise.all([
    readFile('schema/base-schema.graphql', 'utf-8'),
    readFile('schema/cycle-count-extensions.graphql', 'utf-8'),
    readFile('schema/test-only-schema.graphql', 'utf-8'),
  ]),
});

const storeNumberFaker = () => faker.random.numeric(4);
const skuFaker = () => faker.random.numeric(8);
const planogramIdFaker = () => faker.random.numeric(5);
const quantityFaker = () => faker.datatype.number({ min: 0, max: 50 });

const itemFakes = {
  sku: skuFaker,
  mfrPartNum: () => faker.random.alphaNumeric(5),
  partDesc: () => faker.commerce.product(),
  upc: () => faker.random.numeric(10),
};

const mocks: IMocks = {
  String: () => faker.random.words(),
  Date: () => toDateISOString(faker.date.future()),

  Item: {
    ...itemFakes,

    retailPrice: () =>
      faker.datatype.float({ min: 10, max: 100, precision: 0.01 }),
    onHand: quantityFaker,
  },

  CycleCount: {
    cycleCountId: () => faker.datatype.number({ min: 10000000, max: 90000000 }),
    storeNumber: storeNumberFaker,
    guid: () => faker.datatype.uuid(),
    skus: () => new MockList([1, 5], skuFaker),
    dueDate: () => toDateISOString(faker.date.soon(5)),
  },

  NewCycleCount: {
    id: () => faker.datatype.number({ min: 10000000, max: 90000000 }),
    storeNumber: storeNumberFaker,
    dueDate: () => toDateISOString(faker.date.soon(5)),
  },

  CycleCountItem: {
    locationId: planogramIdFaker,
    quantityAtLocation: quantityFaker,
  },

  TruckScan: {
    asnReferenceNumber: () => faker.random.alphaNumeric(10),
    storeNumber: () => faker.random.numeric(4),
  },

  TruckScanItem: {
    ...itemFakes,
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

  Pog: {
    storeNumber: storeNumberFaker,
    skuNumber: skuFaker,
    pogId: planogramIdFaker,
    pogDescription: () => faker.commerce.productDescription(),
    lastModifiedDate: () => faker.date.past(),
  },
};

// See https://the-guild.dev/graphql/tools/docs/mocking for documentation
const store = createMockStore({
  mocks,
  schema: innerSchema,
  typePolicies: {
    BackStockSlot: { keyFieldName: 'guid' },
    CycleCount: { keyFieldName: 'cycleCountId' },
    Planogram: { keyFieldName: 'planogramId' },
    Pog: { keyFieldName: 'pogId' },
    NewCycleCount: { keyFieldName: 'id' },
    TruckScan: { keyFieldName: 'asnReferenceNumber' },
    TruckScanItem: { keyFieldName: 'sku' },
  },
});

export const schema = addMocksToSchema({
  schema: innerSchema,
  store,
  // eslint-disable-next-line no-shadow, arrow-parens
  resolvers: store => ({
    Mutation: {
      testSetData(_, { input }) {
        const items = input.items.map((item: TestItemInput) => {
          store.set({
            typeName: 'Query',
            key: 'ROOT',
            fieldName: 'itemBySku',
            fieldArgs: { sku: item.sku, storeNumber: input.storeNumber },
            value: {
              mfrPartNum: item.mfrPartNum,
              partDesc: item.partDesc,
              sku: item.sku,
              upc: item.upc,
              retailPrice: item.retailPrice,
              onHand: item.onHand,
              planograms: item.planograms,
              backStockSlots: item.backStockSlots,
            },
          });

          return item;
        });

        input.missingItemSkus.forEach((itemSku: string) => {
          store.set({
            typeName: 'Query',
            key: 'ROOT',
            fieldName: 'itemBySku',
            fieldArgs: {
              sku: itemSku,
              storeNumber: input.storeNumber,
            },
            value: null,
          });
        });

        return { items, missingItemSkus: input.missingItemSkus };
      },

      testClearData() {
        store.reset();
        return true;
      },
    },
  }),
});

function toDateISOString(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
