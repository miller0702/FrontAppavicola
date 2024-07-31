import React, { useState, useEffect } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaAudioDescription, FaCalendarAlt, FaDollarSign, FaThList, FaUniversity } from 'react-icons/fa';
import { format } from 'date-fns';

export default function FormInsumos() {
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedorId, setSelectedProveedorId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [fecha, setFecha] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [selectedLoteId, setSelectedLoteId] = useState('');

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await clienteMongoAxios.get('/api/lote/getAllActive');
        setLotes(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de lotes', error);
      }
    };
    fetchLotes();
  }, []);

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
      const { data } = await clienteMongoAxios.post('/api/supplies/register', {
        proveedor_id: selectedProveedorId,
        lote_id: selectedLoteId,
        descripcioncompra: descripcion,
        preciocompra: precio,
        fecha: fecha
      });
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

      setSelectedProveedorId('');
      setSelectedLoteId('');
      setDescripcion('');
      setPrecio(0);
      setFecha(null);

    } catch (error) {
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
      <h1 className='text-title-lg font-bold'>Registro de Insumos</h1>
      <ToastContainer />
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaThList className="inline-block mr-2" /> Lote</label>
        <select
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={selectedLoteId}
          onChange={(e) => setSelectedLoteId(e.target.value)}
        >
          <option value="">Selecciona un lote</option>
          {lotes.map((lote) => (
            <option key={lote.id} value={lote.id}>
              {lote.descripcion}
            </option>
          ))}
        </select>
      </div>
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
        <label className="mb-3 block text-black dark:text-white"><FaAudioDescription className="inline-block mr-2" /> Descripción de la Compra</label>
        <input
          type="text"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaDollarSign className="inline-block mr-2" /> Precio de la Compra</label>
        <input
          type="number"
          placeholder="Ingrese el precio"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          <FaCalendarAlt className="inline-block mr-2" />
          Fecha de Compra
        </label>
        <div className="relative">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Seleccione la fecha"
              value={fecha}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              onChange={(newValue) => setFecha(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              format='dd-MM-yyyy'
            />
          </LocalizationProvider>
        </div>
      </div>
      <button
        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
        onClick={() => registrar()}
      >
        Guardar
      </button>
    </>
  );
}
