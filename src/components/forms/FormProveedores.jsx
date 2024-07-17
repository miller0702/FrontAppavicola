import React, { useState } from 'react'
import clienteMongoAxios from '../../config/clienteMongoAxios'

export default function FormProveedores() {

    const [nombre, setProveedor] = useState("")
    const [documento, setDocumento] = useState("")
    const [telefono, setTelefono] = useState("")

    const registrar = async () => {
        try {
            const {data} = await clienteMongoAxios.post('/api/suppliers/register',{nombre: nombre, documento: documento, telefono: telefono})
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <>
    <h1 className='text-title-lg font-bold'>Registro de Proveedores</h1>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Nombre
        </label>
        <input
          type="text"
          placeholder="Ingrese aqui el nombre completo"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={nombre}
            onChange={e => setProveedor(e.target.value)}        
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Documento
        </label>
        <input
          type="text"
          placeholder="Ingrese aqui el nit del proveedor"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={documento}
          onChange={e => setDocumento(e.target.value)}  
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Telefono
        </label>
        <input
          type="text"
          placeholder="Ingrese aqui el teléfono"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}  
        />
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
