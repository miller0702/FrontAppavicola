import React, { useEffect, useState } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Box,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencil, FaTrash } from 'react-icons/fa6';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FaPencilAlt } from 'react-icons/fa';

export default function TablesInsumos() {
  const [datos, setDatos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const [lotes, setLotes] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [fechaBusqueda, setFechaBusqueda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [datosPorPagina] = useState(7);

  useEffect(() => {
    getTableData();
    fetchProveedores();
    fetchLotes();
  }, []);


  useEffect(() => {
    filtrarPorFecha();
  }, [fechaBusqueda, datos, sortOrder]);


  useEffect(() => {
    setPaginaActual(1);
  }, [datos]);

  const filtrarPorFecha = () => {
    let datosFiltrados = fechaBusqueda ? datos.filter(dato => {
      const fechaDato = new Date(dato.fecha);
      return fechaDato.toDateString() === fechaBusqueda.toDateString();
    }) : datos;

    datosFiltrados = datosFiltrados.sort((a, b) => {
      return sortOrder === 'asc' ? new Date(a.fecha) - new Date(b.fecha) : new Date(b.fecha) - new Date(a.fecha);
    });
    setDatosFiltrados(datosFiltrados);
  };

  const handleFechaBusquedaChange = (date) => {
    setFechaBusqueda(date);
  };

  const limpiarFiltroFecha = () => {
    setFechaBusqueda(null);
  };

  const getTableData = async () => {
    try {
      const { data } = await clienteMongoAxios("/api/supplies/getAll");
      setDatos(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await clienteMongoAxios.get('/api/suppliers/getAll');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de proveedores', error);
    }
  };

  const fetchLotes = async () => {
    try {
      const response = await clienteMongoAxios.get('/api/lote/getAll');
      setLotes(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de lotes', error);
    }
  };


  const formatearFecha = (fecha) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(fecha);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajusta la fecha a UTC
    return date.toLocaleDateString('es-CO', options);
  };

  const obtenerNombreProveedor = (proveedorId) => {
    const proveedor = proveedores.find((prov) => prov.id === proveedorId);
    return proveedor ? proveedor.nombre : 'Desconocido';
  };

  const obtenerNombreLote = (loteId) => {
    const lote = lotes.find((lot) => lot.id === loteId);
    return lote ? lote.descripcion : 'Desconocido';
  };


  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };

  const handleDelete = async (id) => {
    try {
      await clienteMongoAxios.delete(`/api/supplies/delete/${id}`);
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
      await clienteMongoAxios.put(`/api/supplies/update/${currentRecord.id}`, currentRecord);
      getTableData();
      handleClose();
      toast.success('Registro actualizado con éxito');
    } catch (error) {
      console.error("Error updating data: ", error);
      toast.error('Error al actualizar el registro');
    }
  };

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <ToastContainer />
      <div className="mb-4 flex justify-between items-center">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            format='dd-MM-yyyy'
            label="Buscar por Fecha"
            value={fechaBusqueda}
            onChange={handleFechaBusquedaChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
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
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Fecha
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Proveedor
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Precio De la Compra
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Descripcion de la Compra
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
                    <p className="inline-flex font-medium text-black dark:text-white">
                      {obtenerNombreProveedor(dato.proveedor_id)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-meta-1 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-1">
                      {formatearPrecio(dato.preciocompra)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white capitalize">
                      {dato.descripcioncompra}
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

      <div className="flex justify-between items-center mt-4  mb-4">
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
          <LocalizationProvider dateAdapter={AdapterDateFns} className='text-black dark:text-white w-full'>
            <DatePicker
              label="Fecha Llegada"
              className='text-black dark:text-white w-full'
              value={currentRecord.fecha}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" className='text-black dark:text-white w-full' />}
              format='dd-MM-yyyy'
            />
          </LocalizationProvider>
          <FormControl fullWidth margin="normal">
            <InputLabel >Lote</InputLabel>
            <Select
              name="lote_id"
              value={currentRecord.lote_id || ''}
              onChange={handleChange}
              label="Lote"
              className='text-black dark:text-white w-full'
            >
              {lotes.map(lote => (
                <MenuItem key={lote.id} value={lote.id}>
                  {lote.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Proveedor</InputLabel>
            <Select
              name="proveedor_id"
              value={currentRecord.proveedor_id || ''}
              onChange={handleChange}
              label="Proveedor"
              className='text-black dark:text-white w-full'
            >
              {proveedores.map(proveedor => (
                <MenuItem key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input
            className="mb-2 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            margin="normal"
            fullWidth
            label="Descripción Lote"
            name="descripcioncompra"
            value={currentRecord.descripcioncompra}
            onChange={handleChange}
          />
          <input
            className="mb-2 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            margin="normal"
            fullWidth
            type='number'
            label="Precio"
            name="preciocompra"
            value={currentRecord.preciocompra}
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
