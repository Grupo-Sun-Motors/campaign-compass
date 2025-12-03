import { useState, useEffect, useCallback } from 'react';
import { CampaignData, FilterState, GroupByOption } from '@/types/campaign';
import { parseMetaCSV, calculateMetrics, groupData } from '@/lib/csvParser';

const STORAGE_KEY = 'meta_campaign_data';

export function useCampaignData() {
  const [rawData, setRawData] = useState<CampaignData[]>([]);
  const [filteredData, setFilteredData] = useState<CampaignData[]>([]);
  const [groupBy, setGroupBy] = useState<GroupByOption>('campaign');
  const [filters, setFilters] = useState<FilterState>({
    accounts: [],
    campaigns: [],
    adSets: [],
    dateRange: { start: null, end: null },
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRawData(parsed);
      } catch (e) {
        console.error('Failed to parse stored data');
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (rawData.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rawData));
    }
  }, [rawData]);

  // Apply filters
  useEffect(() => {
    let result = [...rawData];

    if (filters.accounts.length > 0) {
      result = result.filter(d => filters.accounts.includes(d.accountName));
    }
    if (filters.campaigns.length > 0) {
      result = result.filter(d => filters.campaigns.includes(d.campaignName));
    }
    if (filters.adSets.length > 0) {
      result = result.filter(d => filters.adSets.includes(d.adSetName));
    }

    setFilteredData(result);
  }, [rawData, filters]);

  const importCSV = useCallback((content: string) => {
    const parsed = parseMetaCSV(content);
    setRawData(parsed);
  }, []);

  const clearData = useCallback(() => {
    setRawData([]);
    setFilteredData([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      accounts: [],
      campaigns: [],
      adSets: [],
      dateRange: { start: null, end: null },
    });
  }, []);

  const metrics = calculateMetrics(filteredData);
  const groupedData = groupData(filteredData, groupBy);

  const uniqueAccounts = [...new Set(rawData.map(d => d.accountName))];
  const uniqueCampaigns = [...new Set(rawData.map(d => d.campaignName))];
  const uniqueAdSets = [...new Set(rawData.map(d => d.adSetName))];

  return {
    rawData,
    filteredData,
    metrics,
    groupedData,
    groupBy,
    setGroupBy,
    filters,
    setFilters,
    importCSV,
    clearData,
    resetFilters,
    uniqueAccounts,
    uniqueCampaigns,
    uniqueAdSets,
    hasData: rawData.length > 0,
  };
}
