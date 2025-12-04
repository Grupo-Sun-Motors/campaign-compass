import { useState, useEffect, useCallback } from 'react';
import { CampaignData, FilterState, GroupByOption, ColumnVisibility, SortState, SortField, UserPreferences } from '@/types/campaign';
import { parseMetaCSV, calculateMetrics, groupData } from '@/lib/csvParser';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';

const STORAGE_KEY = 'meta_campaign_data';
const PREFERENCES_KEY = 'meta_user_preferences';

const defaultColumnVisibility: ColumnVisibility = {
  leads: true,
  costPerLead: true,
  reach: true,
  impressions: true,
  frequency: true,
  spent: true,
  linkClicks: false,
  ctr: false,
  cpm: false,
};

const defaultSortState: SortState = {
  field: 'spent',
  direction: 'desc',
};

export function useCampaignData() {
  const [rawData, setRawData] = useState<CampaignData[]>([]);
  const [filteredData, setFilteredData] = useState<CampaignData[]>([]);
  const [groupBy, setGroupBy] = useState<GroupByOption>('campaign');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(defaultColumnVisibility);
  const [sortState, setSortState] = useState<SortState>(defaultSortState);
  const [filters, setFilters] = useState<FilterState>({
    accounts: [],
    campaigns: [],
    adSets: [],
    dateRange: { 
      start: startOfMonth(new Date()), 
      end: endOfMonth(new Date()) 
    },
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const storedPrefs = localStorage.getItem(PREFERENCES_KEY);
    if (storedPrefs) {
      try {
        const prefs: UserPreferences = JSON.parse(storedPrefs);
        setGroupBy(prefs.groupBy || 'campaign');
        setColumnVisibility(prefs.columnVisibility || defaultColumnVisibility);
        setSortState(prefs.sortState || defaultSortState);
        if (prefs.filters) {
          setFilters({
            ...prefs.filters,
            dateRange: {
              start: prefs.filters.dateRange.start ? new Date(prefs.filters.dateRange.start) : startOfMonth(new Date()),
              end: prefs.filters.dateRange.end ? new Date(prefs.filters.dateRange.end) : endOfMonth(new Date()),
            }
          });
        }
      } catch (e) {
        console.error('Failed to parse stored preferences');
      }
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    const prefs: UserPreferences = {
      groupBy,
      filters: {
        ...filters,
        dateRange: {
          start: filters.dateRange.start,
          end: filters.dateRange.end,
        }
      },
      columnVisibility,
      sortState,
    };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  }, [groupBy, filters, columnVisibility, sortState]);

  // Load data from localStorage on mount
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

  // Save data to localStorage when it changes
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

    // Date filter
    if (filters.dateRange.start && filters.dateRange.end) {
      result = result.filter(d => {
        if (!d.day) return true;
        try {
          const itemDate = parseISO(d.day);
          return isWithinInterval(itemDate, {
            start: filters.dateRange.start!,
            end: filters.dateRange.end!,
          });
        } catch {
          return true;
        }
      });
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
      dateRange: { 
        start: startOfMonth(new Date()), 
        end: endOfMonth(new Date()) 
      },
    });
  }, []);

  const toggleSort = useCallback((field: SortField) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  }, []);

  const metrics = calculateMetrics(filteredData);
  let groupedData = groupData(filteredData, groupBy);

  // Apply sorting
  groupedData = groupedData.sort((a, b) => {
    const aVal = a[sortState.field as keyof typeof a] ?? 0;
    const bVal = b[sortState.field as keyof typeof b] ?? 0;
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortState.direction === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    
    return sortState.direction === 'asc' 
      ? (aVal as number) - (bVal as number) 
      : (bVal as number) - (aVal as number);
  });

  const uniqueAccounts = [...new Set(rawData.map(d => d.accountName))].filter(Boolean);
  const uniqueCampaigns = [...new Set(rawData.map(d => d.campaignName))].filter(Boolean);
  const uniqueAdSets = [...new Set(rawData.map(d => d.adSetName))].filter(Boolean);
  const uniqueDates = [...new Set(rawData.map(d => d.day))].filter(Boolean).sort();

  return {
    rawData,
    filteredData,
    metrics,
    groupedData,
    groupBy,
    setGroupBy,
    filters,
    setFilters,
    columnVisibility,
    setColumnVisibility,
    sortState,
    toggleSort,
    importCSV,
    clearData,
    resetFilters,
    uniqueAccounts,
    uniqueCampaigns,
    uniqueAdSets,
    uniqueDates,
    hasData: rawData.length > 0,
  };
}
