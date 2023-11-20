import React, { useState } from 'react'
import clienteMongoAxios from '../config/clienteMongoAxios'

export default function FormInsumos() {

    const [proveedor, setProveedor] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [precio, setPrecio] = useState(0)
    const [fecha, setFecha] = useState("")

    const registrar = async () => {
        try {
            const {data} = await clienteMongoAxios.post('/api/supplies/register',{proveedor: proveedor, descripcioncompra: descripcion, preciocompra: precio, fecha: fecha})
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Proveedor
        </label>
        <input
          type="text"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={proveedor}
            onChange={e => setProveedor(e.target.value)}        
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Descripcion de la Compra
        </label>
        <input
          type="text"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}  
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Precio de la Compra
        </label>
        <input
          type="number"
          placeholder="Default Input"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={precio}
          onChange={e => setPrecio(e.target.value)}  
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
