/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query manualItemLookup($sku: String!) {\n    itemBySku(sku: $sku, storeNumber: \"0363\") {\n      mfrPartNum\n      sku\n      retailPrice\n      onHand\n      planograms {\n        planogramId\n        seqNum\n      }\n      backStockSlots {\n        slotId\n        qty\n      }\n    },\n  }\n": types.ManualItemLookupDocument,
    "\n  query automaticItemLookup($upc: String!) {\n    itemByUpc(upc: $upc, storeNumber: \"0363\") {\n      mfrPartNum\n      sku\n      retailPrice\n      onHand\n      planograms {\n        planogramId\n        seqNum\n      }\n      backStockSlots {\n        slotId\n        qty\n      }\n    },\n  }\n": types.AutomaticItemLookupDocument,
    "\n  fragment CycleCountCardFragment on CycleCount {\n    cycleCountId\n    cycleCountName\n    dueDate\n  }\n": types.CycleCountCardFragmentFragmentDoc,
    "\n  query cycleCountApp {\n    cycleCounts(storeNumber: \"0363\") {\n      storeNumber\n      cycleCountType\n\n      ...CycleCountCardFragment\n\n      items {\n        sku\n        mfrPartNum\n        partDesc\n        retailPrice\n      }\n    }\n  }\n": types.CycleCountAppDocument,
    "\n  query truckScanApp {\n    truckScansByStore(storeNumber: \"0363\") {\n      asnReferenceNumber\n      status\n      storeNumber\n    }\n  }\n": types.TruckScanAppDocument,
    "\n  query truckScanDetails($asn: String!) {\n    truckScanByASN(asnReferenceNumber: $asn) {\n      asnReferenceNumber\n      status\n      storeNumber\n      items { sku upc mfrPartNum partDesc expectedCount actualCount }\n    }\n  }\n": types.TruckScanDetailsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query manualItemLookup($sku: String!) {\n    itemBySku(sku: $sku, storeNumber: \"0363\") {\n      mfrPartNum\n      sku\n      retailPrice\n      onHand\n      planograms {\n        planogramId\n        seqNum\n      }\n      backStockSlots {\n        slotId\n        qty\n      }\n    },\n  }\n"): (typeof documents)["\n  query manualItemLookup($sku: String!) {\n    itemBySku(sku: $sku, storeNumber: \"0363\") {\n      mfrPartNum\n      sku\n      retailPrice\n      onHand\n      planograms {\n        planogramId\n        seqNum\n      }\n      backStockSlots {\n        slotId\n        qty\n      }\n    },\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query automaticItemLookup($upc: String!) {\n    itemByUpc(upc: $upc, storeNumber: \"0363\") {\n      mfrPartNum\n      sku\n      retailPrice\n      onHand\n      planograms {\n        planogramId\n        seqNum\n      }\n      backStockSlots {\n        slotId\n        qty\n      }\n    },\n  }\n"): (typeof documents)["\n  query automaticItemLookup($upc: String!) {\n    itemByUpc(upc: $upc, storeNumber: \"0363\") {\n      mfrPartNum\n      sku\n      retailPrice\n      onHand\n      planograms {\n        planogramId\n        seqNum\n      }\n      backStockSlots {\n        slotId\n        qty\n      }\n    },\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment CycleCountCardFragment on CycleCount {\n    cycleCountId\n    cycleCountName\n    dueDate\n  }\n"): (typeof documents)["\n  fragment CycleCountCardFragment on CycleCount {\n    cycleCountId\n    cycleCountName\n    dueDate\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query cycleCountApp {\n    cycleCounts(storeNumber: \"0363\") {\n      storeNumber\n      cycleCountType\n\n      ...CycleCountCardFragment\n\n      items {\n        sku\n        mfrPartNum\n        partDesc\n        retailPrice\n      }\n    }\n  }\n"): (typeof documents)["\n  query cycleCountApp {\n    cycleCounts(storeNumber: \"0363\") {\n      storeNumber\n      cycleCountType\n\n      ...CycleCountCardFragment\n\n      items {\n        sku\n        mfrPartNum\n        partDesc\n        retailPrice\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query truckScanApp {\n    truckScansByStore(storeNumber: \"0363\") {\n      asnReferenceNumber\n      status\n      storeNumber\n    }\n  }\n"): (typeof documents)["\n  query truckScanApp {\n    truckScansByStore(storeNumber: \"0363\") {\n      asnReferenceNumber\n      status\n      storeNumber\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query truckScanDetails($asn: String!) {\n    truckScanByASN(asnReferenceNumber: $asn) {\n      asnReferenceNumber\n      status\n      storeNumber\n      items { sku upc mfrPartNum partDesc expectedCount actualCount }\n    }\n  }\n"): (typeof documents)["\n  query truckScanDetails($asn: String!) {\n    truckScanByASN(asnReferenceNumber: $asn) {\n      asnReferenceNumber\n      status\n      storeNumber\n      items { sku upc mfrPartNum partDesc expectedCount actualCount }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;