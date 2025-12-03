import { ArrowUpDown } from 'lucide-react';

interface GroupedRow {
  name: string;
  reach: number;
  impressions: number;
  spent: number;
  frequency: number;
  leads: number;
  costPerLead: number;
  count: number;
}

interface DataTableProps {
  data: GroupedRow[];
  groupBy: string;
}

const groupByLabels: Record<string, string> = {
  account: 'Conta',
  campaign: 'Campanha',
  adSet: 'Conjunto de Anúncios',
  ad: 'Anúncio',
};

export function DataTable({ data, groupBy }: DataTableProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(Math.round(num));
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  {groupByLabels[groupBy]}
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Leads
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                CPL
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Alcance
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Impressões
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Frequência
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Valor gasto
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3.5">
                  <span className="text-sm font-medium text-foreground line-clamp-2">
                    {row.name}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm font-semibold text-primary tabular-nums">
                    {formatNumber(row.leads)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm text-foreground tabular-nums">
                    {formatCurrency(row.costPerLead)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm text-foreground tabular-nums">
                    {formatNumber(row.reach)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm text-foreground tabular-nums">
                    {formatNumber(row.impressions)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm text-foreground tabular-nums">
                    {row.frequency.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm font-medium text-muted-foreground tabular-nums">
                    {formatCurrency(row.spent)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
