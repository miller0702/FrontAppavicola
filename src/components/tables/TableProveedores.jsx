import React, { useEffect, useState } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { FaEye, FaTrash, FaDownload, FaPencilAlt, FaSearch } from 'react-icons/fa';
import { Box, Button, InputAdornment, Modal, TextField } from '@mui/material';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';// Importa los iconos necesarios

export default function TablesProveedores() {
    const [datos, setDatos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [datosPorPagina] = useState(7);
    const [fechaBusqueda, setFechaBusqueda] = useState('');
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getTableData();
    }, []);

    useEffect(() => {
        filtrarDatos();
    }, [searchTerm, datos]);

    const filtrarDatos = () => {
        const term = searchTerm.toLowerCase();
        const filtered = datos.filter(dato =>
            dato.nombre.toLowerCase().includes(term) ||
            dato.documento.toLowerCase().includes(term) ||
            dato.telefono.toLowerCase().includes(term)
        );
        setDatosFiltrados(filtered);
    };

    const getTableData = async () => {
        try {
            const { data } = await clienteMongoAxios("/api/suppliers/getAll");
            setDatos(data);
            setDatosFiltrados(data);

        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    const handleDelete = async (id) => {
        try {
            await clienteMongoAxios.delete(`/api/suppliers/delete/${id}`);
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
            await clienteMongoAxios.put(`/api/suppliers/update/${currentRecord.id}`, currentRecord);
            getTableData();
            handleClose();
            toast.success('Registro actualizado con éxito');
        } catch (error) {
            console.error("Error updating data: ", error);
            toast.error('Error al actualizar el registro');
        }
    };


    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <ToastContainer />
            <TextField
                label="Buscar Proveedor"
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
                                        <div className="flex items-center space-x-3.5">
                                            <button
                                                onClick={() => handleEdit(dato)}
                                                className="bg-primary hover:bg-primary-dark text-white rounded-full p-2">
                                                <FaPencilAlt />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dato.id)}
                                                className="bg-red hover:bg-primary-dark text-white rounded-full p-2">
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
            <Modal open={open} onClose={handleClose} >
                <Box sx={{ ...modalStyle }} className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <h2>Editar Proveedor</h2>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Nombre"
                        name="nombre"
                        value={currentRecord.nombre}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Documento"
                        name="documento"
                        value={currentRecord.documento}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Teléfono"
                        name="telefono"
                        value={currentRecord.telefono}
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
