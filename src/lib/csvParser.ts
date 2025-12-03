import { CampaignData } from '@/types/campaign';

export function parseMetaCSV(csvContent: string): CampaignData[] {
  const lines = csvContent.split('\n');
  if (lines.length < 2) return [];

  const data: CampaignData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    if (values.length < 17) continue;

    // Skip summary row (first data row has empty account name)
    if (!values[0] && !values[1]) continue;

    const reach = parseFloat(values[9]) || 0;
    const impressions = parseFloat(values[10]) || 0;
    const frequency = parseFloat(values[11]) || 0;
    const amountSpent = parseFloat(values[13]) || 0;

    data.push({
      accountName: values[0] || 'Sem conta',
      campaignName: values[1] || 'Sem campanha',
      adSetName: values[2] || 'Sem conjunto',
      adName: values[3] || 'Sem anúncio',
      accountId: values[4] || '',
      campaignId: values[5] || '',
      adSetId: values[6] || '',
      adId: values[7] || '',
      adLabel: values[8] || '',
      reach,
      impressions,
      frequency,
      currency: values[12] || 'BRL',
      amountSpent,
      attributionSetting: values[14] || '',
      reportStart: values[15] || '',
      reportEnd: values[16] || '',
    });
  }

  return data;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export function calculateMetrics(data: CampaignData[]) {
  const uniqueAccounts = new Set(data.map(d => d.accountName));
  const uniqueCampaigns = new Set(data.map(d => d.campaignName));
  const uniqueAdSets = new Set(data.map(d => d.adSetName));
  const uniqueAds = new Set(data.map(d => d.adName));

  const totalReach = data.reduce((sum, d) => sum + d.reach, 0);
  const totalImpressions = data.reduce((sum, d) => sum + d.impressions, 0);
  const totalSpent = data.reduce((sum, d) => sum + d.amountSpent, 0);
  const avgFrequency = totalImpressions > 0 ? totalImpressions / totalReach : 0;

  return {
    totalReach,
    totalImpressions,
    totalSpent,
    avgFrequency,
    uniqueAccounts: uniqueAccounts.size,
    uniqueCampaigns: uniqueCampaigns.size,
    uniqueAdSets: uniqueAdSets.size,
    uniqueAds: uniqueAds.size,
  };
}

export function groupData(data: CampaignData[], groupBy: string) {
  const grouped = new Map<string, CampaignData[]>();

  data.forEach(item => {
    let key: string;
    switch (groupBy) {
      case 'account':
        key = item.accountName;
        break;
      case 'campaign':
        key = item.campaignName;
        break;
      case 'adSet':
        key = item.adSetName;
        break;
      case 'ad':
      default:
        key = item.adName;
        break;
    }

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(item);
  });

  return Array.from(grouped.entries()).map(([name, items]) => ({
    name,
    reach: items.reduce((sum, i) => sum + i.reach, 0),
    impressions: items.reduce((sum, i) => sum + i.impressions, 0),
    spent: items.reduce((sum, i) => sum + i.amountSpent, 0),
    frequency: items.reduce((sum, i) => sum + i.impressions, 0) / items.reduce((sum, i) => sum + i.reach, 0) || 0,
    count: items.length,
  })).sort((a, b) => b.spent - a.spent);
}
