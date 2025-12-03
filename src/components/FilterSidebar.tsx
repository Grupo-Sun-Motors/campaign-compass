import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X, RotateCcw } from 'lucide-react';
import { FilterState, GroupByOption } from '@/types/campaign';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  groupBy: GroupByOption;
  setGroupBy: (groupBy: GroupByOption) => void;
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
}

function FilterSection({ title, options, selected, onChange }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

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

export function FilterSidebar({
  filters,
  setFilters,
  groupBy,
  setGroupBy,
  uniqueAccounts,
  uniqueCampaigns,
  uniqueAdSets,
  onReset,
  onClearData,
}: FilterSidebarProps) {
  const groupOptions: { value: GroupByOption; label: string }[] = [
    { value: 'account', label: 'Conta' },
    { value: 'campaign', label: 'Campanha' },
    { value: 'adSet', label: 'Conjunto' },
    { value: 'ad', label: 'Anúncio' },
  ];

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

        {/* Account Filter */}
        <FilterSection
          title="Conta de Anúncio"
          options={uniqueAccounts}
          selected={filters.accounts}
          onChange={(accounts) => setFilters({ ...filters, accounts })}
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
