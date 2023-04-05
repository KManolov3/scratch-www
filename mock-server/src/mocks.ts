import { faker } from "@faker-js/faker"
import { IMocks, MockList } from "@graphql-tools/mock"

const storeNumberFaker = () => faker.random.numeric(4)
const skuFaker = () => faker.random.numeric(8)

const itemFakes = {
  sku: skuFaker,
  mfrPartNum: () => faker.random.alphaNumeric(5),
  partDesc: () => faker.commerce.productDescription(),
  upc: () => faker.random.numeric(10),
}

export const mocks: IMocks = {
  String: () => faker.random.words(),

  Item: {
    ...itemFakes,

    retailPrice: () => faker.datatype.float({ min: 10, max: 100, precision: 0.01 }),
    onHand: () => faker.datatype.number({ min: 0, max: 50 })
  },

  CycleCount: {
    storeNumber: storeNumberFaker,
    guid: () => faker.datatype.uuid(),
    skus: () => new MockList([1, 5], skuFaker)
  },

  TruckScan: {
    asnReferenceNumber: () => faker.random.alphaNumeric(10),
    storeNumber: () => faker.random.numeric(4)
  },

  TruckScanItem: {
    ...itemFakes
  },

  Pog: {
    storeNumber: storeNumberFaker,
    skuNumber: skuFaker,
    pogId: () => faker.random.numeric(5),
    pogDescription: () => faker.commerce.productDescription(),
    lastModifiedDate: () => faker.date.past()
  }
}
