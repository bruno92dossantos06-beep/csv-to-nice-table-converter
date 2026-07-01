'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

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
          <h1 className="text-xl font-bold tracking-tight">Data<span className="text-blue-600">Converter</span> PRO</h1>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Accès Illimité</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 mb-12">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="fileInput" />
          <label htmlFor="fileInput" className="cursor-pointer inline-flex items-center justify-center bg-blue-600 text-white w-full py-4 rounded-xl font-bold hover:bg-blue-700 transition">
            {loading ? "Traitement en cours..." : "Importer votre CSV"}
          </label>
        </div>

        {data.length > 0 && (
          <div className="animate-in fade-in duration-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Toutes les données ({data.length} lignes)</h3>
              <button onClick={downloadExcel} className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition shadow-lg">
                Télécharger le fichier complet
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 uppercase text-[10px] font-bold text-slate-500">
                    <tr>{headers.map((h) => <th key={h} className="p-4 border-b">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        {headers.map((h) => <td key={h} className="p-4 text-slate-600">{row[h]}</td>)}
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