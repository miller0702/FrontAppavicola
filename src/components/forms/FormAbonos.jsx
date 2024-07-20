import React, { useState, useEffect } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { generarNumeroAleatorio } from '../../util/herreamientas';
import { Button, TextField } from '@mui/material';
import { FaCalendar, FaUser, FaPlus, FaTrash, FaSortNumericDown, FaBox, FaDollarSign, FaThList } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function FormFactura() {
  const { usuario } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [lotes, setLotes] = useState([]);
  const [selectedLoteId, setSelectedLoteId] = useState('');
  const { name, _id } = usuario[0];
  const [vendedorId, setVendedorId] = useState(_id || '');
  const [vendedorNombre, setVendedorNombre] = useState(name || '');
  const [valor, setValor] = useState(0);
  const [fecha, setFecha] = useState(null);

  const registrar = async () => {
    const numeroFactura = await generarNumeroAleatorio();
    try {

      const factura = {
        lote_id: selectedLoteId,
        cliente_id: selectedClienteId,
        valor: valor,
        fecha: fecha,
        numerofactura: numeroFactura,
      };

      const { data } = await clienteMongoAxios.post('/api/payment/register', factura);
      console.log(data);

      toast.success('Abono Registrada con Éxito', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'bg-white dark:bg-boxdark'
      });

      setSelectedClienteId('');
      setSelectedLoteId('');
      setValor(0);
      setFecha(null);

    } catch (error) {
      console.log(error);
      toast.error('Error al Registrar Abono', {
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

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await clienteMongoAxios.get('/api/customers/getAll');
        setClientes(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de clientes', error);
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await clienteMongoAxios.get('/api/lote/getAll');
        setLotes(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de lotes', error);
      }
    };
    fetchLotes();
  }, []);

  return (
    <>
      <h1 className="text-title-lg font-bold">Registro de Abonos</h1>
      <ToastContainer />
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaCalendar className="inline-block mr-2" /> Fecha</label>
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
        <label className="mb-3 block text-black dark:text-white"><FaUser className="inline-block mr-2" /> Cliente</label>
        <select
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={selectedClienteId}
          onChange={(e) => setSelectedClienteId(e.target.value)}
        >
          <option value="">Selecciona un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="mb-3 block text-black dark:text-white"><FaSortNumericDown className="inline-block mr-2" /> Valor del Abono</label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={valor}
          onChange={(e) => setValor(parseFloat(e.target.value))}
        />
      </div>

      <button onClick={registrar}  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1">Registrar</button>
    </>
  );
}
