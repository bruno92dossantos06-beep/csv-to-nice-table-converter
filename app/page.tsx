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
      delimiter: ";",
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
    
    // Ajout d'une largeur minimale aux colonnes pour un rendu pro
    ws['!cols'] = headers.map(() => ({ wch: 20 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Données");
    
    // Génération du fichier avec une meilleure gestion des types
    XLSX.writeFile(wb, `${fileName.split('.')[0]}_export_pro.xlsx`);
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">DataConverter Pro</h1>
          <p className="text-slate-600">Interface de conversion de données certifiée.</p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>

        {data.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="font-semibold text-slate-700">Données extraites</h2>
              <button onClick={downloadExcel} className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition">
                Exporter Excel (.xlsx)
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>{headers.map(h => <th key={h} className="p-4 text-left font-bold text-slate-600 border-b">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {data.slice(0, 15).map((row, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
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