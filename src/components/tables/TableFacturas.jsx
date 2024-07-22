import React, { useEffect, useState } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { FaEraser, FaEye, FaFilePdf, FaFilter, FaPencilAlt, FaSearch, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InputAdornment, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import 'react-toastify/dist/ReactToastify.css';

export default function TablesFacturas() {
    const [datos, setDatos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [datosPorPagina] = useState(7);
    const [searchTerm, setSearchTerm] = useState('');
    const [fechaBusqueda, setFechaBusqueda] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        filtrarDatos();
    }, [searchTerm, datos]);

    useEffect(() => {
        getTableData();
        fetchClientes();
        fetchUsuarios();
    }, []);

    useEffect(() => {
        filtrarDatosFecha();
    }, [fechaBusqueda, busqueda, datos, sortOrder]);

    useEffect(() => {
        setPaginaActual(1);
    }, [datos]);

    const filtrarDatos = () => {
        const term = searchTerm.toLowerCase();
        const filtered = datos.filter(dato => {
            const cliente = clientes.find(cliente => cliente.id === dato.cliente_id);
            const nombre = cliente ? cliente.nombre.toLowerCase() : '';
            const telefono = cliente ? cliente.telefono.toLowerCase() : '';
            return nombre.includes(term) || telefono.includes(term);
        });
        setDatosFiltrados(filtered);
    };

    const filtrarDatosFecha = () => {
        let datosFiltrados = datos;

        if (fechaBusqueda) {
            datosFiltrados = datosFiltrados.filter(dato =>
                new Date(dato.fecha).toDateString() === new Date(fechaBusqueda).toDateString()
            );
        }

        if (busqueda) {
            datosFiltrados = datosFiltrados.filter(dato =>
                Object.values(dato).some(value =>
                    value.toString().toLowerCase().includes(busqueda.toLowerCase())
                )
            );
        }

        datosFiltrados = datosFiltrados.sort((a, b) => {
            return sortOrder === 'asc' ? new Date(a.fecha) - new Date(b.fecha) : new Date(b.fecha) - new Date(a.fecha);
        });

        setDatosFiltrados(datosFiltrados);
    };

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
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
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

    const limpiarFiltroFecha = () => {
        setFechaBusqueda(null);
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

            <ToastContainer />
            <div className="flex justify-between items-center mb-4">
                <TextField
                    label="Buscar Cliente"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FaSearch />
                            </InputAdornment>
                        ),
                    }}
                />
                <div className="flex items-center space-x-2">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            format="dd-MM-yyyy"
                            label="Buscar por Fecha"
                            value={fechaBusqueda}
                            onChange={(date) => setFechaBusqueda(date)}
                            renderInput={(params) => (
                                <TextField {...params} margin="normal" />
                            )}
                        />
                    </LocalizationProvider>
                    <button
                        className="px-4 py-4 bg-primary text-white rounded"
                        onClick={limpiarFiltroFecha}
                    >
                        <FaEraser/>
                    </button>
                </div>
            </div>



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
                        {datosFiltrados
                            .slice((paginaActual - 1) * datosPorPagina, paginaActual * datosPorPagina)
                            .map((dato) => (
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
            <div className="flex justify-between items-center mt-4 mb-4">
                <div>
                    <span>Mostrar {datosFiltrados.length} resultados</span>
                </div>
                <div>
                    <button
                        className="px-4 py-2 mx-1 bg-primary text-white rounded"
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                    >
                        Anterior
                    </button>
                    <button
                        className="px-4 py-2 mx-1 bg-primary text-white rounded"
                        onClick={() => cambiarPagina(paginaActual + 1)}
                        disabled={paginaActual === Math.ceil(datosFiltrados.length / datosPorPagina)}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div >
    );
}
