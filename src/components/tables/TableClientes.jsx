import React, { useEffect, useState } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { FaEye, FaTrash, FaDownload, FaPencilAlt } from 'react-icons/fa'; // Importa los iconos necesarios

export default function TablesClientes() {
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        getTableData();
    }, []);

    const getTableData = async () => {
        const { data } = await clienteMongoAxios("/api/customers/getCustomers");
        setDatos(data);
    };

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
    };


    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                Nombre
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Documento
                            </th>
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                Telefono
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Total Abonado
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Total Comprado
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Deuda Actual
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((dato) => (
                            <tr key={dato.id}>
                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {dato.nombre}
                                    </h5>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="inline-flex rounded-full bg-meta-1 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-1">
                                        {dato.documento}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="inline-flex rounded-full bg-meta-8 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-8">
                                        {dato.telefono}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="inline-flex rounded-full bg-meta-8 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-8">
                                        {formatearPrecio(dato.total_payments)}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="inline-flex rounded-full bg-meta-8 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-8">
                                        {formatearPrecio(dato.total_sales)}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="inline-flex rounded-full bg-meta-8 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-8">
                                        {formatearPrecio(dato.deuda_actual)}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <div className="flex items-center space-x-3.5">
                                        <button className="bg-primary hover:bg-primary-dark text-white rounded-full p-2">
                                            <FaPencilAlt />
                                        </button>
                                        <button className="bg-red hover:bg-primary-dark text-white rounded-full p-2">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
