'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length > 0) {
            setHeaders(Object.keys(results.data[0] as object));
            setData(results.data);
          }
        },
      });
    }
  };

  // Fonction pour télécharger le fichier Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donnees");
    XLSX.writeFile(workbook, "DataConverter_Pro.xlsx");
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
            Data<span className="text-blue-600">Converter</span> Pro
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Transformez vos fichiers CSV en tableaux et exportez-les en Excel.
          </p>
        </header>

        <div className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100 text-center mb-12">
          <label className="block text-lg font-semibold text-slate-800 mb-6">
            Sélectionnez votre fichier CSV
          </label>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="block w-full max-w-sm mx-auto text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer transition-all" />
        </div>
        
        {data.length > 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Prévisualisation</h2>
              <button 
                onClick={downloadExcel}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl transition-all"
              >
                Télécharger en Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    {headers.map(h => <th key={h} className="p-4 text-slate-800 font-bold uppercase text-xs tracking-widest">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-blue-50/50 transition-colors">
                      {headers.map(h => <td key={h} className="p-4 text-slate-600 text-sm">{row[h]}</td>)}
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