export interface SupportedFeatureFlags {
  configHamburgerMenuAppFunctions: { label: string; activity: string }[];
}

export const FEATURE_FLAG_DEFAULTS: SupportedFeatureFlags = {
  configHamburgerMenuAppFunctions: [
    {
      label: 'Item Lookup',
      activity: '.activities.ItemLookupActivity',
    },
    {
      label: 'Batch Count',
      activity: '.activities.BatchCountActivity',
    },
    {
      label: 'Outage',
      activity: '.activities.OutageActivity',
    },
  ],
};
