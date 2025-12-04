import { CampaignData } from '@/types/campaign';

export function parseMetaCSV(csvContent: string): CampaignData[] {
  const lines = csvContent.split('\n');
  if (lines.length < 2) return [];

  const data: CampaignData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    if (values.length < 20) continue;

    // Skip summary row (first data row has empty account name)
    if (!values[0] && !values[1]) continue;

    const parseNumber = (val: string) => {
      const cleaned = val.replace(/\./g, '').replace(',', '.');
      return parseFloat(cleaned) || 0;
    };

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
      day: values[9] || '',
      reach: parseNumber(values[10]),
      impressions: parseNumber(values[11]),
      frequency: parseNumber(values[12]),
      currency: values[13] || 'BRL',
      amountSpent: parseNumber(values[14]),
      attributionSetting: values[15] || '',
      costPerLead: parseNumber(values[16]),
      leads: parseNumber(values[17]),
      linkClicks: parseNumber(values[18]),
      ctr: parseNumber(values[19]),
      cpm: parseNumber(values[20]),
      cpcLink: parseNumber(values[21]),
      cpcAll: parseNumber(values[22]),
      views: parseNumber(values[23]),
      reportStart: values[24] || '',
      reportEnd: values[25] || '',
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
  const avgFrequency = totalReach > 0 ? totalImpressions / totalReach : 0;
  const totalLeads = data.reduce((sum, d) => sum + d.leads, 0);
  const avgCostPerLead = totalLeads > 0 ? totalSpent / totalLeads : 0;
  const totalLinkClicks = data.reduce((sum, d) => sum + d.linkClicks, 0);
  const avgCtr = totalImpressions > 0 ? (totalLinkClicks / totalImpressions) * 100 : 0;
  const avgCpm = totalImpressions > 0 ? (totalSpent / totalImpressions) * 1000 : 0;
  const avgCpcLink = totalLinkClicks > 0 ? totalSpent / totalLinkClicks : 0;

  return {
    totalReach,
    totalImpressions,
    totalSpent,
    avgFrequency,
    totalLeads,
    avgCostPerLead,
    totalLinkClicks,
    avgCtr,
    avgCpm,
    avgCpcLink,
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

  return Array.from(grouped.entries()).map(([name, items]) => {
    const totalSpent = items.reduce((sum, i) => sum + i.amountSpent, 0);
    const totalLeads = items.reduce((sum, i) => sum + i.leads, 0);
    const totalImpressions = items.reduce((sum, i) => sum + i.impressions, 0);
    const totalReach = items.reduce((sum, i) => sum + i.reach, 0);
    const totalLinkClicks = items.reduce((sum, i) => sum + i.linkClicks, 0);

    return {
      name,
      reach: totalReach,
      impressions: totalImpressions,
      spent: totalSpent,
      frequency: totalReach > 0 ? totalImpressions / totalReach : 0,
      leads: totalLeads,
      costPerLead: totalLeads > 0 ? totalSpent / totalLeads : 0,
      linkClicks: totalLinkClicks,
      ctr: totalImpressions > 0 ? (totalLinkClicks / totalImpressions) * 100 : 0,
      cpm: totalImpressions > 0 ? (totalSpent / totalImpressions) * 1000 : 0,
      count: items.length,
    };
  });
}
