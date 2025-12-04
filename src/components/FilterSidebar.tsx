import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X, RotateCcw, Calendar, Columns, Eye, EyeOff } from 'lucide-react';
import { FilterState, GroupByOption, ColumnVisibility } from '@/types/campaign';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  groupBy: GroupByOption;
  setGroupBy: (groupBy: GroupByOption) => void;
  columnVisibility: ColumnVisibility;
  setColumnVisibility: (visibility: ColumnVisibility) => void;
  uniqueAccounts: string[];
  uniqueCampaigns: string[];
  uniqueAdSets: string[];
  onReset: () => void;
  onClearData: () => void;
}

interface FilterSectionProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  defaultOpen?: boolean;
}

function FilterSection({ title, options, selected, onChange, defaultOpen = false }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground"
      >
        {title}
        {selected.length > 0 && (
          <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
            {selected.length}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-2 space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground truncate" title={option}>
                {option}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

const columnLabels: Record<keyof ColumnVisibility, string> = {
  leads: 'Leads',
  costPerLead: 'Custo por Lead',
  reach: 'Alcance',
  impressions: 'Impressões',
  frequency: 'Frequência',
  spent: 'Valor gasto',
  linkClicks: 'Cliques',
  ctr: 'CTR',
  cpm: 'CPM',
};

export function FilterSidebar({
  filters,
  setFilters,
  groupBy,
  setGroupBy,
  columnVisibility,
  setColumnVisibility,
  uniqueAccounts,
  uniqueCampaigns,
  uniqueAdSets,
  onReset,
  onClearData,
}: FilterSidebarProps) {
  const [columnsOpen, setColumnsOpen] = useState(false);

  const groupOptions: { value: GroupByOption; label: string }[] = [
    { value: 'account', label: 'Conta' },
    { value: 'campaign', label: 'Campanha' },
    { value: 'adSet', label: 'Conjunto' },
    { value: 'ad', label: 'Anúncio' },
  ];

  const toggleColumn = (key: keyof ColumnVisibility) => {
    setColumnVisibility({
      ...columnVisibility,
      [key]: !columnVisibility[key],
    });
  };

  return (
    <aside className="w-72 bg-card border-l border-border p-5 overflow-y-auto scrollbar-thin">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Filtros</h2>
        </div>
        <button
          onClick={onReset}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
          title="Limpar filtros"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-5">
        {/* Date Range Filter */}
        <div className="border-b border-border pb-4">
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Período
          </p>
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-sm h-9"
                >
                  {filters.dateRange.start ? (
                    format(filters.dateRange.start, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span className="text-muted-foreground">Data inicial</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.dateRange.start || undefined}
                  onSelect={(date) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, start: date || null }
                  })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-sm h-9"
                >
                  {filters.dateRange.end ? (
                    format(filters.dateRange.end, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span className="text-muted-foreground">Data final</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.dateRange.end || undefined}
                  onSelect={(date) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, end: date || null }
                  })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Group By */}
        <div className="border-b border-border pb-4">
          <p className="text-sm font-medium text-foreground mb-3">Agrupar por</p>
          <div className="grid grid-cols-2 gap-2">
            {groupOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGroupBy(opt.value)}
                className={cn(
                  'px-3 py-2 text-xs font-medium rounded-lg transition-colors',
                  groupBy === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Column Visibility */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => setColumnsOpen(!columnsOpen)}
            className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground"
          >
            <span className="flex items-center gap-2">
              <Columns className="w-4 h-4 text-primary" />
              Colunas visíveis
            </span>
            {columnsOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          {columnsOpen && (
            <div className="mt-2 space-y-1">
              {(Object.keys(columnVisibility) as Array<keyof ColumnVisibility>).map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                >
                  <button
                    onClick={() => toggleColumn(key)}
                    className={cn(
                      "w-4 h-4 flex items-center justify-center rounded transition-colors",
                      columnVisibility[key] ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {columnVisibility[key] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <span className="text-sm text-foreground">
                    {columnLabels[key]}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Account Filter */}
        <FilterSection
          title="Conta de Anúncio"
          options={uniqueAccounts}
          selected={filters.accounts}
          onChange={(accounts) => setFilters({ ...filters, accounts })}
          defaultOpen={true}
        />

        {/* Campaign Filter */}
        <FilterSection
          title="Campanha"
          options={uniqueCampaigns}
          selected={filters.campaigns}
          onChange={(campaigns) => setFilters({ ...filters, campaigns })}
        />

        {/* Ad Set Filter */}
        <FilterSection
          title="Conjunto de Anúncios"
          options={uniqueAdSets}
          selected={filters.adSets}
          onChange={(adSets) => setFilters({ ...filters, adSets })}
        />

        {/* Clear Data */}
        <div className="pt-4">
          <button
            onClick={onClearData}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
          >
            <X className="w-4 h-4" />
            Remover dados
          </button>
        </div>
      </div>
    </aside>
  );
}
