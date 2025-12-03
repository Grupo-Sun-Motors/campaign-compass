import { Construction } from 'lucide-react';

export function GooglePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="p-4 bg-accent rounded-xl mb-6 inline-flex">
          <Construction className="w-10 h-10 text-primary" />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Google Ads em breve
        </h3>
        <p className="text-sm text-muted-foreground">
          A integração com planilhas do Google Ads será implementada em uma versão futura.
        </p>
      </div>
    </div>
  );
}
