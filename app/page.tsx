'use client';
import { useState } from 'react';
import Papa from 'papaparse';

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

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* En-tête professionnel */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
            Data<span className="text-blue-600">Converter</span> Pro
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Transformez vos fichiers CSV en tableaux structurés en un clic.
          </p>
        </header>

        {/* Zone de dépôt */}
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100 text-center mb-12">
          <label className="block text-lg font-semibold text-slate-800 mb-6">
            Sélectionnez votre fichier CSV
          </label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="block w-full max-w-sm mx-auto text-sm text-slate-500 
            file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 
            file:text-sm file:font-bold file:bg-blue-600 file:text-white 
            hover:file:bg-blue-700 cursor-pointer transition-all"
          />
        </div>
        
        {/* Tableau de résultats */}
        {data.length > 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  {headers.map(h => (
                    <th key={h} className="p-4 text-slate-800 font-bold uppercase text-xs tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-blue-50/50 transition-colors">
                    {headers.map(h => (
                      <td key={h} className="p-4 text-slate-600 text-sm font-medium">
                        {row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}