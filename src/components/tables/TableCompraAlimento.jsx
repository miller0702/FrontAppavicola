import React, { useEffect, useState } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { FaEye, FaTrash, FaDownload } from 'react-icons/fa';
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [datosPorPagina] = useState(7); // Número de registros por página

  useEffect(() => {
    getTableData();
  }, []);

  useEffect(() => {
    // Resetear a la primera página cuando se actualicen los datos
    setPaginaActual(1);
  }, [datos]);

  const getTableData = async () => {
    try {
      const { data } = await clienteMongoAxios("/api/buys/getAll");
      setDatos(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatearFecha = (fecha) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(fecha);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajusta la fecha a UTC
    return date.toLocaleDateString('es-CO', options);
};

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };

  const obtenerTextoTipoPurina = (tipoPurina) => {
    return tipoPurinaTextos[tipoPurina] || 'Desconocido';
  };

  const obtenerLugarProcedencia = (lugarProcedencia) => {
    return lugarProcedenciaTextos[lugarProcedencia] || 'Desconocido';
  };

  const abrirModalEdicion = (compra) => {
    setSelectedCompra(compra);
    setModalIsOpen(true);
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setSelectedCompra(null);
  };

  // Función para cambiar la página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  // Datos filtrados para paginación
  const datosFiltrados = datos.slice((paginaActual - 1) * datosPorPagina, paginaActual * datosPorPagina);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <ToastContainer />
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
            {datosFiltrados.map((dato) => (
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
                    <button className="bg-meta-5 hover:bg-primary-dark text-white rounded-full p-2" onClick={() => {}}>
                      <FaEye />
                    </button>
                    <button className="bg-primary hover:bg-primary-dark text-white rounded-full p-2" onClick={() => abrirModalEdicion(dato)}>
                      <FaPencil />
                    </button>
                    <button className="bg-red hover:bg-primary-dark text-white rounded-full p-2" onClick={() => {}}>
                      <FaTrash />
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
      <Dialog open={modalIsOpen} onClose={cerrarModal}>
        <DialogTitle>Editar Compra de Alimento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edita los detalles de la compra seleccionada.
          </DialogContentText>
          {/* Aquí va el formulario de edición */}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal}>Cancelar</Button>
          <Button variant="contained" color="primary">Guardar Cambios</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
