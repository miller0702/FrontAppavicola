import React, { useEffect, useState } from "react";
import clienteMongoAxios from "../../config/clienteMongoAxios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMale, FaFemale, FaCalendarAlt, FaThList } from "react-icons/fa";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { format } from 'date-fns';

export default function FormMortalidad() {
  const [cantidadmacho, setCantidadmacho] = useState(0);
  const [cantidadhembra, setCantidadhembra] = useState(0);
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

  const registrar = async () => {
    try {
      const { data } = await clienteMongoAxios.post(
        "/api/mortality/register",
        { lote_id: selectedLoteId, cantidadmacho, cantidadhembra, fecha }
      );
      toast.success("Registro exitoso", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "bg-white dark:bg-boxdark",
      });

      setSelectedLoteId('');
      setCantidadmacho(0);
      setCantidadhembra(0);
      setFecha(null);

    } catch (error) {
      toast.error("Error al registrar", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "bg-white dark:bg-boxdark text-black dark:text-white",
      });
    }
  };

  return (
    <>
      <h1 className='text-title-lg font-bold'>Registro de Mortalidad</h1>
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
        <label className="mb-3 block text-black dark:text-white">
          <FaMale className="inline-block mr-2" />
          Cantidad Macho
        </label>
        <input
          type="number"
          placeholder="Cantidad Macho"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={cantidadmacho}
          onChange={(e) => setCantidadmacho(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          <FaFemale className="inline-block mr-2" />
          Cantidad Hembra
        </label>
        <input
          type="number"
          placeholder="Cantidad Hembra"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={cantidadhembra}
          onChange={(e) => setCantidadhembra(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          <FaCalendarAlt className="inline-block mr-2" />
          Fecha
        </label>
        <div className="relative">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Seleccione la fecha"
              value={fecha}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              onChange={(newValue) => setFecha(newValue)}
              renderInput={(params) => {
                const formattedValue = fecha ? format(fecha, 'ddMMyyyy') : '';
                return <TextField {...params} value={formattedValue} fullWidth />;
              }}
              format="dd-MM-yyyy"
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
