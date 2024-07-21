import React, { useEffect, useState } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { FaEye, FaTrash, FaDownload, FaEdit } from 'react-icons/fa';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencil } from 'react-icons/fa6';

export default function TablesLote() {
  const [datos, setDatos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [datosPorPagina] = useState(7);

  useEffect(() => {
    getTableData();
    fetchProveedores();
  }, []);

  const getTableData = async () => {
    const { data } = await clienteMongoAxios("/api/lote/getAll");
    setDatos(data);
  };

  const fetchProveedores = async () => {
    try {
      const response = await clienteMongoAxios.get('/api/suppliers/getAll');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de proveedores', error);
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

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };

  const eliminarLote = async (id) => {
    try {
      await clienteMongoAxios.delete(`/api/lote/delete/${id}`);
      setDatos(datos.filter(dato => dato.id !== id));
      toast.success('Lote eliminado correctamente', {
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
      console.log(error);
      toast.error('Error al eliminar', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'bg-white dark:bg-boxdark text-black dark:text-white'
      });
    }
  };

  const abrirModalEdicion = (lote) => {
    setSelectedLote(lote);
    setModalIsOpen(true);
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setSelectedLote(null);
  };

  const editarLote = async (e) => {
    e.preventDefault();
    try {
      const { id, proveedor_id, descripcion, cantidad_aves, precio, fecha_llegada } = selectedLote;
      await clienteMongoAxios.put(`/api/lote/update/${id}`, {
        proveedor_id,
        descripcion,
        cantidad_aves,
        precio,
        fecha_llegada
      });
      getTableData();
      cerrarModal();
    } catch (error) {
      console.error('Error al editar el lote', error);
    }
  };

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };


  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <ToastContainer />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Proveedor</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Descripción</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Cantidad Aves</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Precio Aves</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Fecha Llegada</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((dato) => (
              <tr key={dato.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                <p className="inline-flex font-medium text-black dark:text-white">
                    {obtenerNombreProveedor(dato.proveedor_id)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="inline-flex font-medium text-black dark:text-white">
                    {dato.descripcion}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="inline-flex rounded-full bg-meta-8 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-8">
                    {dato.cantidad_aves} Aves
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="inline-flex rounded-full bg-meta-8 bg-opacity-10 py-1 px-3 text-sm font-medium text-meta-8">
                    {formatearPrecio(dato.precio)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="inline-flex font-medium text-black dark:text-white">
                    {formatearFecha(dato.fecha_llegada)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                  <button className="bg-primary hover:bg-primary-dark text-white rounded-full p-2" onClick={() => abrirModalEdicion(dato)}>
                      <FaPencil />
                    </button>
                    <button className="bg-red hover:bg-primary-dark text-white rounded-full p-2" onClick={() => eliminarLote(dato.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark disabled:opacity-50"
        >
          Anterior
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-meta-4">
            Página {paginaActual} de {Math.ceil(datos.length / datosPorPagina)}
          </span>
        </div>
        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === Math.ceil(datos.length / datosPorPagina)}
          className="py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>


      {/* Modal de Edición */}
      {modalIsOpen && selectedLote && (
        <Dialog open={modalIsOpen} onClose={cerrarModal}>
          <form onSubmit={editarLote}>
            <DialogTitle>Editar Lote</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Edite los detalles del lote seleccionado.
              </DialogContentText>
              <FormControl fullWidth margin="normal">
                <InputLabel>Proveedor</InputLabel>
                <Select
                  value={selectedLote.proveedor_id}
                  onChange={(e) => setSelectedLote({ ...selectedLote, proveedor_id: e.target.value })}
                >
                  {proveedores.map(proveedor => (
                    <MenuItem key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                label="Descripción"
                type="text"
                fullWidth
                value={selectedLote.descripcion}
                onChange={(e) => setSelectedLote({ ...selectedLote, descripcion: e.target.value })}
              />
              <TextField
                margin="normal"
                label="Cantidad Aves"
                type="number"
                fullWidth
                value={selectedLote.cantidad_aves}
                onChange={(e) => setSelectedLote({ ...selectedLote, cantidad_aves: e.target.value })}
              />
              <TextField
                margin="normal"
                label="Precio"
                type="number"
                fullWidth
                value={selectedLote.precio}
                onChange={(e) => setSelectedLote({ ...selectedLote, precio: e.target.value })}
              />
              <TextField
                margin="normal"
                label="Fecha Llegada"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={selectedLote.fecha_llegada}
                onChange={(e) => setSelectedLote({ ...selectedLote, fecha_llegada: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={cerrarModal} color="primary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                Guardar
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </div>
  );
}
