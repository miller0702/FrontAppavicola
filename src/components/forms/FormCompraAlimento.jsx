import React, { useState, useEffect } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUniversity, FaCalendarAlt, FaDollarSign, FaTypo3, FaArrowUp, FaMapMarkerAlt } from 'react-icons/fa';

export default function FormCompraAlimento() {
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedorId, setSelectedProveedorId] = useState('');
  const [fecha, setFecha] = useState(null);
  const [procedencia, setProcedencia] = useState('');
  const [tipoPurina, setTipoPurina] = useState('');
  const [cantidadBultos, setCantidadBultos] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [valorFlete, setValorFlete] = useState('');
  const [valorBultos, setValorBultos] = useState('');
  const [valorConFlete, setValorConFlete] = useState('');

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

  const calcularValorBultos = () => {
    const cantidad = parseInt(cantidadBultos);
    const valor = parseFloat(valorUnitario);
    if (!isNaN(cantidad) && !isNaN(valor)) {
      const valorCalculado = cantidad * valor;
      setValorBultos(valorCalculado.toFixed(2));
    } else {
      setValorBultos('');
    }
  };

  const calcularValorConFlete = () => {
    const flete = parseFloat(valorFlete);
    const bultos = parseFloat(valorBultos);
    if (!isNaN(flete) && !isNaN(bultos)) {
      const valorCalculado = flete + bultos;
      setValorConFlete(valorCalculado.toFixed(2));
    } else {
      setValorConFlete('');
    }
  };

  const handleChangeCantidadBultos = (e) => {
    const value = e.target.value;
    setCantidadBultos(value);
    calcularValorBultos();
    calcularValorConFlete(); 
  };

  const handleChangeValorUnitario = (e) => {
    const value = e.target.value;
    setValorUnitario(value);
    calcularValorBultos();
    calcularValorConFlete();
  };

  const registrar = async () => {
    try {
      const { data } = await clienteMongoAxios.post('/api/buys/register', {
        proveedor_id: selectedProveedorId,
        fecha: fecha.toISOString().split('T')[0],
        procedencia: procedencia,
        tipo_purina: tipoPurina,
        cantidad_bultos: parseInt(cantidadBultos),
        valor_unitario: parseFloat(valorUnitario),
        valor_flete: parseFloat(valorFlete),
        valor_bultos: parseFloat(valorBultos),
        valor_con_flete: parseFloat(valorConFlete),
      });
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
      console.error('Error al registrar', error);
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
      <h1 className='text-title-lg font-bold'>Registro de Compra de Alimento</h1>
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
          <FaCalendarAlt className="inline-block mr-2" />
          Fecha de Compra
        </label>
        <div className="relative">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Seleccione la fecha"
              value={fecha}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              onChange={(date) => setFecha(date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </div>
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaMapMarkerAlt className="inline-block mr-2" /> Procedencia</label>
        <select
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={procedencia}
          onChange={(e) => setProcedencia(e.target.value)}
        >
          <option value="">Selecciona la procedencia</option>
          <option value="Ocana">Ocaña</option>
          <option value="Bucaramanga">Bucaramanga</option>
        </select>
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaTypo3 className="inline-block mr-2" /> Tipo de Purina</label>
        <select
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={tipoPurina}
          onChange={(e) => setTipoPurina(e.target.value)}
        >
          <option value="">Selecciona el tipo de purina</option>
          <option value="P">Preiniciador</option>
          <option value="I">Iniciador</option>
          <option value="Q">Engorde Quebrantada</option>
          <option value="E">Engorde</option>
        </select>
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaArrowUp className="inline-block mr-2" /> Cantidad de Bultos</label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={cantidadBultos}
          onChange={handleChangeCantidadBultos}
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaDollarSign className="inline-block mr-2" /> Valor Unitario</label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={valorUnitario}
          onChange={handleChangeValorUnitario}
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaDollarSign className="inline-block mr-2" /> Valor del Flete</label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={valorFlete}
          onChange={(e) => {
            setValorFlete(e.target.value);
            calcularValorConFlete();
          }}
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaDollarSign className="inline-block mr-2" /> Valor de los Bultos</label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={valorBultos}
          readOnly
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaDollarSign className="inline-block mr-2" /> Valor con Flete</label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={valorConFlete}
          readOnly
        />
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
