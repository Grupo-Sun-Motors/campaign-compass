import { Users, Eye, DollarSign, Repeat, Building2, Megaphone, Layers, FileText, RefreshCw, Upload } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { DataTable } from './DataTable';
import { FilterSidebar } from './FilterSidebar';
import { AggregatedMetrics, FilterState, GroupByOption } from '@/types/campaign';

interface DashboardProps {
  metrics: AggregatedMetrics;
  groupedData: Array<{
    name: string;
    reach: number;
    impressions: number;
    spent: number;
    frequency: number;
    count: number;
  }>;
  groupBy: GroupByOption;
  setGroupBy: (groupBy: GroupByOption) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  uniqueAccounts: string[];
  uniqueCampaigns: string[];
  uniqueAdSets: string[];
  onReset: () => void;
  onClearData: () => void;
  onRefresh: () => void;
}

export function Dashboard({
  metrics,
  groupedData,
  groupBy,
  setGroupBy,
  filters,
  setFilters,
  uniqueAccounts,
  uniqueCampaigns,
  uniqueAdSets,
  onReset,
  onClearData,
  onRefresh,
}: DashboardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto scrollbar-thin">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Visão Geral</h2>
            <p className="text-sm text-muted-foreground">
              {groupedData.length} {groupBy === 'account' ? 'contas' : groupBy === 'campaign' ? 'campanhas' : groupBy === 'adSet' ? 'conjuntos' : 'anúncios'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
            <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Nova importação
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const content = ev.target?.result as string;
                      // This will trigger a re-import via the parent
                      window.dispatchEvent(new CustomEvent('importCSV', { detail: content }));
                    };
                    reader.readAsText(file, 'UTF-8');
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Alcance Total"
            value={formatNumber(metrics.totalReach)}
            icon={Users}
            subtitle="pessoas alcançadas"
          />
          <MetricCard
            title="Impressões"
            value={formatNumber(metrics.totalImpressions)}
            icon={Eye}
            subtitle="exibições do anúncio"
          />
          <MetricCard
            title="Valor Investido"
            value={formatCurrency(metrics.totalSpent)}
            icon={DollarSign}
            subtitle="total gasto"
          />
          <MetricCard
            title="Frequência Média"
            value={metrics.avgFrequency.toFixed(2)}
            icon={Repeat}
            subtitle="exibições por pessoa"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Contas"
            value={metrics.uniqueAccounts}
            icon={Building2}
          />
          <MetricCard
            title="Campanhas"
            value={metrics.uniqueCampaigns}
            icon={Megaphone}
          />
          <MetricCard
            title="Conjuntos"
            value={metrics.uniqueAdSets}
            icon={Layers}
          />
          <MetricCard
            title="Anúncios"
            value={metrics.uniqueAds}
            icon={FileText}
          />
        </div>

        {/* Data Table */}
        <DataTable data={groupedData} groupBy={groupBy} />
      </main>

      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        setFilters={setFilters}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        uniqueAccounts={uniqueAccounts}
        uniqueCampaigns={uniqueCampaigns}
        uniqueAdSets={uniqueAdSets}
        onReset={onReset}
        onClearData={onClearData}
      />
    </div>
  );
}
