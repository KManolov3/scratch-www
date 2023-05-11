/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: string;
  _FieldSet: unknown;
};

export enum Action {
  Create = 'CREATE',
  Delete = 'DELETE',
  Read = 'READ',
  Refresh = 'REFRESH',
  Update = 'UPDATE'
}

export type BackStockSlot = {
  __typename?: 'BackStockSlot';
  guid?: Maybe<Scalars['String']>;
  lastModified?: Maybe<Scalars['Date']>;
  qty?: Maybe<Scalars['Int']>;
  sectionsLotName?: Maybe<Scalars['String']>;
  sectionsLotNum?: Maybe<Scalars['String']>;
  slotDescription?: Maybe<Scalars['String']>;
  slotId?: Maybe<Scalars['Int']>;
  slotName?: Maybe<Scalars['String']>;
  storeNumber?: Maybe<Scalars['String']>;
};

export type ContainerData = {
  containerId?: InputMaybe<Scalars['String']>;
};

export type CreateCycleCount = {
  createdDate: Scalars['String'];
  cycleCountType: CycleCountType;
  dueDate: Scalars['String'];
  status: Status;
  storeNumber: Scalars['String'];
};

export type CreateCycleCountRequest = {
  cycleCount: CreateCycleCount;
  items: Array<CreateItemRequest>;
};

export type CreateItemRequest = {
  qty: Scalars['Int'];
  sku: Scalars['String'];
};

export type CycleCount = {
  __typename?: 'CycleCount';
  createdDate?: Maybe<Scalars['Date']>;
  cycleCountId?: Maybe<Scalars['Int']>;
  cycleCountName?: Maybe<Scalars['String']>;
  cycleCountType?: Maybe<CycleCountType>;
  dueDate?: Maybe<Scalars['Date']>;
  groupId?: Maybe<Scalars['String']>;
  groupName?: Maybe<Scalars['String']>;
  guid?: Maybe<Scalars['String']>;
  items?: Maybe<Array<Maybe<Item>>>;
  skus?: Maybe<Array<Maybe<Scalars['String']>>>;
  status?: Maybe<Status>;
  storeNumber?: Maybe<Scalars['String']>;
};

export type CycleCountDetail = {
  action?: InputMaybe<Action>;
  countQty?: InputMaybe<Scalars['String']>;
  deptDesc?: InputMaybe<Scalars['String']>;
  freezeQty?: InputMaybe<Scalars['String']>;
  invPrice?: InputMaybe<Scalars['String']>;
  manPartNo?: InputMaybe<Scalars['String']>;
  multiLocation?: InputMaybe<Scalars['String']>;
  onhandAtCountQty: Scalars['String'];
  planograms?: InputMaybe<Array<InputMaybe<KafkaPlanogram>>>;
  regisCount?: InputMaybe<Scalars['Int']>;
  seqNum?: InputMaybe<Scalars['Int']>;
  sku: Scalars['String'];
  subDept?: InputMaybe<Scalars['String']>;
  systemOnHandQty?: InputMaybe<Scalars['String']>;
  variance?: InputMaybe<Scalars['String']>;
  varianceIsNegative?: InputMaybe<Scalars['Int']>;
  vendor?: InputMaybe<Scalars['String']>;
};

export type CycleCountList = {
  count?: InputMaybe<Scalars['Int']>;
  cycleCounts: Array<KafkaCycleCount>;
  dataProducer?: InputMaybe<Scalars['String']>;
  nativeStoreId?: InputMaybe<Scalars['String']>;
  storeNumber: Scalars['String'];
  updateType?: InputMaybe<Scalars['String']>;
};

export enum CycleCountType {
  BatchCount = 'BATCH_COUNT',
  ConfirmCount = 'CONFIRM_COUNT',
  CoreCount = 'CORE_COUNT',
  NegativeQuantityOnHand = 'NEGATIVE_QUANTITY_ON_HAND',
  OrderQuantityChanged = 'ORDER_QUANTITY_CHANGED',
  Outage = 'OUTAGE',
  PendingAsn = 'PENDING_ASN',
  PhysicalInventoryVariance = 'PHYSICAL_INVENTORY_VARIANCE',
  RefundCount = 'REFUND_COUNT',
  SystemGenerated = 'SYSTEM_GENERATED',
  SystemRequest = 'SYSTEM_REQUEST',
  VerifyDueToSale = 'VERIFY_DUE_TO_SALE'
}

export enum ErrorDetail {
  DeadlineExceeded = 'DEADLINE_EXCEEDED',
  EnhanceYourCalm = 'ENHANCE_YOUR_CALM',
  FieldNotFound = 'FIELD_NOT_FOUND',
  InvalidArgument = 'INVALID_ARGUMENT',
  InvalidCursor = 'INVALID_CURSOR',
  MissingResource = 'MISSING_RESOURCE',
  ServiceError = 'SERVICE_ERROR',
  TcpFailure = 'TCP_FAILURE',
  ThrottledConcurrency = 'THROTTLED_CONCURRENCY',
  ThrottledCpu = 'THROTTLED_CPU',
  Unimplemented = 'UNIMPLEMENTED',
  Unknown = 'UNKNOWN'
}

export enum ErrorType {
  BadRequest = 'BAD_REQUEST',
  FailedPrecondition = 'FAILED_PRECONDITION',
  Internal = 'INTERNAL',
  NotFound = 'NOT_FOUND',
  PermissionDenied = 'PERMISSION_DENIED',
  Unauthenticated = 'UNAUTHENTICATED',
  Unavailable = 'UNAVAILABLE',
  Unknown = 'UNKNOWN'
}

export type FrontTagItem = {
  count?: InputMaybe<Scalars['Int']>;
  planogramId?: InputMaybe<Scalars['String']>;
  sequence?: InputMaybe<Scalars['Int']>;
  sku?: InputMaybe<Scalars['String']>;
};

export type Item = {
  __typename?: 'Item';
  backStockSlots?: Maybe<Array<Maybe<BackStockSlot>>>;
  mfrPartNum?: Maybe<Scalars['String']>;
  onHand?: Maybe<Scalars['Int']>;
  partDesc?: Maybe<Scalars['String']>;
  planograms?: Maybe<Array<Maybe<Planogram>>>;
  retailPrice?: Maybe<Scalars['Float']>;
  sku?: Maybe<Scalars['String']>;
  upc?: Maybe<Scalars['String']>;
};

export type KafkaCycleCount = {
  action: Action;
  count?: InputMaybe<Scalars['Int']>;
  createDate: Scalars['String'];
  createId?: InputMaybe<Scalars['Int']>;
  cycleCountName?: InputMaybe<Scalars['String']>;
  cycleCountType?: InputMaybe<CycleCountType>;
  dueDate: Scalars['String'];
  groupId?: InputMaybe<Scalars['String']>;
  groupName?: InputMaybe<Scalars['String']>;
  hostId?: InputMaybe<Scalars['String']>;
  items: Array<CycleCountDetail>;
  lastDateTime?: InputMaybe<Scalars['String']>;
  lastId?: InputMaybe<Scalars['Int']>;
  lastUpdatedBy?: InputMaybe<Scalars['String']>;
  posSystem?: InputMaybe<Scalars['String']>;
  referenceId?: InputMaybe<Scalars['String']>;
  status: Status;
  systemFlag?: InputMaybe<Scalars['Boolean']>;
  teamMember?: InputMaybe<Scalars['String']>;
};

export type KafkaPlanogram = {
  description: Scalars['String'];
  planogramId: Scalars['String'];
  seqNum: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  containerTagRequest?: Maybe<PrintRequestStatus>;
  createTruckScan?: Maybe<TruckScan>;
  frontTagRequest?: Maybe<PrintRequestStatus>;
  sendCycleCountList?: Maybe<Scalars['Boolean']>;
};


export type MutationContainerTagRequestArgs = {
  data?: InputMaybe<Array<InputMaybe<ContainerData>>>;
  printer?: Scalars['String'];
  storeNumber: Scalars['String'];
};


export type MutationCreateTruckScanArgs = {
  truckScan: TruckScanInput;
};


export type MutationFrontTagRequestArgs = {
  data?: InputMaybe<Array<InputMaybe<FrontTagItem>>>;
  printer?: Scalars['String'];
  storeNumber: Scalars['String'];
};


export type MutationSendCycleCountListArgs = {
  request: CycleCountList;
};

export type Planogram = {
  __typename?: 'Planogram';
  description?: Maybe<Scalars['String']>;
  planogramId?: Maybe<Scalars['String']>;
  seqNum?: Maybe<Scalars['Int']>;
};

export type Pog = {
  __typename?: 'Pog';
  lastModifiedDate?: Maybe<Scalars['String']>;
  pogDescription?: Maybe<Scalars['String']>;
  pogId?: Maybe<Scalars['String']>;
  sequence?: Maybe<Scalars['String']>;
  skuNumber?: Maybe<Scalars['String']>;
  storeNumber?: Maybe<Scalars['String']>;
};

export enum PrintRequestStatus {
  Accepted = 'ACCEPTED',
  Error = 'ERROR'
}

export type Query = {
  __typename?: 'Query';
  _service?: Maybe<_Service>;
  batchCounts?: Maybe<Array<Maybe<CycleCount>>>;
  cycleCounts?: Maybe<Array<Maybe<CycleCount>>>;
  itemBySku?: Maybe<Item>;
  itemByUpc?: Maybe<Item>;
  itemsBySkuList?: Maybe<Array<Maybe<Item>>>;
  outageCounts?: Maybe<Array<Maybe<CycleCount>>>;
  planograms?: Maybe<Array<Maybe<Pog>>>;
  removeTruckScanItem?: Maybe<TruckScanItem>;
  truckScanByASN?: Maybe<TruckScan>;
  truckScansByStatus?: Maybe<Array<Maybe<TruckScan>>>;
  truckScansByStore?: Maybe<Array<Maybe<TruckScan>>>;
};


export type QueryBatchCountsArgs = {
  storeNumber: Scalars['String'];
};


export type QueryCycleCountsArgs = {
  completed?: InputMaybe<Scalars['Boolean']>;
  storeNumber: Scalars['String'];
};


export type QueryItemBySkuArgs = {
  sku: Scalars['String'];
  storeNumber: Scalars['String'];
};


export type QueryItemByUpcArgs = {
  storeNumber: Scalars['String'];
  upc: Scalars['String'];
};


export type QueryItemsBySkuListArgs = {
  skus: Array<Scalars['String']>;
  storeNumber: Scalars['String'];
};


export type QueryOutageCountsArgs = {
  storeNumber: Scalars['String'];
};


export type QueryPlanogramsArgs = {
  skuNumber: Scalars['String'];
  storeNumber: Scalars['String'];
};


export type QueryRemoveTruckScanItemArgs = {
  asnReferenceNumber: Scalars['String'];
  sku: Scalars['String'];
  storeNumber: Scalars['String'];
};


export type QueryTruckScanByAsnArgs = {
  asnReferenceNumber: Scalars['String'];
};


export type QueryTruckScansByStatusArgs = {
  status?: InputMaybe<TruckScanStatus>;
  storeNumber: Scalars['String'];
};


export type QueryTruckScansByStoreArgs = {
  status?: InputMaybe<TruckScanStatus>;
  storeNumber: Scalars['String'];
};

export enum Status {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  NotStarted = 'NOT_STARTED',
  Pending = 'PENDING',
  Verify = 'VERIFY'
}

export type TruckScan = {
  __typename?: 'TruckScan';
  asnReferenceNumber?: Maybe<Scalars['String']>;
  items?: Maybe<Array<Maybe<TruckScanItem>>>;
  status?: Maybe<TruckScanStatus>;
  storeNumber?: Maybe<Scalars['String']>;
};

export type TruckScanInput = {
  asnReferenceNumber?: InputMaybe<Scalars['String']>;
  items?: InputMaybe<Array<InputMaybe<TruckScanItemInput>>>;
  status?: InputMaybe<TruckScanStatus>;
  storeNumber?: InputMaybe<Scalars['String']>;
};

export type TruckScanItem = {
  __typename?: 'TruckScanItem';
  actualCount?: Maybe<Scalars['Int']>;
  expectedCount?: Maybe<Scalars['Int']>;
  mfrPartNum?: Maybe<Scalars['String']>;
  partDesc?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
  upc?: Maybe<Scalars['String']>;
};

export type TruckScanItemInput = {
  actualCount?: InputMaybe<Scalars['Int']>;
  expectedCount?: InputMaybe<Scalars['Int']>;
  sku?: InputMaybe<Scalars['String']>;
  upc?: InputMaybe<Scalars['String']>;
};

export enum TruckScanStatus {
  Closed = 'CLOSED',
  Open = 'OPEN'
}

export type UpdateCycleCountRequest = {
  cycleCountName: Scalars['String'];
  items?: InputMaybe<Array<InputMaybe<UpdateItemRequest>>>;
  status: Status;
  storeNumber: Scalars['String'];
};

export type UpdateItemRequest = {
  sku: Scalars['String'];
  totalCountQty: Scalars['Int'];
};

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String'];
};

export type ManualItemLookupQueryVariables = Exact<{
  sku: Scalars['String'];
}>;


export type ManualItemLookupQuery = { __typename?: 'Query', itemBySku?: { __typename?: 'Item', mfrPartNum?: string | null, sku?: string | null, retailPrice?: number | null, onHand?: number | null, partDesc?: string | null, backStockSlots?: Array<{ __typename?: 'BackStockSlot', qty?: number | null, slotId?: number | null } | null> | null, planograms?: Array<{ __typename?: 'Planogram', planogramId?: string | null, seqNum?: number | null } | null> | null } | null };

export type AutomaticItemLookupQueryVariables = Exact<{
  upc: Scalars['String'];
}>;


export type AutomaticItemLookupQuery = { __typename?: 'Query', itemByUpc?: { __typename?: 'Item', mfrPartNum?: string | null, sku?: string | null, retailPrice?: number | null, onHand?: number | null, partDesc?: string | null, backStockSlots?: Array<{ __typename?: 'BackStockSlot', qty?: number | null, slotId?: number | null } | null> | null, planograms?: Array<{ __typename?: 'Planogram', planogramId?: string | null, seqNum?: number | null } | null> | null } | null };

export type CycleCountCardFragmentFragment = { __typename?: 'CycleCount', cycleCountId?: number | null, cycleCountName?: string | null, dueDate?: string | null };

export type CycleCountContextQueryVariables = Exact<{ [key: string]: never; }>;


export type CycleCountContextQuery = { __typename?: 'Query', cycleCounts?: Array<{ __typename?: 'CycleCount', storeNumber?: string | null, cycleCountType?: CycleCountType | null, cycleCountId?: number | null, cycleCountName?: string | null, dueDate?: string | null, items?: Array<{ __typename?: 'Item', sku?: string | null, mfrPartNum?: string | null, partDesc?: string | null, retailPrice?: number | null, planograms?: Array<{ __typename?: 'Planogram', seqNum?: number | null, planogramId?: string | null, description?: string | null } | null> | null } | null> | null } | null> | null };

export type TruckScanAppQueryVariables = Exact<{ [key: string]: never; }>;


export type TruckScanAppQuery = { __typename?: 'Query', truckScansByStore?: Array<{ __typename?: 'TruckScan', asnReferenceNumber?: string | null, status?: TruckScanStatus | null, storeNumber?: string | null } | null> | null };

export type TruckScanDetailsQueryVariables = Exact<{
  asn: Scalars['String'];
}>;


export type TruckScanDetailsQuery = { __typename?: 'Query', truckScanByASN?: { __typename?: 'TruckScan', asnReferenceNumber?: string | null, status?: TruckScanStatus | null, storeNumber?: string | null, items?: Array<{ __typename?: 'TruckScanItem', sku?: string | null, upc?: string | null, mfrPartNum?: string | null, partDesc?: string | null, expectedCount?: number | null, actualCount?: number | null } | null> | null } | null };

export type ItemInfoHeaderFieldsFragment = { __typename?: 'Item', mfrPartNum?: string | null, sku?: string | null, retailPrice?: number | null, onHand?: number | null, partDesc?: string | null, backStockSlots?: Array<{ __typename?: 'BackStockSlot', qty?: number | null } | null> | null };

export type BackstockSlotFieldsFragment = { __typename?: 'Item', backStockSlots?: Array<{ __typename?: 'BackStockSlot', slotId?: number | null, qty?: number | null } | null> | null };

export type PlanogramFieldsFragment = { __typename?: 'Item', planograms?: Array<{ __typename?: 'Planogram', planogramId?: string | null, seqNum?: number | null } | null> | null };

export const CycleCountCardFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CycleCountCardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CycleCount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cycleCountId"}},{"kind":"Field","name":{"kind":"Name","value":"cycleCountName"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}}]}}]} as unknown as DocumentNode<CycleCountCardFragmentFragment, unknown>;
export const ItemInfoHeaderFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemInfoHeaderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"onHand"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<ItemInfoHeaderFieldsFragment, unknown>;
export const BackstockSlotFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BackstockSlotFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slotId"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<BackstockSlotFieldsFragment, unknown>;
export const PlanogramFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlanogramFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planograms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planogramId"}},{"kind":"Field","name":{"kind":"Name","value":"seqNum"}}]}}]}}]} as unknown as DocumentNode<PlanogramFieldsFragment, unknown>;
export const ManualItemLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ManualItemLookup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sku"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemBySku"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sku"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sku"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"StringValue","value":"0363","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemInfoHeaderFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlanogramFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BackstockSlotFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemInfoHeaderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"onHand"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlanogramFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planograms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planogramId"}},{"kind":"Field","name":{"kind":"Name","value":"seqNum"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BackstockSlotFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slotId"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<ManualItemLookupQuery, ManualItemLookupQueryVariables>;
export const AutomaticItemLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AutomaticItemLookup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"upc"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemByUpc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"upc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"upc"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"StringValue","value":"0363","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemInfoHeaderFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlanogramFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BackstockSlotFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemInfoHeaderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"onHand"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlanogramFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planograms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planogramId"}},{"kind":"Field","name":{"kind":"Name","value":"seqNum"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BackstockSlotFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slotId"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<AutomaticItemLookupQuery, AutomaticItemLookupQueryVariables>;
export const CycleCountContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CycleCountContext"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cycleCounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"StringValue","value":"0363","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storeNumber"}},{"kind":"Field","name":{"kind":"Name","value":"cycleCountType"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CycleCountCardFragment"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"planograms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seqNum"}},{"kind":"Field","name":{"kind":"Name","value":"planogramId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CycleCountCardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CycleCount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cycleCountId"}},{"kind":"Field","name":{"kind":"Name","value":"cycleCountName"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}}]}}]} as unknown as DocumentNode<CycleCountContextQuery, CycleCountContextQueryVariables>;
export const TruckScanAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"truckScanApp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"truckScansByStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"StringValue","value":"0363","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asnReferenceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"storeNumber"}}]}}]}}]} as unknown as DocumentNode<TruckScanAppQuery, TruckScanAppQueryVariables>;
export const TruckScanDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"truckScanDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"asn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"truckScanByASN"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"asnReferenceNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"asn"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asnReferenceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"storeNumber"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"upc"}},{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"expectedCount"}},{"kind":"Field","name":{"kind":"Name","value":"actualCount"}}]}}]}}]}}]} as unknown as DocumentNode<TruckScanDetailsQuery, TruckScanDetailsQueryVariables>;