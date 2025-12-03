import { cn } from '@/lib/utils';

interface HeaderProps {
  activeTab: 'meta' | 'google';
  onTabChange: (tab: 'meta' | 'google') => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-semibold text-foreground">
            Análise de Campanhas
          </h1>
          
          <nav className="flex gap-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => onTabChange('meta')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-all',
                activeTab === 'meta'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Meta Ads
            </button>
            <button
              onClick={() => onTabChange('google')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-all',
                activeTab === 'google'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Google Ads
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
