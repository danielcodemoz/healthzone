import { FileText, FileDown, Download } from 'lucide-react';
import { exportToTxt, exportToPdf } from '../../utils/export';

interface Props {
  title: string;
  getData: () => { headers: string[]; rows: string[][] };
}

export default function ExportButtons({ title, getData }: Props) {
  const handleTxt = () => {
    const { headers, rows } = getData();
    exportToTxt(title, headers, rows);
  };

  const handlePdf = () => {
    const { headers, rows } = getData();
    exportToPdf(title, headers, rows);
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-surface-400 mr-1 hidden sm:inline">
        <Download size={12} className="inline mr-1" />Export:
      </span>
      <button
        onClick={handleTxt}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
          bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300
          hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
        aria-label="Export as TXT"
      >
        <FileText size={13} /> TXT
      </button>
      <button
        onClick={handlePdf}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
          bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400
          hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
        aria-label="Export as PDF"
      >
        <FileDown size={13} /> PDF
      </button>
    </div>
  );
}
