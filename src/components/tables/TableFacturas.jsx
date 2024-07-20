import React, { useEffect, useState } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { FaEye, FaFilePdf, FaPencilAlt, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TablesFacturas() {
    const [datos, setDatos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [datosPorPagina] = useState(7);

    useEffect(() => {
        getTableData();
        fetchClientes();
        fetchUsuarios();
    }, []);

    useEffect(() => {
        setPaginaActual(1);
    }, [datos]);

    const getTableData = async () => {
        try {
            const { data } = await clienteMongoAxios("/api/sale/getAll");
            setDatos(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchClientes = async () => {
        try {
            const response = await clienteMongoAxios.get('/api/customers/getAll');
            setClientes(response.data);
        } catch (error) {
            console.error('Error al obtener la lista de clientes', error);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await clienteMongoAxios.get('/api/users/getAll');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener la lista de usuarios', error);
        }
    };
    const formatearFecha = (fecha) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const date = new Date(fecha);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajusta la fecha a UTC
        return date.toLocaleDateString('es-CO', options);
    };


    const obtenerNombreUsuario = (usuarioId) => {
        const usuario = usuarios.find((prov) => prov.id === usuarioId);
        return usuario ? usuario.name : 'Desconocido';
    };

    const obtenerNombreCliente = (clienteId) => {
        const cliente = clientes.find((prov) => prov.id === clienteId);
        return cliente ? cliente.nombre : 'Desconocido';
    };

    const obtenerTelefonoCliente = (clienteId) => {
        const cliente = clientes.find((prov) => prov.id === clienteId);
        return cliente ? cliente.telefono : 'Desconocido';
    };

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
    };

    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };


    const descargarFactura = async (id) => {
        try {
            const response = await clienteMongoAxios.get(`/api/sale/${id}/invoice`, {
                responseType: 'blob',
            });

            if (response.status !== 200) {
                throw new Error(`Error al generar la factura: ${response.statusText}`);
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `factura_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success('Factura Descargada con Éxito', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'bg-white dark:bg-boxdark'
            });
        } catch (error) {
            toast.error('Error al Descargar Factura', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'bg-white dark:bg-boxdark text-black dark:text-white'
            });
            console.error('Error al descargar la factura:', error);
        }
    };

    const calcularTotalCanastas = (canastas) => {
        return canastas.reduce((acc, val) => acc + val, 0);
    };

    const obtenerCantidadKilos = (dato) => {
        const totalCanastasLlenas = calcularTotalCanastas(dato.canastas_llenas);
        const totalCanastasVacias = calcularTotalCanastas(dato.canastas_vacias);
        return totalCanastasLlenas - totalCanastasVacias;
    };

    const calcularTotal = (dato) => {
        const cantidadKilos = obtenerCantidadKilos(dato);
        return cantidadKilos * dato.preciokilo;
    };

    const enviarFacturaPorWhatsApp = async (id) => {
        try {
            const response = await clienteMongoAxios.get(`/api/sale/${id}/invoice`, {
                responseType: 'blob',
            });

            if (response.status !== 200) {
                throw new Error(`Error al generar la factura: ${response.statusText}`);
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const numeroTelefono = '3022997019';
            const mensaje = `Hola, aquí está la factura solicitada: ${url}`;
            const enlaceWhatsApp = crearEnlaceWhatsApp(numeroTelefono, mensaje);

            window.open(enlaceWhatsApp, '_blank');

            toast.success('Factura enviada por WhatsApp');
        } catch (error) {
            console.error('Error al enviar la factura por WhatsApp:', error);
            toast.error('Error al enviar la factura por WhatsApp');
        }
    };

    const crearEnlaceWhatsApp = (numeroTelefono, mensaje) => {
        return `https://api.whatsapp.com/send?phone=${numeroTelefono}&text=${encodeURIComponent(mensaje)}`;
    };



    const datosFiltrados = datos.slice((paginaActual - 1) * datosPorPagina, paginaActual * datosPorPagina);

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

            <ToastContainer />
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                Fecha
                            </th>
                            <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                                Cliente
                            </th>
                            <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                                Teléfono
                            </th>
                            <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                                Cantidad Aves
                            </th>
                            <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                                Cantidad Kilos
                            </th>
                            <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                                Precio Kilo
                            </th>
                            <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                                Total
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {datosFiltrados.map((dato) => (
                            <tr key={dato.id}>
                                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {formatearFecha(dato.fecha)}
                                    </h5>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                                        {obtenerNombreCliente(dato.cliente_id)}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="font-medium text-black dark:text-white">
                                        {obtenerTelefonoCliente(dato.cliente_id)}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                                        {dato.cantidadaves} Aves
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="inline-flex rounded-full bg-meta-8 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-8">
                                        {obtenerCantidadKilos(dato).toFixed(1)} Kg
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="inline-flex rounded-full bg-secondary bg-opacity-10 py-1 px-3 text-sm font-medium text-secondary">
                                        {formatearPrecio(dato.preciokilo)}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                                        {formatearPrecio(calcularTotal(dato))}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <div className="flex items-center space-x-3.5">
                                        <button
                                            onClick={() => enviarFacturaPorWhatsApp(dato.id)}
                                            className="bg-green hover:bg-green text-white rounded-full p-2">
                                            <FaWhatsapp />
                                        </button>
                                        <button className="bg-red hover:bg-primary-dark text-white rounded-full p-2">
                                            <FaTrash />
                                        </button>
                                        <button className="bg-primary hover:bg-primary-dark text-white rounded-full p-2">
                                            <FaPencilAlt />
                                        </button>
                                        <button
                                            onClick={() => descargarFactura(dato.id)}
                                            className="bg-meta-3 hover:bg-primary-dark text-white rounded-full p-2">
                                            <FaFilePdf />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Controles de Paginación */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark disabled:opacity-50"
                >
                    Anterior
                </button>
                <div className="flex items-center space-x-2">
                    <span>Página {paginaActual}</span>
                    <span>de</span>
                    <span>{Math.ceil(datos.length / datosPorPagina)}</span>
                </div>
                <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === Math.ceil(datos.length / datosPorPagina)}
                    className="py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div >
    );
}
