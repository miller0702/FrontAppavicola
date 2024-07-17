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
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencil } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';

export default function TablesInsumos() {
  const [datos, setDatos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState({});


  useEffect(() => {
    getTableData();
    fetchProveedores();
  }, []);

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


  const formatearFecha = (fecha) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  };

  const obtenerNombreProveedor = (proveedorId) => {
    const proveedor = proveedores.find((prov) => prov.id === proveedorId);
    return proveedor ? proveedor.nombre : 'Desconocido';
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };

  const abrirModalEdicion = (insumo) => {
    setSelectedInsumo(insumo);
    setModalIsOpen(true);
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setSelectedInsumo(null);
  };

  const editarInsumo = async (e) => {
    e.preventDefault();
    try {
      const { id, fecha, proveedor_id, preciocompra, descripcioncompra } = selectedInsumo;
      await clienteMongoAxios.put(`/api/supplies/update/${id}`, {
        fecha,
        proveedor_id,
        preciocompra,
        descripcioncompra,
      });
      getTableData();
      cerrarModal();
      toast.success('Insumo editado correctamente', {
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
      console.error('Error al editar el insumo:', error);
      toast.error('Error al editar el insumo', {
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

  const eliminarInsumo = async (id) => {
    try {
      await clienteMongoAxios.delete(`/api/supplies/delete/${id}`);
      setDatos(datos.filter(dato => dato.id !== id));
      toast.success('Insumo eliminado correctamente', {
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
      console.error('Error al eliminar el insumo:', error);
      toast.error('Error al eliminar el insumo', {
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

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <ToastContainer />
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
            {datos.map((dato) => (
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
                  <button className="bg-primary hover:bg-primary-dark text-white rounded-full p-2" onClick={() => abrirModalEdicion(dato)}>
                      <FaPencil />
                    </button>
                    <button className="bg-red hover:bg-primary-dark text-white rounded-full p-2" onClick={() => eliminarInsumo(dato.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edición */}
      <Dialog open={modalIsOpen} onClose={cerrarModal}>
        <form onSubmit={editarInsumo}>
          <DialogTitle>Editar Insumo</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Edita los detalles del insumo seleccionado.
            </DialogContentText>
            <FormControl fullWidth margin="normal">
                <InputLabel>Proveedor</InputLabel>
                <Select
                  value={selectedInsumo.proveedor_id || ''}
                  onChange={(e) =>
                    setSelectedInsumo({ ...selectedInsumo, proveedor_id: e.target.value })
                  }
                >
                  {proveedores.map((proveedor) => (
                    <MenuItem key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            <TextField
              margin="dense"
              id="preciocompra"
              label="Precio de Compra"
              type="number"
              fullWidth
              required
              value={selectedInsumo ? selectedInsumo.preciocompra : ''}
              onChange={(e) =>
                setSelectedInsumo({
                  ...selectedInsumo,
                  preciocompra: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              id="descripcioncompra"
              label="Descripción de Compra"
              type="text"
              fullWidth
              required
              value={selectedInsumo ? selectedInsumo.descripcioncompra : ''}
              onChange={(e) =>
                setSelectedInsumo({
                  ...selectedInsumo,
                  descripcioncompra: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={cerrarModal}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Guardar Cambios
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
