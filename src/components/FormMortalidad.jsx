import React, { useState } from "react";
import clienteMongoAxios from "../config/clienteMongoAxios";

export default function FormMortalidad() {

    const [cantidadmacho, setCantidadmacho] = useState(0)
    const [cantidadhembra, setCantidadhembra] = useState(0)
    const [fecha, setFecha] = useState("")

    const registrar = async () => {
        try {
            const {data} = await clienteMongoAxios.post('/api/mortality/register',{cantidadmacho, cantidadhembra, fecha})
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Cantidad Macho
        </label>
        <input
          type="number"
          placeholder="Default Input"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={cantidadmacho}
            onChange={e => setCantidadmacho(e.target.value)}        
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Cantidad Hembra
        </label>
        <input
          type="number"
          placeholder="Default Input"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={cantidadhembra}
          onChange={e => setCantidadhembra(e.target.value)}  
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Fecha
        </label>
        <div className="relative">
          <input
            type="date"
            className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={fecha}
            onChange={e => setFecha(e.target.value)}            
          />
        </div>
      </div>
      <button
        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
        onClick={() => {registrar()}}
      >
        Guardar
      </button>
    </>
  );
}
