import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { Dashboard } from '@/components/Dashboard';
import { GooglePlaceholder } from '@/components/GooglePlaceholder';
import { useCampaignData } from '@/hooks/useCampaignData';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'meta' | 'google'>('meta');
  const {
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
    hasData,
  } = useCampaignData();

  // Listen for import events from Dashboard
  useEffect(() => {
    const handleImport = (e: CustomEvent<string>) => {
      importCSV(e.detail);
    };
    window.addEventListener('importCSV', handleImport as EventListener);
    return () => window.removeEventListener('importCSV', handleImport as EventListener);
  }, [importCSV]);

  const handleRefresh = () => {
    // Reload from localStorage
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'meta' ? (
        hasData ? (
          <Dashboard
            metrics={metrics}
            groupedData={groupedData}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            filters={filters}
            setFilters={setFilters}
            uniqueAccounts={uniqueAccounts}
            uniqueCampaigns={uniqueCampaigns}
            uniqueAdSets={uniqueAdSets}
            onReset={resetFilters}
            onClearData={clearData}
            onRefresh={handleRefresh}
          />
        ) : (
          <FileUpload onFileUpload={importCSV} />
        )
      ) : (
        <GooglePlaceholder />
      )}
    </div>
  );
};

export default Index;
