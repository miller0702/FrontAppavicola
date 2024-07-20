import React, { useState } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoPersonOutline, IoCardOutline, IoCallOutline } from 'react-icons/io5';

export default function FormClientes() {
  const [nombre, setCliente] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");

  const registrar = async () => {
    try {
      const { data } = await clienteMongoAxios.post('/api/customers/register', { nombre, documento, telefono });
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

      setCliente("");
      setDocumento("");
      telefono("");
      
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
  }

  return (
    <>

      <h1 className='text-title-lg font-bold'>Registro de Clientes</h1>
      <ToastContainer />
      <div>
        <label className="mb-3 block text-black dark:text-white">
          <IoPersonOutline className="inline-block mr-2" />
          Nombre
        </label>
        <input
          type="text"
          placeholder="Ingrese aquí el nombre completo"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={nombre}
          onChange={e => setCliente(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          <IoCardOutline className="inline-block mr-2" />
          Documento
        </label>
        <input
          type="text"
          placeholder="Ingrese aquí el documento"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={documento}
          onChange={e => setDocumento(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          <IoCallOutline className="inline-block mr-2" />
          Teléfono
        </label>
        <input
          type="text"
          placeholder="Ingrese aquí el teléfono"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
        />
      </div>
      <button
        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
        onClick={() => { registrar() }}
      >
        Guardar
      </button>
    </>
  );
}
