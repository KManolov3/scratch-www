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
    "\n  fragment ItemInfoFields on Item {\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n    partDesc\n    backStockSlots {\n      qty\n    }\n  }\n": types.ItemInfoFieldsFragmentDoc,
    "\n  query BatchCountItemBySkuLookup($sku: String!, $storeNumber: String!) {\n    itemBySku(sku: $sku, storeNumber: $storeNumber) {\n      ...ItemInfoFields\n      ...PlanogramFields\n      ...BackstockSlotFields\n    },\n  }\n": types.BatchCountItemBySkuLookupDocument,
    "\n  query BatchCountItemByUpcLookup($upc: String!, $storeNumber: String!) {\n    itemByUpc(upc: $upc, storeNumber: $storeNumber) {\n      ...ItemInfoFields\n      ...PlanogramFields\n      ...BackstockSlotFields\n    },\n  }\n": types.BatchCountItemByUpcLookupDocument,
    "\n  mutation SubmitBatchCount($request: CycleCountList!) {\n    sendCycleCountList(request: $request)\n  }\n": types.SubmitBatchCountDocument,
    "\n  fragment CycleCountCardFragment on CycleCount {\n    cycleCountId\n    cycleCountName\n    dueDate\n  }\n": types.CycleCountCardFragmentFragmentDoc,
    "\n  query CycleCountContext($storeNumber: String!) {\n    cycleCounts(storeNumber: $storeNumber) {\n      storeNumber\n      cycleCountType\n\n      ...CycleCountCardFragment\n\n      items {\n        sku\n        mfrPartNum\n        partDesc\n        retailPrice\n\n        planograms {\n          seqNum\n          planogramId\n          description\n        }\n      }\n    }\n  }\n": types.CycleCountContextDocument,
    "\n  mutation PrintFrontTag(\n    $storeNumber: String!\n    $printer: String! = \"1\"\n    $data: [FrontTagItem]\n  ) {\n    frontTagRequest(storeNumber: $storeNumber, printer: $printer, data: $data)\n  }\n": types.PrintFrontTagDocument,
    "\nquery ManualItemLookup($sku: String!, $storeNumber: String!) {\n  itemBySku(sku: $sku, storeNumber: $storeNumber) {\n    ...ItemInfoHeaderFields\n    ...PlanogramFields\n    ...BackstockSlotFields\n  },\n}\n": types.ManualItemLookupDocument,
    "\nquery AutomaticItemLookup($upc: String!, $storeNumber: String!) {\n  itemByUpc(upc: $upc, storeNumber: $storeNumber) {\n    ...ItemInfoHeaderFields\n    ...PlanogramFields\n    ...BackstockSlotFields\n  },\n}\n": types.AutomaticItemLookupDocument,
    "\n  fragment OutageItemInfoFields on Item {\n    partDesc\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n    backStockSlots {\n      slotName\n    }\n  }\n": types.OutageItemInfoFieldsFragmentDoc,
    "\n  mutation SubmitOutageCount($request: CycleCountList!) {\n    sendCycleCountList(request: $request)\n  }\n": types.SubmitOutageCountDocument,
    "\n  query ItemLookupBySku($sku: String!, $storeNumber: String!) {\n    itemBySku(sku: $sku, storeNumber: $storeNumber) {\n      ...OutageItemInfoFields\n      ...BackstockSlotFields\n    },\n  }\n": types.ItemLookupBySkuDocument,
    "\n  query truckScanApp($storeNumber: String!) {\n    truckScansByStore(storeNumber: $storeNumber) {\n      asnReferenceNumber\n      status\n      storeNumber\n    }\n  }\n": types.TruckScanAppDocument,
    "\n  query truckScanDetails($asn: String!) {\n    truckScanByASN(asnReferenceNumber: $asn) {\n      asnReferenceNumber\n      status\n      storeNumber\n      items { sku upc mfrPartNum partDesc expectedCount actualCount }\n    }\n  }\n": types.TruckScanDetailsDocument,
    "\n  fragment ItemInfoHeaderFields on Item {\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n    partDesc\n    backStockSlots {\n      qty\n    }\n  }\n": types.ItemInfoHeaderFieldsFragmentDoc,
    "\n  fragment BackstockSlotFields on Item {\n    backStockSlots {\n      qty\n      slotName\n    }\n  }\n": types.BackstockSlotFieldsFragmentDoc,
    "\n  fragment PlanogramFields on Item {\n    planograms {\n      planogramId\n      seqNum\n      description\n    }\n  }\n": types.PlanogramFieldsFragmentDoc,
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
export function gql(source: "\n  fragment ItemInfoFields on Item {\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n    partDesc\n    backStockSlots {\n      qty\n    }\n  }\n"): (typeof documents)["\n  fragment ItemInfoFields on Item {\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n    partDesc\n    backStockSlots {\n      qty\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query BatchCountItemBySkuLookup($sku: String!, $storeNumber: String!) {\n    itemBySku(sku: $sku, storeNumber: $storeNumber) {\n      ...ItemInfoFields\n      ...PlanogramFields\n      ...BackstockSlotFields\n    },\n  }\n"): (typeof documents)["\n  query BatchCountItemBySkuLookup($sku: String!, $storeNumber: String!) {\n    itemBySku(sku: $sku, storeNumber: $storeNumber) {\n      ...ItemInfoFields\n      ...PlanogramFields\n      ...BackstockSlotFields\n    },\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query BatchCountItemByUpcLookup($upc: String!, $storeNumber: String!) {\n    itemByUpc(upc: $upc, storeNumber: $storeNumber) {\n      ...ItemInfoFields\n      ...PlanogramFields\n      ...BackstockSlotFields\n    },\n  }\n"): (typeof documents)["\n  query BatchCountItemByUpcLookup($upc: String!, $storeNumber: String!) {\n    itemByUpc(upc: $upc, storeNumber: $storeNumber) {\n      ...ItemInfoFields\n      ...PlanogramFields\n      ...BackstockSlotFields\n    },\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SubmitBatchCount($request: CycleCountList!) {\n    sendCycleCountList(request: $request)\n  }\n"): (typeof documents)["\n  mutation SubmitBatchCount($request: CycleCountList!) {\n    sendCycleCountList(request: $request)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment CycleCountCardFragment on CycleCount {\n    cycleCountId\n    cycleCountName\n    dueDate\n  }\n"): (typeof documents)["\n  fragment CycleCountCardFragment on CycleCount {\n    cycleCountId\n    cycleCountName\n    dueDate\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query CycleCountContext($storeNumber: String!) {\n    cycleCounts(storeNumber: $storeNumber) {\n      storeNumber\n      cycleCountType\n\n      ...CycleCountCardFragment\n\n      items {\n        sku\n        mfrPartNum\n        partDesc\n        retailPrice\n\n        planograms {\n          seqNum\n          planogramId\n          description\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CycleCountContext($storeNumber: String!) {\n    cycleCounts(storeNumber: $storeNumber) {\n      storeNumber\n      cycleCountType\n\n      ...CycleCountCardFragment\n\n      items {\n        sku\n        mfrPartNum\n        partDesc\n        retailPrice\n\n        planograms {\n          seqNum\n          planogramId\n          description\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation PrintFrontTag(\n    $storeNumber: String!\n    $printer: String! = \"1\"\n    $data: [FrontTagItem]\n  ) {\n    frontTagRequest(storeNumber: $storeNumber, printer: $printer, data: $data)\n  }\n"): (typeof documents)["\n  mutation PrintFrontTag(\n    $storeNumber: String!\n    $printer: String! = \"1\"\n    $data: [FrontTagItem]\n  ) {\n    frontTagRequest(storeNumber: $storeNumber, printer: $printer, data: $data)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery ManualItemLookup($sku: String!, $storeNumber: String!) {\n  itemBySku(sku: $sku, storeNumber: $storeNumber) {\n    ...ItemInfoHeaderFields\n    ...PlanogramFields\n    ...BackstockSlotFields\n  },\n}\n"): (typeof documents)["\nquery ManualItemLookup($sku: String!, $storeNumber: String!) {\n  itemBySku(sku: $sku, storeNumber: $storeNumber) {\n    ...ItemInfoHeaderFields\n    ...PlanogramFields\n    ...BackstockSlotFields\n  },\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery AutomaticItemLookup($upc: String!, $storeNumber: String!) {\n  itemByUpc(upc: $upc, storeNumber: $storeNumber) {\n    ...ItemInfoHeaderFields\n    ...PlanogramFields\n    ...BackstockSlotFields\n  },\n}\n"): (typeof documents)["\nquery AutomaticItemLookup($upc: String!, $storeNumber: String!) {\n  itemByUpc(upc: $upc, storeNumber: $storeNumber) {\n    ...ItemInfoHeaderFields\n    ...PlanogramFields\n    ...BackstockSlotFields\n  },\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment OutageItemInfoFields on Item {\n    partDesc\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n    backStockSlots {\n      slotName\n    }\n  }\n"): (typeof documents)["\n  fragment OutageItemInfoFields on Item {\n    partDesc\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n    backStockSlots {\n      slotName\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SubmitOutageCount($request: CycleCountList!) {\n    sendCycleCountList(request: $request)\n  }\n"): (typeof documents)["\n  mutation SubmitOutageCount($request: CycleCountList!) {\n    sendCycleCountList(request: $request)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ItemLookupBySku($sku: String!, $storeNumber: String!) {\n    itemBySku(sku: $sku, storeNumber: $storeNumber) {\n      ...OutageItemInfoFields\n      ...BackstockSlotFields\n    },\n  }\n"): (typeof documents)["\n  query ItemLookupBySku($sku: String!, $storeNumber: String!) {\n    itemBySku(sku: $sku, storeNumber: $storeNumber) {\n      ...OutageItemInfoFields\n      ...BackstockSlotFields\n    },\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query truckScanApp($storeNumber: String!) {\n    truckScansByStore(storeNumber: $storeNumber) {\n      asnReferenceNumber\n      status\n      storeNumber\n    }\n  }\n"): (typeof documents)["\n  query truckScanApp($storeNumber: String!) {\n    truckScansByStore(storeNumber: $storeNumber) {\n      asnReferenceNumber\n      status\n      storeNumber\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query truckScanDetails($asn: String!) {\n    truckScanByASN(asnReferenceNumber: $asn) {\n      asnReferenceNumber\n      status\n      storeNumber\n      items { sku upc mfrPartNum partDesc expectedCount actualCount }\n    }\n  }\n"): (typeof documents)["\n  query truckScanDetails($asn: String!) {\n    truckScanByASN(asnReferenceNumber: $asn) {\n      asnReferenceNumber\n      status\n      storeNumber\n      items { sku upc mfrPartNum partDesc expectedCount actualCount }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ItemInfoHeaderFields on Item {\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n    partDesc\n    backStockSlots {\n      qty\n    }\n  }\n"): (typeof documents)["\n  fragment ItemInfoHeaderFields on Item {\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n    partDesc\n    backStockSlots {\n      qty\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment BackstockSlotFields on Item {\n    backStockSlots {\n      qty\n      slotName\n    }\n  }\n"): (typeof documents)["\n  fragment BackstockSlotFields on Item {\n    backStockSlots {\n      qty\n      slotName\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment PlanogramFields on Item {\n    planograms {\n      planogramId\n      seqNum\n      description\n    }\n  }\n"): (typeof documents)["\n  fragment PlanogramFields on Item {\n    planograms {\n      planogramId\n      seqNum\n      description\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;