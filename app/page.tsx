'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ";", // Force la lecture des CSV type Numbers/Excel FR
      complete: (results: any) => {
        if (results.data && results.data.length > 0) {
          setHeaders(Object.keys(results.data[0]));
          setData(results.data);
        }
      }
    });
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Formatage professionnel des colonnes (largeur auto)
    ws['!cols'] = headers.map(() => ({ wch: 25 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Données");
    
    XLSX.writeFile(wb, `${fileName.split('.')[0]}_export_pro.xlsx`);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">DataConverter <span className="text-blue-600">Pro</span></h1>
          <p className="text-slate-500 text-lg">Convertisseur CSV vers Excel haut de gamme.</p>
        </header>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col items-center border-2 border-dashed border-slate-300 rounded-xl py-12 bg-slate-50">
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="fileInput" />
            <label htmlFor="fileInput" className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md">
              Choisir un fichier CSV
            </label>
            <p className="text-slate-400 text-sm mt-4">{fileName || "Aucun fichier sélectionné"}</p>
          </div>
        </div>

        {data.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800">Données extraites</h2>
              <button onClick={downloadExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-all">
                Télécharger Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-widest">
                  <tr>{headers.map(h => <th key={h} className="p-4">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.slice(0, 15).map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/80">
                      {headers.map(h => <td key={h} className="p-4 text-slate-700">{row[h]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}