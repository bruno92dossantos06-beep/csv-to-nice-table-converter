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
      },
      error: (err: any) => {
        console.error("Erreur :", err);
      }
    });
  };

  // Fonction de téléchargement Excel
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Données");
    XLSX.writeFile(wb, "DataConverter_Export.xlsx");
  };

  return (
    <main className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">DataConverter Pro</h1>
      
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload} 
          className="block mx-auto" 
        />
        <p className="text-sm text-gray-500 mt-2">
          {fileName ? `Fichier chargé : ${fileName}` : "Sélectionnez votre CSV"}
        </p>
      </div>

      {data.length > 0 && (
        <div className="mt-8">
          {/* Le Bouton de Téléchargement */}
          <button 
            onClick={downloadExcel}
            className="mb-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all"
          >
            Télécharger en Excel (.xlsx)
          </button>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100">
                <tr>
                  {headers.map((h) => <th key={h} className="p-3 border">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-t">
                    {headers.map((h) => <td key={h} className="p-3 border">{row[h]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}