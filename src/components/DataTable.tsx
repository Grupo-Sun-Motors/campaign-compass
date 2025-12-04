import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { ColumnVisibility, SortField, SortState } from '@/types/campaign';
import { cn } from '@/lib/utils';

interface GroupedRow {
  name: string;
  reach: number;
  impressions: number;
  spent: number;
  frequency: number;
  leads: number;
  costPerLead: number;
  linkClicks: number;
  ctr: number;
  cpm: number;
  count: number;
}

interface DataTableProps {
  data: GroupedRow[];
  groupBy: string;
  columnVisibility: ColumnVisibility;
  sortState: SortState;
  onSort: (field: SortField) => void;
}

const groupByLabels: Record<string, string> = {
  account: 'Conta',
  campaign: 'Campanha',
  adSet: 'Conjunto de Anúncios',
  ad: 'Anúncio',
};

interface ColumnDef {
  key: SortField;
  label: string;
  visibilityKey?: keyof ColumnVisibility;
  format: (val: number) => string;
  align?: 'left' | 'right';
  highlight?: boolean;
}

export function DataTable({ data, groupBy, columnVisibility, sortState, onSort }: DataTableProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(Math.round(num));
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const formatPercent = (num: number) => {
    return num.toFixed(2) + '%';
  };

  const columns: ColumnDef[] = [
    { key: 'name', label: groupByLabels[groupBy], format: (v) => String(v), align: 'left' },
    { key: 'leads', label: 'Leads', visibilityKey: 'leads', format: formatNumber, highlight: true },
    { key: 'costPerLead', label: 'CPL', visibilityKey: 'costPerLead', format: formatCurrency },
    { key: 'reach', label: 'Alcance', visibilityKey: 'reach', format: formatNumber },
    { key: 'impressions', label: 'Impressões', visibilityKey: 'impressions', format: formatNumber },
    { key: 'frequency', label: 'Frequência', visibilityKey: 'frequency', format: (v) => v.toFixed(2) },
    { key: 'spent', label: 'Valor gasto', visibilityKey: 'spent', format: formatCurrency },
    { key: 'linkClicks', label: 'Cliques', visibilityKey: 'linkClicks', format: formatNumber },
    { key: 'ctr', label: 'CTR', visibilityKey: 'ctr', format: formatPercent },
    { key: 'cpm', label: 'CPM', visibilityKey: 'cpm', format: formatCurrency },
  ];

  const visibleColumns = columns.filter(col => 
    col.key === 'name' || !col.visibilityKey || columnVisibility[col.visibilityKey]
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortState.field !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-50" />;
    }
    return sortState.direction === 'asc' 
      ? <ArrowUp className="w-3 h-3" /> 
      : <ArrowDown className="w-3 h-3" />;
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors select-none",
                    col.align === 'left' ? 'text-left' : 'text-right'
                  )}
                >
                  <div className={cn(
                    "flex items-center gap-1",
                    col.align !== 'left' && 'justify-end'
                  )}>
                    {col.label}
                    <SortIcon field={col.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                {visibleColumns.map((col) => {
                  const value = row[col.key as keyof GroupedRow];
                  return (
                    <td 
                      key={col.key} 
                      className={cn(
                        "px-4 py-3.5",
                        col.align !== 'left' && 'text-right'
                      )}
                    >
                      <span className={cn(
                        "text-sm tabular-nums",
                        col.key === 'name' && 'font-medium text-foreground line-clamp-2',
                        col.highlight && 'font-semibold text-primary',
                        !col.highlight && col.key !== 'name' && 'text-foreground'
                      )}>
                        {col.key === 'name' ? String(value) : col.format(value as number)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
