import React, { useState, useEffect } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';

export default function TableEnfermedades() {
  const [enfermedades, setEnfermedades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getTableData();
  }, []);

  const getTableData = async () => {
    try {
      const response = await clienteMongoAxios.get('/api/diseases/getAll');
      setEnfermedades(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de enfermedades', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredEnfermedades = enfermedades.filter((enfermedad) => {
    return (
      enfermedad.nombre.toLowerCase().includes(searchTerm) ||
      enfermedad.sintomas.toLowerCase().includes(searchTerm) ||
      enfermedad.tratamiento.toLowerCase().includes(searchTerm) ||
      enfermedad.prevencion.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 w-full rounded-md border border-gray-300 p-2"
      />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Nombre
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Síntomas
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Tratamiento
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Prevención
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEnfermedades.map((enfermedad) => (
              <tr key={enfermedad.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {enfermedad.nombre}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                    {enfermedad.sintomas}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                    {enfermedad.tratamiento}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="inline-flex rounded-full bg-secondary bg-opacity-10 py-1 px-3 text-sm font-medium text-secondary">
                    {enfermedad.prevencion}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
