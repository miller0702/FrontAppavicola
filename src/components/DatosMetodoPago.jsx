import React, { useEffect, useState } from "react";
// import axios from "axios";
import clienteMongoAxios from "../config/clienteMongoAxios";

export default function DatosMetodoPago() {
  const [metodo, setMetodo] = useState("");
  const [bancoSeleccionado, setBancoSeleccionado] = useState("");

  const [ bancos, setBancos ] = useState([])
  const [ metodos, setMetodos ] = useState([])

  useEffect(() => {
    getMetodos();
    getBancos();
  },[])

  const pagar = () => {
    console.log('object')
  }
  
  const getMetodos = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/pagos/getMetodos');

      const metodosColombia = data.paymentMethods.filter( method => {
        return method.country === 'CO'
      })
      setMetodos(metodosColombia)
    } catch (error) {
      console.log(error)
    }

  };

  const getBancos = async () => {

    try {
      const { data } = await clienteMongoAxios.get('/api/pagos/getPse');
      setBancos(data.banks)
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <>
      <div className="flex flex-col items-center p-5 gap-1">
        <div className="flex gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#F97316"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            />
          </svg>
          <h2 className="text-zinc-50 block text-lg">Metodo de pago</h2>
        </div>
      </div>

      <div className="h-0.5 bg-zinc-50" />

      <div className="flex w-full gap-5 mb-5">
        <div className="w-6/12">
          <label htmlFor="forma" className=" text-zinc-50 block text-lg ">
            Forma de pago
          </label>
          <select
            id="forma"
            placeholder="Tipo de Persona"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={metodo}
            onChange={(e) =>{ setMetodo(e.target.value); console.log(e.target.value) }}
          >
            {
              metodos.map((metodoState, index) => (
                <option key={index} value={metodoState.id}>{metodoState.description}</option>
              ))
            }
          </select>
        </div>
        <div className="w-6/12">
          <label htmlFor="Banco" className=" text-zinc-50 block text-lg ">
            Banco
          </label>

            {
              metodo === '254' && (

                <select
                id="Banco"
                placeholder="Tipo de Persona"
                className="w-full mt-2 p-2 border rounded-md bg-gray-50"
                value={bancoSeleccionado}
                onChange={(e) => setBancoSeleccionado(e.target.value)}
                >
                  {
                    bancos.map(bancoState => (
                      <option key={bancoState.id} value={bancoState.pseCode}>{bancoState.description}</option>
                      ))
                    }
                </select>
              )
            }

        </div>
      </div>

      <div className="h-0.5 bg-zinc-50" />

      <div className="flex w-full items-center justify-around p-5">
        <button
          className="bg-orange-500 text-zinc-50 p-2 text-lg font-semibold rounded-md"
          onClick={pagar}
        >
          Siguiente
        </button>
      </div>
    </>
  );
}
