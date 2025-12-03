import { useCallback } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (content: string) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      readFile(file);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
  }, []);

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content);
    };
    reader.readAsText(file, 'UTF-8');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full max-w-lg p-12 border-2 border-dashed border-border rounded-2xl bg-card hover:border-primary/50 transition-colors"
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-accent rounded-xl mb-6">
            <FileSpreadsheet className="w-10 h-10 text-primary" />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Importar planilha Meta Ads
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Arraste o arquivo CSV ou clique para selecionar
          </p>
          
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium cursor-pointer hover:bg-primary/90 transition-colors">
            <Upload className="w-4 h-4" />
            Selecionar arquivo
            <input
              type="file"
              accept=".csv"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
