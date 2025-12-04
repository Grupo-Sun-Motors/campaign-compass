export interface CampaignData {
  accountName: string;
  campaignName: string;
  adSetName: string;
  adName: string;
  accountId: string;
  campaignId: string;
  adSetId: string;
  adId: string;
  adLabel: string;
  day: string;
  reach: number;
  impressions: number;
  frequency: number;
  currency: string;
  amountSpent: number;
  attributionSetting: string;
  costPerLead: number;
  leads: number;
  linkClicks: number;
  ctr: number;
  cpm: number;
  cpcLink: number;
  cpcAll: number;
  views: number;
  reportStart: string;
  reportEnd: string;
}

export interface AggregatedMetrics {
  totalReach: number;
  totalImpressions: number;
  totalSpent: number;
  avgFrequency: number;
  totalLeads: number;
  avgCostPerLead: number;
  totalLinkClicks: number;
  avgCtr: number;
  avgCpm: number;
  avgCpcLink: number;
  uniqueAccounts: number;
  uniqueCampaigns: number;
  uniqueAdSets: number;
  uniqueAds: number;
}

export type GroupByOption = 'account' | 'campaign' | 'adSet' | 'ad';

export type SortField = 'name' | 'leads' | 'costPerLead' | 'reach' | 'impressions' | 'frequency' | 'spent' | 'linkClicks' | 'ctr' | 'cpm';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface FilterState {
  accounts: string[];
  campaigns: string[];
  adSets: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface ColumnVisibility {
  leads: boolean;
  costPerLead: boolean;
  reach: boolean;
  impressions: boolean;
  frequency: boolean;
  spent: boolean;
  linkClicks: boolean;
  ctr: boolean;
  cpm: boolean;
}

export interface UserPreferences {
  groupBy: GroupByOption;
  filters: FilterState;
  columnVisibility: ColumnVisibility;
  sortState: SortState;
}
