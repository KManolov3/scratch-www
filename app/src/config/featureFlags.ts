export interface SupportedFeatureFlags {
  configHamburgerMenuAppFunctions: {
    label: string;
    activity: string;
    icon?: string;
  }[];
  enablePrintFrontTag: boolean;
}

export const FEATURE_FLAG_DEFAULTS: SupportedFeatureFlags = {
  configHamburgerMenuAppFunctions: [
    {
      label: 'Item Lookup',
      icon: 'item-lookup',
      activity: '.activities.ItemLookupActivity',
    },
    {
      label: 'Batch Count',
      icon: 'batch-count',
      activity: '.activities.BatchCountActivity',
    },
    {
      label: 'Outage',
      icon: 'outage',
      activity: '.activities.OutageActivity',
    },
  ],
  enablePrintFrontTag: false,
};
