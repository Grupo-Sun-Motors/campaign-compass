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
  reach: number;
  impressions: number;
  frequency: number;
  currency: string;
  amountSpent: number;
  attributionSetting: string;
  costPerLead: number;
  leads: number;
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
  uniqueAccounts: number;
  uniqueCampaigns: number;
  uniqueAdSets: number;
  uniqueAds: number;
}

export type GroupByOption = 'account' | 'campaign' | 'adSet' | 'ad';

export interface FilterState {
  accounts: string[];
  campaigns: string[];
  adSets: string[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
}
