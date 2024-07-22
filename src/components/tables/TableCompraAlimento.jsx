import React, { useEffect, useState } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { FaEye, FaTrash, FaDownload, FaPencilAlt } from 'react-icons/fa';
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
  Grid,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencil } from 'react-icons/fa6';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const tipoPurinaTextos = {
  P: 'Preiniciador',
  I: 'Iniciador',
  Q: 'Eng. Quebrantada',
  E: 'Engorde',
};

const lugarProcedenciaTextos = {
  Ocana: 'Ocaña, Norte de Santander',
  Bucaramanga: 'Bucaramanga, Santander',
};

export default function TablesCompraAlimento() {
  const [datos, setDatos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [datosPorPagina] = useState(7);
  const [sortOrder, setSortOrder] = useState('desc');
  const [fechaBusqueda, setFechaBusqueda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [currentRecord, setCurrentRecord] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getTableData();
    fetchProveedores();
    fetchLotes();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [datos]);

  useEffect(() => {
    filtrarPorFecha();
  }, [fechaBusqueda, datos, sortOrder])

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

  const getTableData = async () => {
    try {
      const { data } = await clienteMongoAxios("/api/buys/getAll");
      setDatos(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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

  const formatearFecha = (fecha) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(fecha);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString('es-CO', options);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };

  const obtenerNombreProveedor = (proveedorId) => {
    const proveedor = proveedores.find((prov) => prov.id === proveedorId);
    return proveedor ? proveedor.nombre : 'Desconocido';
  };

  const obtenerNombreLote = (loteId) => {
    const lote = lotes.find((lot) => lot.id === loteId);
    return lote ? lote.descripcion : 'Desconocido';
  };

  const obtenerTextoTipoPurina = (tipoPurina) => {
    return tipoPurinaTextos[tipoPurina] || 'Desconocido';
  };

  const obtenerLugarProcedencia = (lugarProcedencia) => {
    return lugarProcedenciaTextos[lugarProcedencia] || 'Desconocido';
  };

  const handleDelete = async (id) => {
    try {
      await clienteMongoAxios.delete(`/api/buys/delete/${id}`);
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
      await clienteMongoAxios.put(`/api/buys/update/${currentRecord.id}`, currentRecord);
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


  const handleFechaBusquedaChange = (date) => {
    setFechaBusqueda(date);
  };

  const limpiarFiltroFecha = () => {
    setFechaBusqueda(null);
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
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Fecha
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Procedencia
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Tipo
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Cantidad
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Valor Unitario
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Valor Bultos
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Valor con Flete
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
                    <p className="font-medium text-black dark:text-white">
                      {formatearFecha(dato.fecha)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      Ciudad: {obtenerLugarProcedencia(dato.procedencia)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      Purina {obtenerTextoTipoPurina(dato.tipo_purina)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-meta-3 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-3">
                      {dato.cantidad_bultos} Bultos
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-meta-5 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-5">
                      {formatearPrecio(dato.valor_unitario)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-meta-6 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-6">
                      {formatearPrecio(dato.valor_bultos)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-meta-8 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-8">
                      {formatearPrecio(dato.valor_con_flete)}
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

        <Grid container spacing={2}>
          {/* Fila 1 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Fecha Llegada"
                  value={currentRecord.fecha}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  format='dd-MM-yyyy'
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Lote</InputLabel>
              <Select
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
          </Grid>

          {/* Fila 2 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Proveedor</InputLabel>
              <Select
                name="proveedor_id"
                value={currentRecord.proveedor_id || ''}
                onChange={handleChange}
                label="Proveedor"
              >
                {proveedores.map(proveedor => (
                  <MenuItem key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de Purina</InputLabel>
              <Select
                name="tipo_purina"
                value={currentRecord.tipo_purina || ''}
                onChange={handleChange}
              >
                {Object.keys(tipoPurinaTextos).map((key) => (
                  <MenuItem key={key} value={key}>
                    {tipoPurinaTextos[key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Fila 3 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Procedencia</InputLabel>
              <Select
                name="procedencia"
                value={currentRecord.procedencia || ''}
                onChange={handleChange}
              >
                <MenuItem value="Ocana">Ocaña, Norte de Santander</MenuItem>
                <MenuItem value="Bucaramanga">Bucaramanga, Santander</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='number'
              label="Cantidad Bultos"
              name="cantidad_bultos"
              value={currentRecord.cantidad_bultos || ''}
              onChange={(e) => {
                handleChange(e);
                const cantidadBultos = e.target.value;
                const valorUnitario = currentRecord.valor_unitario || 0;
                setCurrentRecord(prev => ({
                  ...prev,
                  valor_bultos: cantidadBultos * valorUnitario
                }));
              }}
              margin="normal"
            />
          </Grid>

          {/* Fila 4 */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='number'
              label="Valor Unitario"
              name="valor_unitario"
              value={currentRecord.valor_unitario || ''}
              onChange={(e) => {
                handleChange(e);
                const valorUnitario = e.target.value;
                const cantidadBultos = currentRecord.cantidad_bultos || 0;
                setCurrentRecord(prev => ({
                  ...prev,
                  valor_bultos: cantidadBultos * valorUnitario
                }));
              }}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='number'
              label="Valor Flete"
              name="valor_flete"
              value={currentRecord.valor_flete || ''}
              onChange={(e) => {
                handleChange(e);
                const valorFlete = e.target.value;
                setCurrentRecord(prev => ({
                  ...prev,
                  valor_con_flete: (prev.valor_bultos || 0) + valorFlete
                }));
              }}
              margin="normal"
            />
          </Grid>

          {/* Fila 5 */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='number'
              label="Valor Bultos"
              name="valor_bultos"
              value={currentRecord.valor_bultos || ''}
              onChange={(e) => handleChange(e)}
              margin="normal"
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='number'
              label="Valor con Flete"
              name="valor_con_flete"
              value={currentRecord.valor_con_flete || ''}
              onChange={(e) => handleChange(e)}
              margin="normal"
              disabled
            />
          </Grid>
        </Grid>

        <button 
          onClick={handleSave}
          className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1 mt-5 w-full"
        >
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
  bgcolor: 'background.paper',
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
};

