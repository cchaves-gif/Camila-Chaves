
import React from 'react';
import type { UserData } from '../types';

interface UserDataExportProps {
  data: UserData[];
}

const UserDataExport: React.FC<UserDataExportProps> = ({ data }) => {
  const downloadCSV = () => {
    if (data.length === 0) {
      alert("No hay datos para descargar.");
      return;
    }
    const headers = "Nombre,Email,Universidad\n";
    const rows = data.map(user =>
      `"${user.name}","${user.email}","${user.university}"`
    ).join("\n");
    const csvContent = headers + rows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "datos_jugadores_geosistemas.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-8 text-center">
        <button
          onClick={downloadCSV}
          disabled={data.length === 0}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          Descargar Datos de Jugadores (CSV)
        </button>
        {data.length > 0 && <p className="text-sm text-gray-400 mt-2">{data.length} registro(s) para descargar.</p>}
    </div>
  );
};

export default UserDataExport;
