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
    "\n  query ManualItemLookup($sku: String!) {\n    itemBySku(sku: $sku, storeNumber: \"0363\") {\n      ...ItemInfoHeaderFields\n      ...PlanogramFields\n      ...BackstockSlotFields\n    },\n  }\n": types.ManualItemLookupDocument,
    "\n  query AutomaticItemLookup($upc: String!) {\n    itemByUpc(upc: $upc, storeNumber: \"0363\") {\n      ...ItemInfoHeaderFields\n      ...PlanogramFields\n      ...BackstockSlotFields\n    },\n  }\n": types.AutomaticItemLookupDocument,
    "\n  mutation SubmitBatchCount($request: CycleCountList!) {\n    sendCycleCountList(request: $request)\n  }\n": types.SubmitBatchCountDocument,
    "\n  fragment CycleCountCardFragment on CycleCount {\n    cycleCountId\n    cycleCountName\n    dueDate\n  }\n": types.CycleCountCardFragmentFragmentDoc,
    "\n  query CycleCountContext {\n    cycleCounts(storeNumber: \"0363\") {\n      storeNumber\n      cycleCountType\n\n      ...CycleCountCardFragment\n\n      items {\n        sku\n        mfrPartNum\n        partDesc\n        retailPrice\n\n        planograms {\n          seqNum\n          planogramId\n          description\n        }\n      }\n    }\n  }\n": types.CycleCountContextDocument,
    "\n  query ItemLookupBySku($sku: String!) {\n    itemBySku(sku: $sku, storeNumber: \"0363\") {\n      ...ItemInfoHeaderFields\n    },\n  }\n": types.ItemLookupBySkuDocument,
    "\n  fragment OutageItemCard on Item {\n    partDesc\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n  }\n": types.OutageItemCardFragmentDoc,
    "\n  mutation SubmitOutageCount($request: CycleCountList!) {\n    sendCycleCountList(request: $request)\n  }\n": types.SubmitOutageCountDocument,
    "\n  query truckScanApp {\n    truckScansByStore(storeNumber: \"0363\") {\n      asnReferenceNumber\n      status\n      storeNumber\n    }\n  }\n": types.TruckScanAppDocument,
    "\n  query truckScanDetails($asn: String!) {\n    truckScanByASN(asnReferenceNumber: $asn) {\n      asnReferenceNumber\n      status\n      storeNumber\n      items { sku upc mfrPartNum partDesc expectedCount actualCount }\n    }\n  }\n": types.TruckScanDetailsDocument,
    "\n  fragment ItemInfoHeaderFields on Item {\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n    partDesc\n    backStockSlots {\n      qty\n    }\n  }\n": types.ItemInfoHeaderFieldsFragmentDoc,
    "\n  fragment BackstockSlotFields on Item {\n    backStockSlots {\n      slotId\n      qty\n    }\n  }\n": types.BackstockSlotFieldsFragmentDoc,
    "\n  fragment PlanogramFields on Item {\n    planograms {\n      planogramId\n      seqNum\n    }\n  }\n": types.PlanogramFieldsFragmentDoc,
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
export function gql(source: "\n  query ManualItemLookup($sku: String!) {\n    itemBySku(sku: $sku, storeNumber: \"0363\") {\n      ...ItemInfoHeaderFields\n      ...PlanogramFields\n      ...BackstockSlotFields\n    },\n  }\n"): (typeof documents)["\n  query ManualItemLookup($sku: String!) {\n    itemBySku(sku: $sku, storeNumber: \"0363\") {\n      ...ItemInfoHeaderFields\n      ...PlanogramFields\n      ...BackstockSlotFields\n    },\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query AutomaticItemLookup($upc: String!) {\n    itemByUpc(upc: $upc, storeNumber: \"0363\") {\n      ...ItemInfoHeaderFields\n      ...PlanogramFields\n      ...BackstockSlotFields\n    },\n  }\n"): (typeof documents)["\n  query AutomaticItemLookup($upc: String!) {\n    itemByUpc(upc: $upc, storeNumber: \"0363\") {\n      ...ItemInfoHeaderFields\n      ...PlanogramFields\n      ...BackstockSlotFields\n    },\n  }\n"];
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
export function gql(source: "\n  query CycleCountContext {\n    cycleCounts(storeNumber: \"0363\") {\n      storeNumber\n      cycleCountType\n\n      ...CycleCountCardFragment\n\n      items {\n        sku\n        mfrPartNum\n        partDesc\n        retailPrice\n\n        planograms {\n          seqNum\n          planogramId\n          description\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CycleCountContext {\n    cycleCounts(storeNumber: \"0363\") {\n      storeNumber\n      cycleCountType\n\n      ...CycleCountCardFragment\n\n      items {\n        sku\n        mfrPartNum\n        partDesc\n        retailPrice\n\n        planograms {\n          seqNum\n          planogramId\n          description\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ItemLookupBySku($sku: String!) {\n    itemBySku(sku: $sku, storeNumber: \"0363\") {\n      ...ItemInfoHeaderFields\n    },\n  }\n"): (typeof documents)["\n  query ItemLookupBySku($sku: String!) {\n    itemBySku(sku: $sku, storeNumber: \"0363\") {\n      ...ItemInfoHeaderFields\n    },\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment OutageItemCard on Item {\n    partDesc\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n  }\n"): (typeof documents)["\n  fragment OutageItemCard on Item {\n    partDesc\n    mfrPartNum\n    sku\n    retailPrice\n    onHand\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SubmitOutageCount($request: CycleCountList!) {\n    sendCycleCountList(request: $request)\n  }\n"): (typeof documents)["\n  mutation SubmitOutageCount($request: CycleCountList!) {\n    sendCycleCountList(request: $request)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query truckScanApp {\n    truckScansByStore(storeNumber: \"0363\") {\n      asnReferenceNumber\n      status\n      storeNumber\n    }\n  }\n"): (typeof documents)["\n  query truckScanApp {\n    truckScansByStore(storeNumber: \"0363\") {\n      asnReferenceNumber\n      status\n      storeNumber\n    }\n  }\n"];
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
export function gql(source: "\n  fragment BackstockSlotFields on Item {\n    backStockSlots {\n      slotId\n      qty\n    }\n  }\n"): (typeof documents)["\n  fragment BackstockSlotFields on Item {\n    backStockSlots {\n      slotId\n      qty\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment PlanogramFields on Item {\n    planograms {\n      planogramId\n      seqNum\n    }\n  }\n"): (typeof documents)["\n  fragment PlanogramFields on Item {\n    planograms {\n      planogramId\n      seqNum\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;