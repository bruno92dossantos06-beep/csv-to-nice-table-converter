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
      delimiter: ";", // Optimisé pour les exports Numbers/Excel français
      complete: (results: any) => {
        if (results.data && results.data.length > 0) {
          setHeaders(Object.keys(results.data[0]));
          setData(results.data);
        } else {
          alert("Le fichier semble vide.");
        }
      },
      error: (err: any) => {
        console.error("Erreur de parsing :", err);
      }
    });
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Données");
    XLSX.writeFile(wb, "DataConverter_Export.xlsx");
  };

  return (
    <main className="min-h-screen bg-white text-black p-10 font-sans">
      <header className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">DataConverter Pro</h1>
        <p className="text-gray-600">Transformez vos fichiers CSV en tableaux structurés en un clic.</p>
      </header>
      
      <div className="max-w-4xl mx-auto border-2 border-dashed border-gray-300 p-10 rounded-xl text-center bg-gray-50">
        <label className="block mb-4 font-semibold text-lg">Sélectionnez votre fichier CSV</label>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload} 
          className="block mx-auto" 
        />
        <p className="text-sm text-gray-500 mt-4 italic">
          {fileName ? `Fichier chargé : ${fileName}` : "Aucun fichier sélectionné"}
        </p>
      </div>

      {data.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10">
          <button 
            onClick={downloadExcel}
            className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-md transition-all"
          >
            Télécharger en format Excel (.xlsx)
          </button>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  {headers.map((h) => <th key={h} className="p-4 border-r">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    {headers.map((h) => <td key={h} className="p-4 border-r">{row[h]}</td>)}
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