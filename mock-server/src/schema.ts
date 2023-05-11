import { faker } from '@faker-js/faker';
import {
  IMocks,
  MockList,
  addMocksToSchema,
  createMockStore,
} from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFile } from 'fs/promises';

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
  partDesc: () => faker.commerce.productDescription(),
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
    Item: { keyFieldName: 'id' },
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
  resolvers: store => ({
    Query: {
      itemBySku(_, { sku, storeNumber }) {
        return store.get('Item', `${storeNumber}-${sku}`);
      },
    },

    Mutation: {
      // TODO: testClear, store.reset()

      // TODO: single mutation or not?
      //
      // testSetData(_, { testData, storeNumber }) {
      //   const id = `${storeNumber}-${item.sku}`;
      //
      //   testData.for
      //   store.set('Item', id, item);
      //
      //   return store.get('Item', id);
      // },

      testSetItem(_, { item, storeNumber }) {
        const id = `${storeNumber}-${item.sku}`;

        store.set('Item', id, item);

        return store.get('Item', id);
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
