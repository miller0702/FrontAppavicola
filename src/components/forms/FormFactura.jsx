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
  const [cantidadAves, setCantidadAves] = useState(0);
  const [canastasVacias, setCanastasVacias] = useState([]);
  const [canastasLlenas, setCanastasLlenas] = useState([]);
  const [precioKilo, setPrecioKilo] = useState(0);
  const [fecha, setFecha] = useState(null);
  const [nuevaCanastaVacia, setNuevaCanastaVacia] = useState('');
  const [nuevaCanastaLlena, setNuevaCanastaLlena] = useState('');
  const [totalCanastasVacias, setTotalCanastasVacias] = useState(0);
  const [totalCanastasLlenas, setTotalCanastasLlenas] = useState(0);
  const [valorFactura, setValorFactura] = useState(0);

  useEffect(() => {
    const totalVacias = canastasVacias.reduce((total, canasta) => total + parseFloat(canasta), 0);
    setTotalCanastasVacias(totalVacias);

    const totalLlenas = canastasLlenas.reduce((total, canasta) => total + parseFloat(canasta), 0);
    setTotalCanastasLlenas(totalLlenas);
  }, [canastasVacias, canastasLlenas]);

  useEffect(() => {
    const valor = precioKilo * (totalCanastasLlenas - totalCanastasVacias);
    setValorFactura(valor);
  }, [precioKilo, totalCanastasLlenas, totalCanastasVacias]);

  const addCanasta = (tipo) => {
    if (tipo === 'vacia') {
      if (nuevaCanastaVacia.trim() !== '') {
        const nuevaCanastaValor = parseFloat(nuevaCanastaVacia);
        if (!isNaN(nuevaCanastaValor)) {
          setCanastasVacias([...canastasVacias, nuevaCanastaValor]);
          setNuevaCanastaVacia('');
        }
      }
    } else if (tipo === 'llena') {
      if (nuevaCanastaLlena.trim() !== '') {
        const nuevaCanastaValor = parseFloat(nuevaCanastaLlena);
        if (!isNaN(nuevaCanastaValor)) {
          setCanastasLlenas([...canastasLlenas, nuevaCanastaValor]);
          setNuevaCanastaLlena('');
        }
      }
    }
  };

  const handleInputChange = (index, value, tipo) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      if (tipo === 'vacia') {
        const newCanastasVacias = [...canastasVacias];
        newCanastasVacias[index] = newValue;
        setCanastasVacias(newCanastasVacias);
      } else if (tipo === 'llena') {
        const newCanastasLlenas = [...canastasLlenas];
        newCanastasLlenas[index] = newValue;
        setCanastasLlenas(newCanastasLlenas);
      }
    }
  };

  const handleRemoveCanasta = (index, tipo) => {
    if (tipo === 'vacia') {
      const newCanastasVacias = [...canastasVacias];
      newCanastasVacias.splice(index, 1);
      setCanastasVacias(newCanastasVacias);
    } else if (tipo === 'llena') {
      const newCanastasLlenas = [...canastasLlenas];
      newCanastasLlenas.splice(index, 1);
      setCanastasLlenas(newCanastasLlenas);
    }
  };

  const registrar = async () => {
    const numeroFactura = await generarNumeroAleatorio();
    try {
      const totalKilos = totalCanastasLlenas - totalCanastasVacias;
  
      const factura = {
        lote_id: selectedLoteId,
        cliente_id: selectedClienteId,
        user_id: vendedorId,
        cantidadaves: cantidadAves,
        canastas_vacias: canastasVacias.map((canasta) => parseFloat(canasta)),
        canastas_llenas: canastasLlenas.map((canasta) => parseFloat(canasta)),
        preciokilo: precioKilo,
        fecha: fecha,
        numerofactura: numeroFactura,
        totalkilos: totalKilos,
      };
  
      const { data } = await clienteMongoAxios.post('/api/sale/register', factura);
      
      if (data && data.success) {
        console.log(data);
  
        toast.success('Factura Registrada con Éxito', {
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
        setCantidadAves(0);
        setCanastasVacias([]);
        setCanastasLlenas([]);
        setPrecioKilo(0);
        setFecha(null);
        setTotalCanastasVacias(0);
        setTotalCanastasLlenas(0);
        setValorFactura(0);
      } else {
        throw new Error('Error en el registro de la factura en /api/sale/register');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error al Registrar Factura', {
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

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };

  return (
    <>
      <h1 className="text-title-lg font-bold">Registro de Ventas</h1>
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
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaUser className="inline-block mr-2" /> Vendedor</label>
        <input
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          type="text"
          value={vendedorNombre}
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="mb-3 block text-black dark:text-white"><FaSortNumericDown className="inline-block mr-2" /> CantidadAves</label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={cantidadAves}
          onChange={(e) => setCantidadAves(parseFloat(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="mb-3 block text-black dark:text-white"><FaBox className="inline-block mr-2" /> Canastas Vacías</label>
        {canastasVacias.map((canasta, index) => (
          <div key={index} className="flex items-center">
            <TextField
              type="number"
              value={canasta}
              onChange={(e) => handleInputChange(index, e.target.value, 'vacia')}
              variant="outlined"
              size="small"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent mt-3 py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <button onClick={() => handleRemoveCanasta(index, 'vacia')} className='rounded py-3 px-6 font-medium text-gray bg-red'>
              <FaTrash />
            </button>
          </div>
        ))}
        <div className="flex items-center mt-2">
          <TextField
            type="number"
            value={nuevaCanastaVacia}
            onChange={(e) => setNuevaCanastaVacia(e.target.value)}
            variant="outlined"
            size="small"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <button onClick={() => addCanasta('vacia')}  className='rounded py-3 px-6 font-medium text-gray bg-primary'>
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-3 block text-black dark:text-white"><FaBox className="inline-block mr-2" /> Canastas Llenas</label>
        {canastasLlenas.map((canasta, index) => (
          <div key={index} className="flex items-center">
            <TextField
              type="number"
              value={canasta}
              onChange={(e) => handleInputChange(index, e.target.value, 'llena')}
              variant="outlined"
              size="small"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent mb-3 py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <button onClick={() => handleRemoveCanasta(index, 'llena')} className='rounded py-3 px-6 font-medium text-gray bg-red'>
              <FaTrash />
            </button>
          </div>
        ))}
        <div className="flex items-center mt-2">
          <TextField
            type="number"
            value={nuevaCanastaLlena}
            onChange={(e) => setNuevaCanastaLlena(e.target.value)}
            variant="outlined"
            size="small"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <button onClick={() => addCanasta('llena')}  className='rounded py-3 px-6 font-medium text-gray bg-primary'>
            <FaPlus />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-3 block text-black dark:text-white"><FaDollarSign className="inline-block mr-2" /> Precio por Kilo</label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={precioKilo}
          onChange={(e) => setPrecioKilo(parseFloat(e.target.value))}
        />
      </div>

      <div className="flex justify-between mb-5">
        <div>
          <h4 className="text-title-sm font-bold">Total Kilos</h4>
          <h1 className="text-title-lg font-bold">{(totalCanastasLlenas - totalCanastasVacias).toFixed(1)} KG</h1>
        </div>
        <div>
          <h2 className="text-title-sm font-bold">Valor de la Factura</h2>
          <p className="text-title-lg font-bold">{formatearPrecio(valorFactura.toFixed(0))}</p>
        </div>
      </div>

      <button onClick={registrar}  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1">Registrar</button>
    </>
  );
}
