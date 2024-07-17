import React, { useState, useEffect } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { generarNumeroAleatorio } from '../../util/herreamientas';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { FaCalendar, FaPerson, FaUser } from 'react-icons/fa6';
import useAuth from '../../hooks/useAuth';

export default function FormFactura() {

  const { usuario } = useAuth()
  const [clientes, setClientes] = useState([]);
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [lotes, setLotes] = useState([]);
  const [selectedLoteId, setSelectedLoteId] = useState('');
  const { name, _id } = usuario[0]
  const [vendedorId, setVendedorId] = useState(_id || '');
  const [vendedorNombre, setVendedorNombre] = useState(name || '');
  const [cantidadAves, setCantidadAves] = useState(0);
  const [canastasVacias, setCanastasVacias] = useState([]);
  const [canastasLlenas, setCanastasLlenas] = useState([]);
  const [precioKilo, setPrecioKilo] = useState(0);
  const [fecha, setFecha] = useState('');
  const [inputsCanastas, setInputsCanastas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoCanasta, setTipoCanasta] = useState('');
  const [nuevaCanasta, setNuevaCanasta] = useState('');
  const [totalCanastasVacias, setTotalCanastasVacias] = useState(0);
  const [totalCanastasLlenas, setTotalCanastasLlenas] = useState(0);
  const [tempStorage, setTempStorage] = useState([]);
  const [valorFactura, setValorFactura] = useState(0);

  useEffect(() => {
    const totalVacias = canastasVacias.reduce((total, canasta) => total + parseFloat(canasta.valor), 0);
    setTotalCanastasVacias(totalVacias);

    const totalLlenas = canastasLlenas.reduce((total, canasta) => total + parseFloat(canasta.valor), 0);
    setTotalCanastasLlenas(totalLlenas);
  }, [canastasVacias, canastasLlenas]);

  useEffect(() => {
    const valor = precioKilo * (totalCanastasLlenas - totalCanastasVacias);
    setValorFactura(valor);
  }, [precioKilo, totalCanastasLlenas, totalCanastasVacias]);

  useEffect(() => {
    if (inputsCanastas.length === 0) {
      setTempStorage([]);
    }
  }, [inputsCanastas]);

  const handleOpenModal = (tipo) => {
    setTipoCanasta(tipo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNuevaCanasta('');
    setInputsCanastas([]);
  };

  const addCanasta = () => {
    if (nuevaCanasta.trim() !== '') {
      const nuevaCanastaValor = parseFloat(nuevaCanasta);
      if (!isNaN(nuevaCanastaValor)) {
        if (tipoCanasta === 'vacia') {
          setCanastasVacias([...canastasVacias, nuevaCanastaValor]);
        } else if (tipoCanasta === 'llena') {
          setCanastasLlenas([...canastasLlenas, nuevaCanastaValor]);
        }
        setInputsCanastas([...inputsCanastas, nuevaCanastaValor]);
        setNuevaCanasta('');
      }
    }
  };

  const handleInputChange = (index, value, tipo) => {
    const newInputs = [...inputsCanastas];
    newInputs[index] = parseFloat(value);
    setInputsCanastas(newInputs);

    if (tipo === 'vacia') {
      const newCanastasVacias = [...canastasVacias];
      newCanastasVacias[index] = parseFloat(value);
      setCanastasVacias(newCanastasVacias);
    } else if (tipo === 'llena') {
      const newCanastasLlenas = [...canastasLlenas];
      newCanastasLlenas[index] = parseFloat(value);
      setCanastasLlenas(newCanastasLlenas);
    }
  };

  const handleRemoveCanasta = (index, tipo) => {
    const newInputs = [...inputsCanastas];
    newInputs.splice(index, 1);
    setInputsCanastas(newInputs);

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

  const handleFinish = () => {
    setInputsCanastas([]);
    handleCloseModal();
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await clienteMongoAxios.get('/api/customers/getAll');
        setClientes(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de clientes', error);
        toast.error('Error al obtener la lista de clientes', {
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
    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await clienteMongoAxios.get('/api/lote/getAll');
        setLotes(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de clientes', error);
        toast.error('Error al obtener la lista de clientes', {
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
    fetchLotes();
  }, []);

  const registrar = async () => {
    const numeroFactura = await generarNumeroAleatorio();
    try {
      const totalKilos = totalCanastasLlenas - totalCanastasVacias;

      const factura = {
        lote_id: selectedLoteId,
        cliente_id: selectedClienteId,
        user_id: vendedorId,
        cantidadaves: cantidadAves,
        canastas_vacias: canastasVacias.map((canasta) => parseFloat(canasta.valor)),
        canastas_llenas: canastasLlenas.map((canasta) => parseFloat(canasta.valor)),
        preciokilo: precioKilo,
        fecha: fecha,
        numerofactura: numeroFactura,
        totalkilos: totalKilos,
      };

      const { data } = await clienteMongoAxios.post('/api/sale/register', factura);
      const { data2 } = await clienteMongoAxios.post('/api/saleMg/register', factura);
      console.log(data);
      console.log(data2);

      setCanastasVacias([]);
      setCanastasLlenas([]);
      setTempStorage([]);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="text-title-lg font-bold">Registro de Ventas</h1>

      <div>
        <label className="mb-3 block text-black dark:text-white"><FaCalendar className="inline-block mr-2" /> Fecha</label>
        <div className="relative">
          <input
            type="date"
            className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white"><FaUser className="inline-block mr-2" /> Lote</label>
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
        <label className="mb-3 block text-black dark:text-white">Vendedor</label>
        <input
          type="text"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={vendedorNombre}
          readOnly
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">Cantidad Aves</label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={cantidadAves}
          onChange={(e) => setCantidadAves(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">Canastas Vacías</label>
        {canastasVacias.map((canasta, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <TextField
              value={canasta.valor}
              onChange={(e) => handleInputChange(index, e.target.value, 'vacia')}
              fullWidth
              variant="outlined"
              style={{ marginRight: '10px' }}
            />
            <button
              className="flex justify-center rounded bg-red py-2 px-6 font-medium text-gray hover:shadow-1"
              onClick={() => handleRemoveCanasta(index, 'vacia')}
              style={{ marginLeft: '10px' }}
            >
              -
            </button>
          </div>
        ))}
        <button
          className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
          onClick={() => handleOpenModal('vacia')}
        >
          Agregar Canastas Vacías
        </button>
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">Canastas Llenas</label>
        {canastasLlenas.map((canasta, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <TextField
              value={canasta.valor}
              onChange={(e) => handleInputChange(index, e.target.value, 'llena')}
              fullWidth
              variant="outlined"
              style={{ marginRight: '10px' }}
            />
            <button
              className="flex justify-center rounded bg-red py-2 px-6 font-medium text-gray hover:shadow-1"
              onClick={() => handleRemoveCanasta(index, 'llena')}
              style={{ marginLeft: '10px' }}
            >
              -
            </button>
          </div>
        ))}
        <button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal('llena')}
          className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
        >
          Agregar Canastas Llenas
        </button>
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">Precio Kilo</label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={precioKilo}
          onChange={(e) => setPrecioKilo(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">Total Kilos</label>
        <input
          type="text"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={totalCanastasLlenas - totalCanastasVacias}
          readOnly
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">Valor de Factura</label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={valorFactura}
          disabled
        />
      </div>
      <button
        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
        onClick={() => registrar()}
      >
        Generar
      </button>

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          Agregar Canasta {tipoCanasta === 'vacia' ? 'Vacía' : 'Llena'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Canasta ${tipoCanasta === 'vacia' ? 'Vacía' : 'Llena'}`}
          </DialogContentText>
          {inputsCanastas.map((canasta, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <TextField
                value={canasta.valor}
                onChange={(e) => handleInputChange(index, e.target.value)}
                fullWidth
                variant="outlined"
                style={{ marginRight: '10px' }}
              />
              <button
                className="flex justify-center rounded bg-red py-2 px-6 font-medium text-gray hover:shadow-1"
                onClick={() => handleRemoveCanasta(index)}
                style={{ marginLeft: '10px' }}
              >
                -
              </button>
            </div>
          ))}
          <TextField
            value={nuevaCanasta}
            onChange={(e) => setNuevaCanasta(e.target.value)}
            fullWidth
            variant="outlined"
            label={`Nueva Canasta ${tipoCanasta === 'vacia' ? 'Vacía' : 'Llena'}`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={addCanasta} color="primary">
            Agregar
          </Button>
          <Button onClick={handleFinish} color="primary">
            Terminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

