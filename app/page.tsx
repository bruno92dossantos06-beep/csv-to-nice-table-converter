'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Configuration : limite gratuite fixée à 50 lignes
  const MAX_FREE_ROWS = 50;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ";",
      complete: (results: any) => {
        if (results.data && results.data.length > 0) {
          setHeaders(Object.keys(results.data[0]));
          setData(results.data);
        }
        setLoading(false);
      }
    });
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = headers.map(() => ({ wch: 25 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Données");
    XLSX.writeFile(wb, `Export_${fileName.split('.')[0]}_Pro.xlsx`);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">Data<span className="text-blue-600">Converter</span> Pro</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4">Transformez vos fichiers CSV.</h2>
          <p className="text-lg text-slate-500">Rapide, précis et professionnel.</p>
        </div>

        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center bg-slate-50/50">
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="fileInput" />
            <label htmlFor="fileInput" className="cursor-pointer inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg">
              {loading ? "Traitement..." : "Importer un fichier CSV"}
            </label>
            <p className="mt-4 text-sm text-slate-400">{fileName || "Fichier .csv uniquement"}</p>
          </div>
        </div>

        {data.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-800">
                {data.length > MAX_FREE_ROWS 
                  ? `Limite atteinte (${data.length} lignes - Version Pro requise)` 
                  : `Prévisualisation (${data.length} lignes)`}
              </h3>

              {data.length <= MAX_FREE_ROWS ? (
                <button onClick={downloadExcel} className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg">
                  Télécharger Excel (.xlsx)
                </button>
              ) : (
                <a 
                  href="https://dataconverterpro.lemonsqueezy.com/checkout/buy/ee7cef94-5a34-4e25-b752-dc8e3a9694a4"
                  target="_blank"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg"
                >
                  Passer à Pro pour exporter
                </a>
              )}
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 uppercase text-[10px] tracking-widest font-bold text-slate-500">
                    <tr>{headers.map(h => <th key={h} className="p-4 border-b">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.slice(0, 10).map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        {headers.map(h => <td key={h} className="p-4 text-slate-600">{row[h]}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}