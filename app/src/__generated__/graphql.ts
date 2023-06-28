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

export enum CreateCycleCountError {
  Other = 'OTHER'
}

export type CreateCycleCountInput = {
  items: Array<CreateCycleCountItemInput>;
  type: CreateCycleCountType;
};

export type CreateCycleCountItemInput = {
  itemSku: Scalars['String'];
  quantity?: InputMaybe<Scalars['Int']>;
};

export type CreateCycleCountRequest = {
  cycleCount: CreateCycleCount;
  items: Array<CreateItemRequest>;
};

export type CreateCycleCountResult = {
  __typename?: 'CreateCycleCountResult';
  cycleCount?: Maybe<NewCycleCount>;
  error?: Maybe<CreateCycleCountError>;
  errorMessage?: Maybe<Scalars['String']>;
};

export enum CreateCycleCountType {
  BatchCount = 'BATCH_COUNT',
  Outage = 'OUTAGE'
}

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

export type CycleCountItem = {
  __typename?: 'CycleCountItem';
  flagged: Scalars['Boolean'];
  item: Item;
  sku: Scalars['String'];
};

export type CycleCountItemQuantity = {
  __typename?: 'CycleCountItemQuantity';
  locationId?: Maybe<Scalars['String']>;
  quantityAtLocation?: Maybe<Scalars['Int']>;
  sku: Scalars['String'];
};

export type CycleCountList = {
  count?: InputMaybe<Scalars['Int']>;
  cycleCounts: Array<KafkaCycleCount>;
  dataProducer?: InputMaybe<Scalars['String']>;
  nativeStoreId?: InputMaybe<Scalars['String']>;
  storeNumber: Scalars['String'];
  updateType?: InputMaybe<Scalars['String']>;
};

export type CycleCountLocation = {
  __typename?: 'CycleCountLocation';
  backStockSlot?: Maybe<BackStockSlot>;
  id: Scalars['String'];
  planogram?: Maybe<Planogram>;
  status: CycleCountLocationStatus;
  type: LocationType;
};

export enum CycleCountLocationStatus {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export enum CycleCountReason {
  ConfirmCount = 'CONFIRM_COUNT',
  CoreCount = 'CORE_COUNT',
  NegativeQuantityOnHand = 'NEGATIVE_QUANTITY_ON_HAND',
  OrderQuantityChanged = 'ORDER_QUANTITY_CHANGED',
  PendingAsn = 'PENDING_ASN',
  PhysicalInventoryVariance = 'PHYSICAL_INVENTORY_VARIANCE',
  RefundCount = 'REFUND_COUNT',
  SystemGenerated = 'SYSTEM_GENERATED',
  SystemRequest = 'SYSTEM_REQUEST',
  VerifyDueToSale = 'VERIFY_DUE_TO_SALE'
}

export enum CycleCountSetItemsError {
  AlreadyCompleted = 'ALREADY_COMPLETED',
  CannotUpdateCycleCount = 'CANNOT_UPDATE_CYCLE_COUNT',
  DifferentOwner = 'DIFFERENT_OWNER',
  NotFound = 'NOT_FOUND',
  Other = 'OTHER'
}

export type CycleCountSetItemsInput = {
  items?: InputMaybe<Array<CycleCountUpdateItemInput>>;
};

export type CycleCountSetItemsResult = {
  __typename?: 'CycleCountSetItemsResult';
  cycleCount?: Maybe<NewCycleCount>;
  error?: Maybe<CycleCountSetItemsError>;
  errorMessage?: Maybe<Scalars['String']>;
};

export enum CycleCountStatus {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING',
  Verify = 'VERIFY'
}

export enum CycleCountType {
  BatchCount = 'BATCH_COUNT',
  ConfirmCount = 'CONFIRM_COUNT',
  CoreCount = 'CORE_COUNT',
  CycleCount = 'CYCLE_COUNT',
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

export type CycleCountUpdateInput = {
  items?: InputMaybe<Array<CycleCountUpdateItemInput>>;
  locations?: InputMaybe<Array<CycleCountUpdateLocationInput>>;
  quantities?: InputMaybe<Array<CycleCountUpdateItemQuantityInput>>;
};

export type CycleCountUpdateItemInput = {
  flagged: Scalars['Boolean'];
  sku: Scalars['String'];
};

export type CycleCountUpdateItemQuantityInput = {
  locationId?: InputMaybe<Scalars['String']>;
  quantityAtLocation: Scalars['Int'];
  sku: Scalars['String'];
};

export type CycleCountUpdateLocationInput = {
  locationId: Scalars['String'];
  status: CycleCountLocationStatus;
};

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

export enum LocationType {
  BackStockSlot = 'BACK_STOCK_SLOT',
  Planogram = 'PLANOGRAM'
}

export type Mutation = {
  __typename?: 'Mutation';
  completeTruckScan?: Maybe<TruckScan>;
  containerTagRequest?: Maybe<PrintRequestStatus>;
  createCycleCount: CreateCycleCountResult;
  createTruckScan?: Maybe<TruckScan>;
  frontTagRequest?: Maybe<PrintRequestStatus>;
  sendCycleCountList?: Maybe<Scalars['Boolean']>;
  setCycleCountItems: UpdateCycleCountResult;
  submitCycleCount: SubmitCycleCountResult;
  takeOverCycleCount: TakeOverCycleCountResult;
  testClearData?: Maybe<Scalars['Boolean']>;
  testSetData: TestSetDataResult;
  updateCycleCount: UpdateCycleCountResult;
  updateTruckScanItem?: Maybe<TruckScanItem>;
  verifyCycleCount: VerifyCycleCountResult;
};


export type MutationCompleteTruckScanArgs = {
  truckScan: TruckScanInput;
};


export type MutationContainerTagRequestArgs = {
  data?: InputMaybe<Array<InputMaybe<ContainerData>>>;
  printer?: Scalars['String'];
  storeNumber: Scalars['String'];
};


export type MutationCreateCycleCountArgs = {
  input: CreateCycleCountInput;
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


export type MutationSetCycleCountItemsArgs = {
  id: Scalars['String'];
  input: CycleCountSetItemsInput;
};


export type MutationSubmitCycleCountArgs = {
  id: Scalars['String'];
};


export type MutationTakeOverCycleCountArgs = {
  id: Scalars['String'];
};


export type MutationTestSetDataArgs = {
  input: TestDataInput;
};


export type MutationUpdateCycleCountArgs = {
  id: Scalars['String'];
  input: CycleCountUpdateInput;
};


export type MutationUpdateTruckScanItemArgs = {
  asnReferenceNumber: Scalars['String'];
  sku: Scalars['String'];
  storeNumber: Scalars['String'];
  updatedCount: Scalars['Int'];
};


export type MutationVerifyCycleCountArgs = {
  id: Scalars['String'];
};

export type NewCycleCount = {
  __typename?: 'NewCycleCount';
  createdDate: Scalars['Date'];
  dueDate?: Maybe<Scalars['Date']>;
  id: Scalars['String'];
  itemQuantities: Array<CycleCountItemQuantity>;
  items: Array<CycleCountItem>;
  locations?: Maybe<Array<CycleCountLocation>>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<TeamMember>;
  reason?: Maybe<CycleCountReason>;
  status: CycleCountStatus;
  storeNumber: Scalars['String'];
  type: CycleCountType;
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
  cycleCountById?: Maybe<NewCycleCount>;
  cycleCounts?: Maybe<Array<Maybe<CycleCount>>>;
  itemBySku?: Maybe<Item>;
  itemByUpc?: Maybe<Item>;
  itemsBySkuList?: Maybe<Array<Maybe<Item>>>;
  newCycleCounts: Array<NewCycleCount>;
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


export type QueryCycleCountByIdArgs = {
  id: Scalars['String'];
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


export type QueryNewCycleCountsArgs = {
  completed?: InputMaybe<Scalars['Boolean']>;
  storeNumber: Scalars['String'];
  type: CycleCountType;
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

export enum SubmitCycleCountError {
  AlreadyCompleted = 'ALREADY_COMPLETED',
  AlreadySubmitted = 'ALREADY_SUBMITTED',
  LocationsNotCompleted = 'LOCATIONS_NOT_COMPLETED',
  NotFound = 'NOT_FOUND',
  NotStarted = 'NOT_STARTED',
  Other = 'OTHER'
}

export type SubmitCycleCountResult = {
  __typename?: 'SubmitCycleCountResult';
  cycleCount?: Maybe<CycleCount>;
  error?: Maybe<SubmitCycleCountError>;
  errorMessage?: Maybe<Scalars['String']>;
};

export enum TakeOverCycleCountError {
  NotInProgress = 'NOT_IN_PROGRESS',
  Other = 'OTHER'
}

export type TakeOverCycleCountResult = {
  __typename?: 'TakeOverCycleCountResult';
  cycleCount?: Maybe<CycleCount>;
  error?: Maybe<TakeOverCycleCountError>;
  errorMessage?: Maybe<Scalars['String']>;
};

export type TeamMember = {
  __typename?: 'TeamMember';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type TestBackStockSlotInput = {
  guid?: InputMaybe<Scalars['String']>;
  lastModified?: InputMaybe<Scalars['Date']>;
  qty?: InputMaybe<Scalars['Int']>;
  sectionsLotName?: InputMaybe<Scalars['String']>;
  sectionsLotNum?: InputMaybe<Scalars['String']>;
  slotDescription?: InputMaybe<Scalars['String']>;
  slotId?: InputMaybe<Scalars['Int']>;
  slotName?: InputMaybe<Scalars['String']>;
  storeNumber?: InputMaybe<Scalars['String']>;
};

export type TestDataInput = {
  items?: InputMaybe<Array<TestItemInput>>;
  missingItemSkus?: InputMaybe<Array<Scalars['String']>>;
  storeNumber: Scalars['String'];
};

export type TestItemInput = {
  backStockSlots?: InputMaybe<Array<InputMaybe<TestBackStockSlotInput>>>;
  mfrPartNum?: InputMaybe<Scalars['String']>;
  onHand?: InputMaybe<Scalars['Int']>;
  partDesc?: InputMaybe<Scalars['String']>;
  planograms?: InputMaybe<Array<InputMaybe<TestPlanogramInput>>>;
  retailPrice?: InputMaybe<Scalars['Float']>;
  sku: Scalars['String'];
  upc?: InputMaybe<Scalars['String']>;
};

export type TestPlanogramInput = {
  description?: InputMaybe<Scalars['String']>;
  planogramId?: InputMaybe<Scalars['String']>;
  seqNum?: InputMaybe<Scalars['Int']>;
};

export type TestSetDataResult = {
  __typename?: 'TestSetDataResult';
  items?: Maybe<Array<Item>>;
  missingItemSkus?: Maybe<Array<Scalars['String']>>;
  storeNumber: Scalars['String'];
};

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

export enum UpdateCycleCountError {
  AlreadyCompleted = 'ALREADY_COMPLETED',
  DifferentOwner = 'DIFFERENT_OWNER',
  InvalidItems = 'INVALID_ITEMS',
  NotFound = 'NOT_FOUND',
  Other = 'OTHER'
}

export type UpdateCycleCountRequest = {
  cycleCountName: Scalars['String'];
  items?: InputMaybe<Array<InputMaybe<UpdateItemRequest>>>;
  status: Status;
  storeNumber: Scalars['String'];
};

export type UpdateCycleCountResult = {
  __typename?: 'UpdateCycleCountResult';
  cycleCount?: Maybe<NewCycleCount>;
  error?: Maybe<UpdateCycleCountError>;
  errorMessage?: Maybe<Scalars['String']>;
};

export type UpdateItemRequest = {
  sku: Scalars['String'];
  totalCountQty: Scalars['Int'];
};

export enum VerifyCycleCountError {
  AlreadyCompleted = 'ALREADY_COMPLETED',
  NotFound = 'NOT_FOUND',
  Other = 'OTHER'
}

export type VerifyCycleCountResult = {
  __typename?: 'VerifyCycleCountResult';
  cycleCount?: Maybe<CycleCount>;
  error?: Maybe<VerifyCycleCountError>;
  errorMessage?: Maybe<Scalars['String']>;
};

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String'];
};

export type ItemInfoFieldsFragment = { __typename?: 'Item', mfrPartNum?: string | null, sku?: string | null, retailPrice?: number | null, onHand?: number | null, partDesc?: string | null, backStockSlots?: Array<{ __typename?: 'BackStockSlot', qty?: number | null } | null> | null };

export type BatchCountItemBySkuLookupQueryVariables = Exact<{
  sku: Scalars['String'];
  storeNumber: Scalars['String'];
}>;


export type BatchCountItemBySkuLookupQuery = { __typename?: 'Query', itemBySku?: { __typename?: 'Item', mfrPartNum?: string | null, sku?: string | null, retailPrice?: number | null, onHand?: number | null, partDesc?: string | null, backStockSlots?: Array<{ __typename?: 'BackStockSlot', qty?: number | null, slotId?: number | null } | null> | null, planograms?: Array<{ __typename?: 'Planogram', planogramId?: string | null, seqNum?: number | null } | null> | null } | null };

export type BatchCountItemByUpcLookupQueryVariables = Exact<{
  upc: Scalars['String'];
  storeNumber: Scalars['String'];
}>;


export type BatchCountItemByUpcLookupQuery = { __typename?: 'Query', itemByUpc?: { __typename?: 'Item', mfrPartNum?: string | null, sku?: string | null, retailPrice?: number | null, onHand?: number | null, partDesc?: string | null, backStockSlots?: Array<{ __typename?: 'BackStockSlot', qty?: number | null, slotId?: number | null } | null> | null, planograms?: Array<{ __typename?: 'Planogram', planogramId?: string | null, seqNum?: number | null } | null> | null } | null };

export type SubmitBatchCountMutationVariables = Exact<{
  request: CycleCountList;
}>;


export type SubmitBatchCountMutation = { __typename?: 'Mutation', sendCycleCountList?: boolean | null };

export type CycleCountCardFragmentFragment = { __typename?: 'CycleCount', cycleCountId?: number | null, cycleCountName?: string | null, dueDate?: string | null };

export type CycleCountContextQueryVariables = Exact<{
  storeNumber: Scalars['String'];
}>;


export type CycleCountContextQuery = { __typename?: 'Query', cycleCounts?: Array<{ __typename?: 'CycleCount', storeNumber?: string | null, cycleCountType?: CycleCountType | null, cycleCountId?: number | null, cycleCountName?: string | null, dueDate?: string | null, items?: Array<{ __typename?: 'Item', sku?: string | null, mfrPartNum?: string | null, partDesc?: string | null, retailPrice?: number | null, planograms?: Array<{ __typename?: 'Planogram', seqNum?: number | null, planogramId?: string | null, description?: string | null } | null> | null } | null> | null } | null> | null };

export type PrintFrontTagMutationVariables = Exact<{
  storeNumber: Scalars['String'];
  printer?: Scalars['String'];
  data?: InputMaybe<Array<InputMaybe<FrontTagItem>> | InputMaybe<FrontTagItem>>;
}>;


export type PrintFrontTagMutation = { __typename?: 'Mutation', frontTagRequest?: PrintRequestStatus | null };

export type ItemLookupHomeManualItemLookupQueryVariables = Exact<{
  sku: Scalars['String'];
  storeNumber: Scalars['String'];
}>;


export type ItemLookupHomeManualItemLookupQuery = { __typename?: 'Query', itemBySku?: { __typename?: 'Item', mfrPartNum?: string | null, sku?: string | null, retailPrice?: number | null, onHand?: number | null, partDesc?: string | null, backStockSlots?: Array<{ __typename?: 'BackStockSlot', qty?: number | null, slotId?: number | null } | null> | null, planograms?: Array<{ __typename?: 'Planogram', planogramId?: string | null, seqNum?: number | null } | null> | null } | null };

export type ManualItemLookupQueryVariables = Exact<{
  sku: Scalars['String'];
  storeNumber: Scalars['String'];
}>;


export type ManualItemLookupQuery = { __typename?: 'Query', itemBySku?: { __typename?: 'Item', mfrPartNum?: string | null, sku?: string | null, retailPrice?: number | null, onHand?: number | null, partDesc?: string | null, backStockSlots?: Array<{ __typename?: 'BackStockSlot', qty?: number | null, slotId?: number | null } | null> | null, planograms?: Array<{ __typename?: 'Planogram', planogramId?: string | null, seqNum?: number | null } | null> | null } | null };

export type AutomaticItemLookupQueryVariables = Exact<{
  upc: Scalars['String'];
  storeNumber: Scalars['String'];
}>;


export type AutomaticItemLookupQuery = { __typename?: 'Query', itemByUpc?: { __typename?: 'Item', mfrPartNum?: string | null, sku?: string | null, retailPrice?: number | null, onHand?: number | null, partDesc?: string | null, backStockSlots?: Array<{ __typename?: 'BackStockSlot', qty?: number | null, slotId?: number | null } | null> | null, planograms?: Array<{ __typename?: 'Planogram', planogramId?: string | null, seqNum?: number | null } | null> | null } | null };

export type OutageItemInfoFieldsFragment = { __typename?: 'Item', partDesc?: string | null, mfrPartNum?: string | null, sku?: string | null, retailPrice?: number | null, onHand?: number | null, backStockSlots?: Array<{ __typename?: 'BackStockSlot', slotId?: number | null } | null> | null };

export type SubmitOutageCountMutationVariables = Exact<{
  request: CycleCountList;
}>;


export type SubmitOutageCountMutation = { __typename?: 'Mutation', sendCycleCountList?: boolean | null };

export type ItemLookupBySkuQueryVariables = Exact<{
  sku: Scalars['String'];
  storeNumber: Scalars['String'];
}>;


export type ItemLookupBySkuQuery = { __typename?: 'Query', itemBySku?: { __typename?: 'Item', partDesc?: string | null, mfrPartNum?: string | null, sku?: string | null, retailPrice?: number | null, onHand?: number | null, backStockSlots?: Array<{ __typename?: 'BackStockSlot', slotId?: number | null, qty?: number | null } | null> | null } | null };

export type TruckScanAppQueryVariables = Exact<{
  storeNumber: Scalars['String'];
}>;


export type TruckScanAppQuery = { __typename?: 'Query', truckScansByStore?: Array<{ __typename?: 'TruckScan', asnReferenceNumber?: string | null, status?: TruckScanStatus | null, storeNumber?: string | null } | null> | null };

export type TruckScanDetailsQueryVariables = Exact<{
  asn: Scalars['String'];
}>;


export type TruckScanDetailsQuery = { __typename?: 'Query', truckScanByASN?: { __typename?: 'TruckScan', asnReferenceNumber?: string | null, status?: TruckScanStatus | null, storeNumber?: string | null, items?: Array<{ __typename?: 'TruckScanItem', sku?: string | null, upc?: string | null, mfrPartNum?: string | null, partDesc?: string | null, expectedCount?: number | null, actualCount?: number | null } | null> | null } | null };

export type ItemInfoHeaderFieldsFragment = { __typename?: 'Item', mfrPartNum?: string | null, sku?: string | null, retailPrice?: number | null, onHand?: number | null, partDesc?: string | null, backStockSlots?: Array<{ __typename?: 'BackStockSlot', qty?: number | null } | null> | null };

export type BackstockSlotFieldsFragment = { __typename?: 'Item', backStockSlots?: Array<{ __typename?: 'BackStockSlot', slotId?: number | null, qty?: number | null } | null> | null };

export type PlanogramFieldsFragment = { __typename?: 'Item', planograms?: Array<{ __typename?: 'Planogram', planogramId?: string | null, seqNum?: number | null } | null> | null };

export const ItemInfoFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemInfoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"onHand"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<ItemInfoFieldsFragment, unknown>;
export const CycleCountCardFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CycleCountCardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CycleCount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cycleCountId"}},{"kind":"Field","name":{"kind":"Name","value":"cycleCountName"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}}]}}]} as unknown as DocumentNode<CycleCountCardFragmentFragment, unknown>;
export const OutageItemInfoFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OutageItemInfoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"onHand"}},{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slotId"}}]}}]}}]} as unknown as DocumentNode<OutageItemInfoFieldsFragment, unknown>;
export const ItemInfoHeaderFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemInfoHeaderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"onHand"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<ItemInfoHeaderFieldsFragment, unknown>;
export const BackstockSlotFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BackstockSlotFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slotId"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<BackstockSlotFieldsFragment, unknown>;
export const PlanogramFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlanogramFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planograms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planogramId"}},{"kind":"Field","name":{"kind":"Name","value":"seqNum"}}]}}]}}]} as unknown as DocumentNode<PlanogramFieldsFragment, unknown>;
export const BatchCountItemBySkuLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BatchCountItemBySkuLookup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sku"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemBySku"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sku"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sku"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemInfoFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlanogramFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BackstockSlotFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemInfoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"onHand"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlanogramFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planograms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planogramId"}},{"kind":"Field","name":{"kind":"Name","value":"seqNum"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BackstockSlotFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slotId"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<BatchCountItemBySkuLookupQuery, BatchCountItemBySkuLookupQueryVariables>;
export const BatchCountItemByUpcLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BatchCountItemByUpcLookup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"upc"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemByUpc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"upc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"upc"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemInfoFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlanogramFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BackstockSlotFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemInfoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"onHand"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlanogramFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planograms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planogramId"}},{"kind":"Field","name":{"kind":"Name","value":"seqNum"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BackstockSlotFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slotId"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<BatchCountItemByUpcLookupQuery, BatchCountItemByUpcLookupQueryVariables>;
export const SubmitBatchCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitBatchCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CycleCountList"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendCycleCountList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}]}]}}]} as unknown as DocumentNode<SubmitBatchCountMutation, SubmitBatchCountMutationVariables>;
export const CycleCountContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CycleCountContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cycleCounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storeNumber"}},{"kind":"Field","name":{"kind":"Name","value":"cycleCountType"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CycleCountCardFragment"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"planograms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seqNum"}},{"kind":"Field","name":{"kind":"Name","value":"planogramId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CycleCountCardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CycleCount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cycleCountId"}},{"kind":"Field","name":{"kind":"Name","value":"cycleCountName"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}}]}}]} as unknown as DocumentNode<CycleCountContextQuery, CycleCountContextQueryVariables>;
export const PrintFrontTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PrintFrontTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"printer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"defaultValue":{"kind":"StringValue","value":"1","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FrontTagItem"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"frontTagRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"printer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"printer"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}]}]}}]} as unknown as DocumentNode<PrintFrontTagMutation, PrintFrontTagMutationVariables>;
export const ItemLookupHomeManualItemLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ItemLookupHomeManualItemLookup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sku"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemBySku"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sku"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sku"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemInfoHeaderFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlanogramFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BackstockSlotFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemInfoHeaderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"onHand"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlanogramFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planograms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planogramId"}},{"kind":"Field","name":{"kind":"Name","value":"seqNum"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BackstockSlotFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slotId"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<ItemLookupHomeManualItemLookupQuery, ItemLookupHomeManualItemLookupQueryVariables>;
export const ManualItemLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ManualItemLookup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sku"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemBySku"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sku"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sku"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemInfoHeaderFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlanogramFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BackstockSlotFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemInfoHeaderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"onHand"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlanogramFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planograms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planogramId"}},{"kind":"Field","name":{"kind":"Name","value":"seqNum"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BackstockSlotFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slotId"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<ManualItemLookupQuery, ManualItemLookupQueryVariables>;
export const AutomaticItemLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AutomaticItemLookup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"upc"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemByUpc"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"upc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"upc"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemInfoHeaderFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlanogramFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BackstockSlotFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemInfoHeaderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"onHand"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlanogramFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planograms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planogramId"}},{"kind":"Field","name":{"kind":"Name","value":"seqNum"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BackstockSlotFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slotId"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<AutomaticItemLookupQuery, AutomaticItemLookupQueryVariables>;
export const SubmitOutageCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitOutageCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CycleCountList"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendCycleCountList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}]}]}}]} as unknown as DocumentNode<SubmitOutageCountMutation, SubmitOutageCountMutationVariables>;
export const ItemLookupBySkuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ItemLookupBySku"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sku"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemBySku"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sku"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sku"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OutageItemInfoFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BackstockSlotFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OutageItemInfoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"retailPrice"}},{"kind":"Field","name":{"kind":"Name","value":"onHand"}},{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slotId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BackstockSlotFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backStockSlots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slotId"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}}]}}]}}]} as unknown as DocumentNode<ItemLookupBySkuQuery, ItemLookupBySkuQueryVariables>;
export const TruckScanAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"truckScanApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"truckScansByStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"storeNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asnReferenceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"storeNumber"}}]}}]}}]} as unknown as DocumentNode<TruckScanAppQuery, TruckScanAppQueryVariables>;
export const TruckScanDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"truckScanDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"asn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"truckScanByASN"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"asnReferenceNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"asn"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asnReferenceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"storeNumber"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"upc"}},{"kind":"Field","name":{"kind":"Name","value":"mfrPartNum"}},{"kind":"Field","name":{"kind":"Name","value":"partDesc"}},{"kind":"Field","name":{"kind":"Name","value":"expectedCount"}},{"kind":"Field","name":{"kind":"Name","value":"actualCount"}}]}}]}}]}}]} as unknown as DocumentNode<TruckScanDetailsQuery, TruckScanDetailsQueryVariables>;