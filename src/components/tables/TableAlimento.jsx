import React, { useEffect, useState } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { FaEye, FaTrash, FaDownload, FaPencilAlt, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function TablesAlimento() {
    const [datos, setDatos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [datosPorPagina] = useState(7);
    const [fechaBusqueda, setFechaBusqueda] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState({});
    const [sortOrder, setSortOrder] = useState('desc');
    const [lotes, setLotes] = useState([]);

    useEffect(() => {
        getTableData();
        fetchLotes();
    }, []);

    useEffect(() => {
        filtrarDatos();
    }, [fechaBusqueda, busqueda, datos, sortOrder]);

    const getTableData = async () => {
        try {
            const { data } = await clienteMongoAxios("/api/food/getAll");
            setDatos(data);
            setDatosFiltrados(data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const formatearFecha = (fecha) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const date = new Date(fecha);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date.toLocaleDateString('es-CO', options);
    };

    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    const filtrarDatos = () => {
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

    const handleDelete = async (id) => {
        try {
            await clienteMongoAxios.delete(`/api/food/delete/${id}`);
            setDatos(datos.filter(dato => dato.id !== id));
            setDatosFiltrados(datosFiltrados.filter(dato => dato.id !== id));
            toast.success('Registro eliminado con éxito');
        } catch (error) {
            console.error("Error deleting data: ", error);
            toast.error('Error al eliminar el registro');
        }
    };

    const handleEdit = (dato) => {
        setCurrentRecord(dato);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentRecord({ ...currentRecord, [name]: value });
    };

    const handleDateChange = (newDate) => {
        setCurrentRecord({ ...currentRecord, fecha: newDate });
    };

    const handleSave = async () => {
        try {
            await clienteMongoAxios.put(`/api/food/update/${currentRecord.id}`, currentRecord);
            getTableData();
            handleClose();
            toast.success('Registro actualizado con éxito');
        } catch (error) {
            console.error("Error updating data: ", error);
            toast.error('Error al actualizar el registro');
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const obtenerNombreLote = (loteId) => {
        const lote = lotes.find((lot) => lot.id === loteId);
        return lote ? lote.descripcion : 'Desconocido';
    };

    const fetchLotes = async () => {
        try {
            const response = await clienteMongoAxios.get('/api/lote/getAll');
            setLotes(response.data);
        } catch (error) {
            console.error('Error al obtener la lista de lotes', error);
        }
    };

    const limpiarFiltroFecha = () => {
        setFechaBusqueda(null);
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <ToastContainer />
            <div className="flex justify-between mb-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        format='dd-MM-yyyy'
                        label="Buscar por Fecha"
                        value={fechaBusqueda}
                        onChange={(newValue) => setFechaBusqueda(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                            />
                        )}
                    />
                </LocalizationProvider>
                <button
                    className="px-4 py-2 mx-1 bg-primary text-white rounded h-10"
                    onClick={limpiarFiltroFecha}
                >
                    Limpiar Filtro
                </button>
            </div>
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                Fecha
                                <button onClick={toggleSortOrder} className="ml-2">
                                    {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                </button>
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Lote
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Hembras
                            </th>
                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                Machos
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
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <p className="inline-flex font-medium text-black dark:text-white">
                                            {obtenerNombreLote(dato.lote_id)}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="inline-flex rounded-full bg-meta-1 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-1">
                                            {dato.cantidadhembra} Bultos
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="inline-flex rounded-full bg-meta-8 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-8">
                                            {dato.cantidadmacho} Bultos
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button
                                                onClick={() => handleEdit(dato)}
                                                className="bg-primary hover:bg-primary-dark text-white rounded-full p-2"
                                            >
                                                <FaPencilAlt />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dato.id)}
                                                className="bg-danger hover:bg-danger-dark text-white rounded-full p-2"
                                            >
                                                <FaTrash />
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
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ ...modalStyle }} className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <h1 className='text-title-lg font-bold mb-5'>Editar Registro</h1>
                    <LocalizationProvider dateAdapter={AdapterDateFns}
                        className='text-black dark:text-white w-full'>
                        <DatePicker
                            label="Fecha"
                            className='text-black dark:text-white w-full'
                            value={currentRecord.fecha}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" className='text-black dark:text-white' />}
                            format='dd-MM-yyyy'
                        />
                    </LocalizationProvider>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Lote</InputLabel>
                        <Select
                            className='text-black dark:text-white'
                            name="lote_id"
                            value={currentRecord.lote_id || ''}
                            onChange={handleChange}
                            label="Lote"
                        >
                            {lotes.map(lote => (
                                <MenuItem key={lote.id} value={lote.id}>
                                    {lote.descripcion}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <input
                        className="mb-2 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        margin="normal"
                        label="Hembras"
                        name="cantidadhembra"
                        value={currentRecord.cantidadhembra}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        margin="normal"
                        fullWidth
                        label="Machos"
                        name="cantidadmacho"
                        value={currentRecord.cantidadmacho}
                        onChange={handleChange}
                    />
                    <button onClick={handleSave} className="w-full mt-5 flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1">
                        Guardar
                    </button>
                </Box>
            </Modal>
        </div>
    );
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
};
