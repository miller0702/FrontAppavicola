import React, { useEffect, useState } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { FaBox, FaBuilding, FaDollarSign, FaCalendarAlt, FaUniversity } from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FormLote() {
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedorId, setSelectedProveedorId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidadAves, setCantidadAves] = useState('');
  const [precio, setPrecio] = useState(0);
  const [fechaLlegada, setFechaLlegada] = useState('');

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await clienteMongoAxios.get('/api/suppliers/getAll');
        setProveedores(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de proveedores', error);
        toast.error('Error al obtener la lista de proveedores', {
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
    fetchProveedores();
  }, []);

  const registrar = async () => {
    try {
      const { data } = await clienteMongoAxios.post('/api/lote/register', {    
        proveedor_id: selectedProveedorId,
        descripcion: descripcion,
        cantidad_aves: cantidadAves,
        precio: precio,
        fecha_llegada: fechaLlegada});
      console.log(data);
      toast.success('Registro exitoso', {
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
      toast.error('Error al registrar', {
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
    <>
      <h1 className='text-title-lg font-bold'>Registro de Lotes</h1>
      <ToastContainer />
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaUniversity className="inline-block mr-2" /> Proveedor</label>
        <select
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={selectedProveedorId}
          onChange={(e) => setSelectedProveedorId(e.target.value)}
        >
          <option value="">Selecciona un proveedor</option>
          {proveedores.map((proveedor) => (
            <option key={proveedor.id} value={proveedor.id}>
              {proveedor.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          <FaBox className="inline-block mr-2" />
          Descripción Lote
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Ingrese aquí el nombre del lote completo"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          <FaBuilding className="inline-block mr-2" />
          Cantidad Aves
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Ingrese aquí la empresa donde proceden las aves"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={cantidadAves}
            onChange={e => setCantidadAves(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          <FaDollarSign className="inline-block mr-2" />
          Precio
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="Ingrese aquí el precio"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          <FaCalendarAlt className="inline-block mr-2" />
          Fecha de Llegada
        </label>
        <div className="relative">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Seleccione la fecha de llegada"
              value={fechaLlegada}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              onChange={date => setFechaLlegada(date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </div>
      </div>
      <button
        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
        onClick={registrar}
      >
        Guardar
      </button>
    </>
  );
}
